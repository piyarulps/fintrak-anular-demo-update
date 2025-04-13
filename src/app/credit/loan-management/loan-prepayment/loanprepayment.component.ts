import { OnDestroy } from '@angular/core';
//import { LoanService } from '../../services/loan.service';
import swal from 'sweetalert2';
import { DateUtilService } from '../../../shared/services/dateutils';
import { LoanOperationService } from '../../services/loan-operations.service';
import { Subject ,  Subscription } from 'rxjs';
import { LoadingService } from '../../../shared/services/loading.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { LoanPrepaymentService } from '../../services/loan-prepayment.service';
import { ApprovalGroupRole, ApprovalStatus, RequestStatus, GlobalConfig, ConvertString } from '../../../shared/constant/app.constant';
import { LoanService } from 'app/credit/services';

@Component({
  selector: 'app-loanprepayment',
  templateUrl: './loanprepayment.component.html',
})

export class LoanPrepaymentComponent implements OnInit, OnDestroy {
  totalAmount: any;
  prepaymentMethod : number;
  itemTotal: number;
  outstandingPrincipal:any;
  principalAmount: number;
  displayScheduleModalForm: boolean;
  selectedId: number = null;
  displayAddModal: boolean = false;
  displaySearchModal: boolean = false;
  entityName: string = "Loan Prepayment";
  searchTerm$ = new Subject<any>();
  searchResults: any[];
  loanReferenceNumber: string;
  loanId: number;
  productTypeId: number;
  lmsApplicationDetailId: number;
  loanPrepaymentForm: FormGroup;
  prepayments: any[];
  recoveries: any[];
  casas: any[];
  applicationsInputer: any[] = [];
  agents: any[];
  loanPrepaymentData: any = {};
  maintainTenor: boolean;
  loanPrepayments: any[];
  displayData: boolean = false;
  displayData2: boolean = false;
  displaySearch: boolean = false;
  displayMaturityDate: boolean = false;
  displayEffectiveDate: boolean = false;
  scheduleType: number;
  displayIrregularSchedule: boolean = false;
  displayRegularSchedule: boolean = false;
  loanSystemTypeId: number;
  data: any = {};
  principalValanceString: any;
  newPrincipalBalance: any;
  scatterdPayments: any[] = [];
  principalBalance: number;
  applicationSelection: any;
  bodyObj: any = {};
  schedules: any[];
  scheduleHeader: any = {};
  maturityDate: any;
  validationDate: any;
  generateData: any = {};
  displayLoanDetailsModal: boolean;
  termLoanId: number = 0;

  show: boolean = false; message: any; title: any; cssClass: any;

  prepaymentMothods: any[] = [
    { id:1, name:'Maintain Tenor' },
    { id:2, name:'Use Existing Repayment' },
];
private subscriptions = new Subscription();
  ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }


  constructor(private loadingService: LoadingService, private fb: FormBuilder,
    private loanPrepaymentService: LoanPrepaymentService,
    private loanOperationService: LoanOperationService,
    private dateUtilService: DateUtilService,
    private loanService: LoanService) {
      this.subscriptions.add(
    this.loanOperationService.searchForLoanPrepayment(this.searchTerm$)
      .subscribe((results: any) => {
        this.searchResults = results.result;

      }));
  }

  ngOnInit() {
    this.displaySearch = true;
    this.clearControls();
    this.getLoanApplications();
  }

  selectOption(id: number) {
    //console.log("Victor",id);
    this.prepaymentMethod = id;
  }

  showAddModal() {
    this.clearControls();
    this.entityName = "Loan Prepayment";
    this.displayAddModal = true;
  }

  openSearchBox(): void {
    this.displaySearchModal = true;
  }

  searchDB(searchString) {
    this.searchTerm$.next(searchString);
  }

  getRunningLoan(refNo) {
    if(refNo == null || refNo == ""){
      refNo = this.applicationSelection.loanReferenceNumber;
    }
    this.loadingService.show();
    this.subscriptions.add(
    this.loanPrepaymentService.getRunningLoan(refNo)
    .subscribe((response: any) => {
      this.loadingService.hide()
      if (response.success == true) {
        this.loanPrepaymentData = response.result;
        if (this.loanPrepaymentData != null) {
          const row = this.loanPrepaymentData;
          this.validationDate = row.previousEffectiveDate;
          this.totalAmount = ConvertString.ToNumberFormate(row.outstandingPrincipal + row.pastDueTotal + row.pastDuePrincipal + row.accrualedAmount);
          this.outstandingPrincipal = ConvertString.ToNumberFormate(row.outstandingPrincipal);
          this.generateData = row;
          this.loanPrepaymentForm = this.fb.group({
            loanReferenceNumber: [row.loanReferenceNumber],
            approvedAmount: [ConvertString.ToNumberFormate(row.approvedAmount)],
            outstandingPrincipal: [ConvertString.ToNumberFormate(row.outstandingPrincipal)],
            interestRate: [row.interestRate],
            equityContribution: [row.equityContribution,Validators.required],
            effectiveDate: [new Date(row.effectiveDate)],
            maintainTenor: true,
            maturityDate: [new Date(row.maturityDate)],
            accrualedAmount: [ConvertString.ToNumberFormate(row.accrualedAmount)],
            // accrualedAmount: [0],// [ConvertString.ToNumberFormate(row.accrualedAmount)],
            scheduleTypeId: [row.scheduleTypeId],
            newtenor: [row.newtenor],
            teno: [row.teno],
            scheduleTypeCategoryId: [row.scheduleTypeCategoryId],
            totalAmount: [this.totalAmount],
            //totalAmount:[this.outstandingPrincipal],
            previousEffectiveDate: [new Date(row.previousEffectiveDate)],
            pastDueTotal: [ConvertString.ToNumberFormate(row.pastDueTotal)],
            pastDuePrincipal: [ConvertString.ToNumberFormate(row.pastDuePrincipal)],
            currency: [row.currency],
            loanId: [row.loanId],

            

          });
          //  ////console.log("")
          //this.loanPrepaymentForm.controls['previousEffectiveDate'].disable();
          //this.principalValanceString = this.totalAmount; //row.totalAmount;
          this.principalValanceString = this.outstandingPrincipal;
          this.calculateTenor();
          if (row.scheduleTypeCategoryId === 2) {
            this.displayIrregularSchedule = true;
          }
          else {
            this.displayIrregularSchedule = false;
          }
        }
        this.displayMaturityDate = false;
        this.displayEffectiveDate = true;
      } else {
        this.showMessage(response.message, "error", "FintrakBanking");
      }

    }));
  }

  loanDetails() {
    this.termLoanId = this.loanPrepaymentData.loanId;
    this.loanSystemTypeId = this.loanPrepaymentData.loanSystemTypeId;
    this.displayLoanDetailsModal = true;
    // console.log("loanPrepaymentData => ", this.loanPrepaymentData);
  }

  pickSearchedData(item) {
    this.displayData2 = true;
    this.displayData = true;
    this.loanReferenceNumber = item.loanReferenceNumber;
    this.loanId = item.loanId;
    this.productTypeId = item.productTypeId;
    this.lmsApplicationDetailId = item.loanReviewApplicationId;
    this.displaySearch = false;
    this.displaySearchModal = false;
    this.displayIrregularSchedule = false;
    this.displayRegularSchedule = false;
    this.scatterdPayments = [];
    this.getRunningLoan(this.loanReferenceNumber);

  }

  submitForm(formObj) {
    this.loadingService.show();
    let bodyObj = {
      loanReviewOperationsId: null,
      loanId: this.loanId,
      productTypeId: this.productTypeId,
      loanSystemTypeId: 1,
      lmsApplicationDetailId: this.lmsApplicationDetailId,
      operationTypeId: 21,
      reviewDetails: "Repayment Operation",
      proposedEffectiveDate: this.loanPrepaymentForm.get('previousEffectiveDate').value,
      interateRate: formObj.value.interestRate,
      prepayment: formObj.value.equityContribution,
      maturityDate: formObj.value.maturityDate,
      principalFrequencyTypeId: null,
      interestFrequencyTypeId: null,
      principalFirstPaymentDate: null,
      interestFirstPaymentDate: null,
      tenor: formObj.value.newtenor,
      cASA_AccountId: null,
      accountNumber: null,
      overDraftTopup: null,
      fee_Charges: null,
      terminationAndReBook: null,
      completeWriteOff: null,
      cancelUndisbursedLoan: null,
      approvalStatusId: 0,
      isManagementRate: false,
      operationCompleted: 0,
      reviewIrregularSchedule: this.scatterdPayments,
      prepaymentMethodId : this.prepaymentMethod
    }
    ////console.log('Pass', bodyObj);
    if (this.selectedId === null) {
      this.subscriptions.add(
      this.loanPrepaymentService.save(bodyObj).subscribe((res) => {
        if (res.success == true) {
          this.scatterdPayments = [];
          this.finishGood(res.message);
          this.displayMaturityDate = false;
          this.displayEffectiveDate = true;
          this.backToSearch();
        } else {
          this.finishBad(res.message);
        }
      }, (err: any) => {
        this.finishBad(JSON.stringify(err));
      }));
    }
  }


  keepTenor(evt) {
    let body = {
      maintainTenor: evt,

    };
    if (evt === true) {
      this.displayMaturityDate = false;
      this.displayEffectiveDate = true;
    }
    else {
      this.displayMaturityDate = true;
      this.displayEffectiveDate = true;
    }

  }
  clearControls() {
    this.selectedId = null;
    try {
      this.loanPrepaymentForm.controls['loanReferenceNumber'].setValue(null);
    } catch (error) {
      ////console.log('The system resolved a form-control error');
    }
    this.loanPrepaymentForm = this.fb.group({
      approvedAmount: ['', Validators.required],
      loanReferenceNumber: ['', Validators.required],
      outstandingPrincipal: ['', Validators.required],
      interestRate: ['', Validators.required],
      equityContribution: ['', Validators.required],
      effectiveDate: [''],//, Validators.required],
      maturityDate: ['', Validators.required],
      accrualedAmount: ['', Validators.required],
      scheduleTypeId: ['', Validators.required],
      teno: [''],
      newtenor: ['', Validators.required],
      scheduleTypeCategoryId: [0],
      totalAmount: [0],
      previousEffectiveDate: [''],
      maintainTenor: [true],
      currency: [''],
      pastDueTotal: [0],
      pastDuePrincipal: [0],
      prepaymentMethod: ['', Validators.required],

    });
  }


  getLoanApplications() {
  this.loadingService.show();
    this.loanOperationService.getLoanApplicationsInputer().subscribe((response:any) => {
        this.itemTotal = response.count; 
        this.applicationsInputer = response.result; 
        this.loadingService.hide();
    }, (err) => {
        this.loadingService.hide(1000); 
    });
}

  validateEffectiveDate(){
   
    let previousEffectiveDate = new Date(this.loanPrepaymentForm.get('previousEffectiveDate').value);

    if (previousEffectiveDate  < new Date(this.validationDate)) {
      this.showMessage("Effective Date Cannot Be Backdated.", "error", "FintrakBanking");
      this.loanPrepaymentForm.get('previousEffectiveDate').setValue( new Date(this.validationDate));
    }
  }

  calculateMaturityDate() {
    this.loanPrepaymentForm.controls['maturityDate'].setValue(null);
    let newTenor = this.loanPrepaymentForm.get('newtenor').value;
    if (newTenor <= 0) {
      this.showMessage("System cannot calculate maturity date with zero tenor.", "error", "FintrakBanking");
    }
    let effectiveDate = this.loanPrepaymentForm.get('effectiveDate').value;
    let ret = new Date(effectiveDate);
    var maturityDate = new Date(ret.getTime() + newTenor * 86400 * 1000);
    this.loanPrepaymentForm.controls['maturityDate'].setValue(maturityDate);
  }
  calculateTenor() {
    this.loanPrepaymentForm.controls['newtenor'].setValue(null);
    let effectiveDate = this.loanPrepaymentForm.get('effectiveDate').value;
    let maturityDate = this.loanPrepaymentForm.get('maturityDate').value;
    if (new Date(effectiveDate) > new Date(maturityDate)) {
      this.showMessage("Effective Date cannot be greater than Maturity Date.", "error", "FintrakBanking");
      return;
    }
    var tenor = this.dateUtilService.dateDiff(effectiveDate, maturityDate);
    this.loanPrepaymentForm.controls['newtenor'].setValue(tenor);
  }
 
  calculateBalance(event) {
    //let totalAmount = this.totalAmount.replace(/[,]+/g, "").trim();  // this.generateData.totalAmount//this.loanPrepaymentForm.get('totalAmount').value;
    
    let totalAmount = this.outstandingPrincipal.replace(/[,]+/g, "").trim();  // this.generateData.totalAmount//this.loanPrepaymentForm.get('totalAmount').value;
    this.newPrincipalBalance = (Number(totalAmount) - Number(event.replace(/[,]+/g, "").trim()));
    this.principalAmount = parseFloat(Number(this.newPrincipalBalance).toFixed(2));
    this.principalValanceString = parseFloat(Number(this.newPrincipalBalance).toFixed(2)); //this.toDec(this.newPrincipalBalance, 2); //this.newPrincipalBalance;
    if (Number(this.principalValanceString) < 0) {
      this.showMessage("Payment Amount cannot be greater than Total Amount", "error", "FintrakBanking");
      this.principalValanceString = Number(0);
      this.newPrincipalBalance= Number(0);
      this.loanPrepaymentForm.controls['equityContribution'].setValue(0);
      return;
    }
    //this.loanPrepaymentForm.controls['equityContribution'].setValue(ConvertString.ToNumberFormate(event));
  }

  finishBad(message) {
    this.showMessage(message, 'error', "FintrakBanking");
    this.loadingService.hide();
  }

  finishGood(message) {
    this.clearControls();
    this.loadingService.hide();
    this.showMessage(message, 'success', "FintrakBanking");
  }

  showMessage(message: string, cssClass: string, title: string) {
    this.message = message;
    this.title = title;
    this.cssClass = cssClass;
    this.show = true;
  }

  hideMessage(event) {
    this.show = false;
  }
  backToSearch() {
    this.displaySearch = true;
    this.displayData = false
  }

  addToList() {
    ////console.log('OKOKOMAIKO', Number(this.principalValanceString) - Number(this.data.amount));
    if ((Number(this.principalValanceString) - Number(this.data.amount)) < 0) {
      swal('FinTrak Credit 360', "Payment amount cannot be greater than outstanding balance", "error");
      return;
    }
    // if (new Date(this.data.scateredDate) < new Date(this.loanPrepaymentForm.get('effectiveDate').value)) {
    //   swal('FinTrak Credit 360', "Payment date cannot be less than effective date", "error");
    //   // this.data.scateredDate = null;
    //   return;
    // }
    var pmts = {
      paymentDate: new Date(this.data.scateredDate),//this.dateUtilService.formatJsonDate(this.data.scateredDate),
      paymentAmount: this.data.amount
    };
    // this.irregularReviewCollection.push(pmts);
    this.scatterdPayments.push(pmts);
    this.principalBalance = (Number(this.principalValanceString) - Number(pmts.paymentAmount));
    this.principalValanceString = parseFloat(Number(this.principalBalance).toFixed(2));;
    this.data.scateredDate = null;
    this.data.amount = null


  }
  removeItem(evt, indx) {
    evt.preventDefault();
    let currRecord = this.scatterdPayments[indx];
    this.principalBalance = (Number(this.principalValanceString) + Number(currRecord.paymentAmount));
    this.principalValanceString = this.principalBalance; //.toLocaleString('en-US', { minimumFractionDigits: 2 });
    this.scatterdPayments.splice(indx, 1);
  }
  generateIrregularSchedule() {
    this.loadingService.show();
    var payments = [];
    this.scatterdPayments.forEach((v) => {
      payments.push({
        paymentDate: v.paymentDate,
        paymentAmount: v.paymentAmount
      });
    })

    if (this.generateData.scheduleTypeCategoryId === 2) {
      if (Number(this.principalValanceString) > 0 || Number(this.principalValanceString) < 0) {
        this.showMessage("Payment amount must be equal to principal amount", "error", "FintrakBanking");
        return;
      }
      this.bodyObj = {
        loanId: this.loanId,
        scheduleMethodId: this.generateData.scheduleTypeId,
        principalAmount: this.newPrincipalBalance,
        equityContribution:this.loanPrepaymentForm.get('equityContribution').value,
        effectiveDate: this.loanPrepaymentForm.get('effectiveDate').value,
        interestRate: this.generateData.interestRate,
        accrualBasis: this.generateData.accrualBasis,
        integralFeeAmount: this.generateData.integralFeeAmount,
        irregularPaymentSchedule: payments
      };
    }
    else {
      this.bodyObj = {
        loanId: this.loanId,
        scheduleMethodId: this.generateData.scheduleTypeId,
        principalAmount: this.newPrincipalBalance,
        effectiveDate: this.loanPrepaymentForm.get('previousEffectiveDate').value,
        interestRate: this.loanPrepaymentForm.get('interestRate').value,
        principalFrequency: this.generateData.principalFrequencyTypeId,
        interestFrequency: this.generateData.interestFrequencyTypeId,
        tenor: this.loanPrepaymentForm.get('maintainTenor').value == true ? this.generateData.teno : this.loanPrepaymentForm.get('newtenor').value,
        principalFirstpaymentDate: this.generateData.firstPrincipalPaymentDate,
        interestFirstpaymentDate: this.generateData.firstInterestPaymentDate,
        // principalFirstpaymentDate: new Date('2018-10-29'),
        // interestFirstpaymentDate: new Date('2018-10-29'),
        equityContribution:this.loanPrepaymentForm.get('equityContribution').value,
        prepaymentMethodId : this.prepaymentMethod,
        maturityDate: this.loanPrepaymentForm.get('maintainTenor').value == true ? this.generateData.maturityDate : this.loanPrepaymentForm.get('maturityDate').value,
        irregularPaymentSchedule: []
      };
    }


    ////console.log('this.data', this.bodyObj);
    //this.loanService.generatePeriodicSchedule(this.bodyObj)
    this.subscriptions.add(
    this.loanService.generatePeriodicPrepaymentSchedule(this.bodyObj)
      .subscribe((res) => {
        this.loadingService.hide();
        if (res.success == true) {

          if (res.result.length) {
            var details = {
              principalAmount: this.principalAmount,
              interestRate: this.generateData.interestRate,
              effectiveDate: this.loanPrepaymentForm.get('effectiveDate').value,
              maturityDate: '',
              effectiveInterestRate: 0,
              schedules: res.result
            }

            this.schedules = details.schedules;
            this.maturityDate = this.schedules[this.schedules.length - 1].paymentDate;
            details.maturityDate = this.maturityDate;
            details.effectiveInterestRate = this.schedules[0].internalRateOfReturn;
            this.scheduleHeader = details;

            this.displayScheduleModalForm = true;

            this.loadingService.hide();
          }
        } else {
          this.showMessage(res.message, "error", "FintrakBanking");
        }

      }, (err) => {
        this.showMessage(err || "An unknown error has occured", "error", "FintrakBanking");
      }));
  }
}
