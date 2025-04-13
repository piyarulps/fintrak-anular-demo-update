import { saveAs } from 'file-saver';
import { CreditAppraisalService } from '../../../services/credit-appraisal.service';
import { CallMemoService } from '../../../../setup/services/call-memo.service';
import { Component, OnInit, ViewChild, Output } from '@angular/core';

import { LoadingService } from '../../../../shared/services/loading.service';
import { LoanApplicationService } from '../../../services/loan-application.service';
import { ChecklistService } from '../../../../setup/services/checklist.service';
import { GlobalConfig, JobSource } from '../../../../shared/constant/app.constant';
import swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { CountryStateService } from '../../../../setup/services/state-country.service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { CurrencyService } from '../../../../setup/services';
import { CustomerFinancialStatementComponent } from '../../../../shared/components/customer-financial-statement/customer-financial-statement.component';
import { CustomerService } from 'app/customer/services/customer.service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
    selector: 'app-eligibility-requirements',
    templateUrl: './loan-eligibility-requirements.component.html',
    // styleUrls: ['./name.component.scss']
})
export class LoanEligibilityRequirementsComponent implements OnInit {
    isCustomerTypeIndividual: boolean;
    show: boolean;
    cssClass: string;
    customerApplicationBureauList: any[];
    btnNullProperty: string;
    cancel: string;
    ok: string;
    width: string;
    message: string;
    applicationReferenceNumber: string; autoMapNew = true;
    loanApplicationLists: any[]; loanApplicationReferance = 0; requestStatusId: number = 1;
    loanApplicationDetails: any[]; displayRequestForm: boolean = false; requestPageHeaderTitle: string;
    isRequestReassigned: boolean; isRequestAcknowledged: boolean; requestComment: string;
    checklistModel: any[] = []; loanApplicationId: number;
    checklistDetailData: any[]; displayCheckList: boolean = false; checklistStatusData: any[];
    cities: any[]; filterState: any[]; state: any[]; country: any[]; customerId: number;
    creditBureauForm: FormGroup; selectedCustomer: any = {};
    requestOperationsId: number = 2;
    bureauSearchTitle: string;

    applicationCustomerId: number;
    jobSourceId: number;
    productId: number = 0;
    productClassProcessId: number = 0;
    loanApplicationDetailId: number = 0;
    applicationId: number;
    requirementItems: boolean = false;
    selectedCustomerId: number;

    displayCollateral: boolean = false;
    selectedChecklist: any;
    displayCheckListDetails: boolean = false;
    checkListStatusId: number;
    operationId: number = 2;
    deferedDate: string;
    checklistDeffered: boolean = false;
    checklistNotProvided: boolean = false;
    checklistItem: string;
    checkListDetailList: any[];
    filteredChecklistDefinition: any[];
    fileDocument: any;
    collateralValue: number;
    allowForEdit: boolean = false;
    title: string;
    loanApplicationAmount: number;
    requairedCollateralValue: number;
    securityValue: number;
    loanCurrency: string;
    checkListIndex: number = 0;
    selectedCustomerName: string;
    selectedCustomerCode: string;
    @Output() selectedCustomerDetail :any={};
    displayRMSuggestions: boolean = false;
    loanInitiatorSuggestionForm: FormGroup;
    @ViewChild(CustomerFinancialStatementComponent, { static: true }) customerFinancials: CustomerFinancialStatementComponent;
    selectedApplicationDetail: any = {};
    constructor(private route: ActivatedRoute, private loadingService: LoadingService, private checklistService: ChecklistService,
        private countryService: CountryStateService, private fb: FormBuilder, private router: Router, private locationService: CountryStateService,
        private loadingSrv: LoadingService, private loanAppService: LoanApplicationService,
        private camService: CreditAppraisalService, private loanApplicationService: LoanApplicationService,
        private currencyService: CurrencyService, private custService: CustomerService
    ) { }

    ngOnInit(): void {
        this.jobSourceId = JobSource.LoanApplicationDetail;
        this.applicationId = +this.route.snapshot.params['applicationId'];
        ////console.log(this.applicationId);
        this.InitApplicationDetail();
        this.loanApplicationdetailsList(this.applicationId);
        this.initCreditBureal(); this.getAllCountry();
        this.getAllCountry(); this.getState();
        this.getLoanApplicationDetails()
        this.getAllCurrencies();
        this.initialiseSuggestionForm();
    }
    getApplication() {
        this.loanAppService.getApplication(this.applicationId)
            .subscribe((res) => {
                this.applicationCustomerId = res.result.customerId;
            });
    }
    gotoLoanApplication() {
        this.router.navigate(['/credit/newloan/application', this.applicationId]);
    }

    allowFinancialShow: boolean = false;
    loanCollateralDetails() {
        // this.allowFinancialShow = true;
        ////console.log(this.applicationId);
        this.getCollateralRequirement(this.applicationId);
    }


    loanApplications = {};
    customerName: string;
    getLoanApplicationDetails() {
        this.loadingService.show();
        this.loanApplicationService.getLoanApplicationinfo(this.applicationId)
            .subscribe((response:any) => {
                this.loanApplications = response.result;
                this.customerId;
                //  this.customerName = response.result.customerName
                ////console.log(this.loanApplications);
                this.loadingService.hide();
                ////console.log('applications..', response);
            }, (err) => {
                ////console.log("error", err);
            });
    }
    onSubmitForCAM() {
        // this.router.navigate(['/credit/appraisal/credit-appraisal']);
        
        if (this.applicationId > 0) {
            this.loadingSrv.show();
            this.checklistService.validateChecklist(this.applicationId).subscribe((res) => {
                if (res.success == true) {
                    this.loanAppService.UpdateloanApplication(this.applicationId)
                    .subscribe((res) => { 
                    this.loadingSrv.hide();
                        if (res.success == true) {
                            if (res.result != null) {
                                this.checkListIndex = res.result.checkListIndex;
                                if(res.result.jumpToDrawdown){
                                    swal('Fintrak Credit360','Application was successful. Moved to drawdown.','success')
                                    this.router.navigate(['/credit/loan/booking/initiate-booking']);
                                }
                                else if (this.checkListIndex == 1) {
                                    if(res.result.isAdhoc == true){ swal('Fintrak Credit360','Application has been successfully sent for Adhoc Approval.','success')}
                                    this.router.navigate(['/credit/appraisal/credit-appraisal']);
                                }
                                if (this.checkListIndex == 2) {
                                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.result.messageStr, 'error');
                                    return
                                }
                                if (this.checkListIndex == 3) {
                                    const __this = this;
                                    swal({
                                        title: 'Loan Checklist Requirement',
                                        text: res.result.messageStr + '\n' + 'This application will require that you raise CAM. Do you want to continue ',
                                        type: 'question',
                                        showCancelButton: true,
                                        confirmButtonColor: '#3085d6',
                                        cancelButtonColor: '#d33',
                                        confirmButtonText: 'Yes',
                                        cancelButtonText: 'No, cancel!',
                                        confirmButtonClass: 'btn btn-success btn-move',
                                        cancelButtonClass: 'btn btn-danger',
                                        buttonsStyling: true,
                                    }).then(function () {
                                        ////console.log(this.applicationId);
    
                                        const body = {
                                            applicationId: __this.applicationId,
                                            checkListIndex: res.result.checkListIndex
                                        }
    
                                        ////console.log("Some Body", body);
    
                                        // let body = { loanCollateralMappingId: id }
                                        __this.loanAppService.UpdateloanApplicationForCAM(body).subscribe((res) => {
                                            
                                            if (res.success === true) {
                                                //  swal(GlobalConfig.APPLICATION_NAME, 'Release successful but subject to approval.', 'success');
                                                //  __this.getCustomerCollateral(__this.selectedCustomerId);
                                                if(res.jumpToDrawdown){
                                                    __this.router.navigate(['/credit/loan/booking/initiate-booking']);
                                                } else 
                                                __this.router.navigate(['/credit/appraisal/credit-appraisal']);
                                            } else {
                                                swal(GlobalConfig.APPLICATION_NAME, res.message, 'error');
                                            }
                                        });
    
                                    }, function (dismiss) {
                                        if (dismiss === 'cancel') {
                                            swal(GlobalConfig.APPLICATION_NAME, 'Operation cancelled', 'error');
                                        }
                                    });
                                }
                            }
                        } else {
                            swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                            this.loadingSrv.hide();
                        }
                    });
                } 
                else {
                    this.loadingSrv.hide();
                    swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                }
            }, (err: any) => {
                this.loadingSrv.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, err.message, 'error');
            });
        }
    }

    returnToStart() {
        this.router.navigate(['/credit/loan/loan-application-list']);
    }

    validateChecklist() {

    }

    CallRequestClose() {
        this.displayRequestForm = false;

    }

    getCollateralRequirement(applicationId, colCurrencyId?) {
        this.loanAppService.getCollateralRequirement(this.applicationId, colCurrencyId).subscribe((response:any) => {
            ////console.log(response.result);
            this.title = "Loan Collateral Values",
                this.loanCurrency = response.result.loanCurrency
            this.loanApplicationAmount = response.result.loanAmount;//response.result.collateralLoan,
            this.requairedCollateralValue = response.result.requiredCollateral;// response.result.requiredCollateral,
            //this. securityValue= this.totalSecurity

        });
    }

    saveUpdate() {
        ////console.log(this.applicationDetail.value);
        let data = this.applicationDetail.value;
        this.loanAppService.updateLoanApplicationAmount(data)
            .subscribe((x) => {
                if (x.success === true) {
                    this.loanCollateralDetails();
                    this.closeUpdate();
                    swal(`${GlobalConfig.APPLICATION_NAME}`, x.message, 'success');
                }
            }, (err) => {
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            });

    }

    closeUpdate() {
        this.allowForEdit = false;
        this.loanApplicationdetailsList(this.applicationId);
    }

    applicationDetail: FormGroup
    InitApplicationDetail() {

        this.applicationDetail = this.fb.group({
            loanApplicationId: ['', Validators.required],
            applicationDetailedId: ['', Validators.required],
            proposedRate: ['', Validators.required],
            proposedTenor: ['', Validators.required],
            proposedProductId: ['', Validators.required],
            proposedProductName: ['', Validators.required],
            proposedAmount: ['', Validators.required],
            customerName: ['', Validators.required]
        })


    }
    InitApplicationDetaildata(data) {
        ////console.log(data);
        this.applicationDetail = this.fb.group({
            loanApplicationId: [data.loanApplicationId],
            applicationDetailedId: [data.loanApplicationDetailId],
            proposedRate: [data.approvedInterestRate],
            proposedTenor: [data.proposedTenor],
            proposedProductId: [data.proposedProductId],
            proposedProductName: [data.proposedProductName],
            proposedAmount: [data.proposedAmount],
            customerName: [data.customerName]
        });
        ////console.log("applicationDetail", this.applicationDetail);

    }
    editRequest(i, data) {
        this.allowForEdit = true;
        this.loanCollateralDetails();
        ////console.log(data);

    }

    colCurrencyId: number;
    colCurrencyCode: string;
    totalSecurity: number;
    getSecurityValue(event: any) {
        this.getCollateralRequirement(this.applicationId, 2);
        this.colCurrencyCode = "NGN"
        this.totalSecurity = event;
        //alert(this.totalSecurity);
    }

    getAllCurrencies() {
        this.currencyService.getAllCurrencies()
            .subscribe((res) => {
                this.currencies = res.result;
                ////console.log("currencies", this.currencies);
            }, (err) => {
                ////console.log(err);
            });
    }

    getExchangeRateInvoice2(id) {
        let lcyValue: number = 0;
        // let amountValues: string = this.invoiceDiscountingForm.value.proposedAmount;//.replace(/[^0-9-.]/g, '');
        // this.loanAppService.getExchangeRate(id)
        //     .subscribe((res) => {
        //         this.exchange = res.result;
        //         lcyValue = +amountValues / this.exchange.sellingRate;

        //         this.invoiceDiscountingForm.controls["loanNairaEquivalent"].setValue(lcyValue.toFixed(2));
        //         this.invoiceDiscountingForm.controls["loanfcyRate"].setValue(this.exchange.sellingRate);

        //     });

    }

    currencies: any[];
    getRequestData(event: any) {
        if (event) {
            this.displayRequestForm = false;
        }
        else {
        }
    }

    getStateByCountryId(id) {
        ////console.log(id);
        ////console.log(this.state, 'State');
        this.filterState = this.state.filter(x => x.countryId == +id);
        ////console.log(this.filterState, 'filterState');
    }

    getState() {
        this.locationService.getStates().subscribe((response:any) => {
            this.state = response.result;
            ////console.log(this.state);
            this.loadingSrv.hide();
        }, (err) => {
            ////console.log(err);
        });
    }

    closeCollateral() {
        this.displayCollateral = false;
    }

    getAllCountry() {
        this.countryService.getAllCountries()
            .subscribe((res) => {
                this.country = res.result;
                ////console.log(this.country);

            }, (err) => {
                ////console.log(err);
            });
    }

    gotoCollateralInformation() {
        this.displayCollateral = true;
        this.autoMapNew = true
        this.selectedCustomer
        ////console.log(this.displayCollateral );

        // this.router.navigate(['/credit/loan/loan-collateral-infomation', this.selectedCustomerId, this.applicationId]);
    }

    setCustomerTypeIndicator(id: number) {
        this.custService.getSingleCustomerGeneralInfoByCustomerId(id).subscribe((data) => {
            console.log('loan eligibility requirement data',data)
        if (data.result.customerTypeId == 1) {
            this.isCustomerTypeIndividual = true;
        } else if (data.result.customerTypeId == 2) {
            this.isCustomerTypeIndividual = false; } 
        }, (err) => {
        swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
        });
    }
    
    requireCollateral: boolean;
    productClassId: number;
    onRowSelect(event) {
        this.isCustomerTypeIndividual = null;
        
        this.setCustomerTypeIndicator(event.data.customerId);
        this.selectedCustomerDetail =  event.data;
        this.loanCollateralDetails();
        this.selectedApplicationDetail = event.data;
        this.requirementItems = true;
        this.requireCollateral = event.data.requireCollateral;
        this.selectedCustomerId = event.data.customerId;
        this.loanApplicationId = event.data.loanApplicationId;
        this.loanApplicationDetailId = event.data.loanApplicationDetailId
        this.applicationReferenceNumber = event.data.applicationReferenceNumber
        this.productId = event.data.proposedProductId;
        this.productClassProcessId = event.data.productClassProcessId;
        this.productClassId = event.data.productClassId;
        this.requireCollateral = event.data.requireCollateral;
        this.selectedCustomerName = event.data.customerName;
        this.selectedCustomerCode = event.data.customerCode;
        // if(this.productClassId)
        this.InitApplicationDetaildata(event.data);

        this.getLoanDocumentsUploads(this.applicationReferenceNumber);

        let data={
            customerId:event.data.customerId,
            loanApplicationId:event.data.loanApplicationId,
            productClassProcessId:event.data.productClassProcessId
        }
       this.populateLoanApplicationChecklist(data);

        ////console.log(this.loanApplicationId, this.loanApplicationDetailId, this.productId, this.selectedCustomerId);
    }

    populateLoanApplicationChecklist(data){
        this.loadingService.show();
        this.loanAppService.populateLoanApplicationChecklist(data).subscribe((response:any) => {
            this.loadingService.hide();
            response.result;
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    showRequestForm() {
        this.displayRequestForm = true;
    }

    onSelectedCity(id) {
        ////console.log(typeof (+id));
        this.getAllCities(+id);
    }

    getAllCities(id: number) {
        ////console.log(+id);
        this.locationService.getAllCitiesByStateId(id).subscribe((response:any) => {
            this.cities = response.result;
            ////console.log(this.cities);
        }, (err) => {
            ////console.log(err);
        });
    }

    loanApplicationdetailsList(id) {
        this.loadingService.show();
        this.loanApplicationLists = [];
        this.loanAppService.loanApplicationdetails(id).subscribe((data) => {
            this.loanApplicationLists = data.result;
            
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
            ////console.log('Error', err);
        });
    }

    getSingleLoanApplicationdetail(id) {
        this.selectedApplicationDetail = null;
        this.loanAppService.getSingleLoanApplicationdetail(id).subscribe((data) => {
            this.selectedApplicationDetail = data.result;
        });
    }

    row = {}

    initCreditBureal() {
        const cust = this.selectedCustomer;
        this.creditBureauForm = this.fb.group({
            companyName: new FormControl(cust.customerName, Validators.required),
            companyAddress: new FormControl('', Validators.required),
            taxRegistrationNumber: new FormControl('', Validators.required),
            rcNumber: new FormControl('', Validators.required),
            companyEmailAddress: new FormControl('', Validators.required),

            accountName: new FormControl(''),
            availableBalance: new FormControl(''),

            companyPhoneNumber: new FormControl('', Validators.required),
            city: new FormControl('', Validators.required),
            state: new FormControl('', Validators.required),
            directorFullName: new FormControl('', Validators.required),
            directorEmail: new FormControl('', Validators.required),
            uploadScannedID: new FormControl('', Validators.required),
            quoteIDNumber: new FormControl('', Validators.required),
            iDType: new FormControl('', Validators.required),
            bVNNumbe: new FormControl(''),
            senderIdUpload: new FormControl('', Validators.required),
            senderCoiUpload: new FormControl('', Validators.required)
        });
    }

    getLoanDocumentsUploads(applicationNumber: any) {
        ////console.log("AppNo:>>>>>>",applicationNumber);
        this.loadingService.show();
        this.camService.getSupportingDocumentByApplication(applicationNumber).subscribe((response:any) => {
            this.loanDocumentUploadList = response.result;
            this.loadingService.hide();
        });
    }

    viewDocument(id: number) {
        this.fileDocument = null;
        //  let doc = this.loanDocumentUploadList.find(x => x.documentId == id);
        this.camService.getSupportingDocumentByDocumentId(id).subscribe((response:any) => {
            this.fileDocument = response.result;
            if (this.fileDocument != null) {
                this.binaryFile = this.fileDocument.fileData;
                this.selectedDocument = this.fileDocument.documentTitle;
                this.displayUpload = true;
            }
        });

    }

    DownloadDocument(id: number) {
        this.fileDocument = null;
        this.camService.getSupportingDocumentByDocumentId(id).subscribe((response:any) => { // TODO
            this.fileDocument = response.result;
            // let doc = this.loanDocumentUploadList.find(x => x.documentId == id);
            if (this.fileDocument != null) {
                this.binaryFile = this.fileDocument.fileData;
                this.selectedDocument = this.fileDocument.documentTitle;
                let myDocExtention = this.fileDocument.fileExtension;
                var byteString = atob(this.binaryFile);
                var ab = new ArrayBuffer(byteString.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                var bb = new Blob([ab]);

                if (myDocExtention == 'jpg' || myDocExtention == 'jpeg') {
                    try {
                        var file = new File([bb], this.selectedDocument + '.jpg', { type: 'image/jpg' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'image/jpg' });
                        window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.jpg');
                    }
                }
                if (myDocExtention == 'png' || myDocExtention == 'png') {
                    try {
                        var file = new File([bb], this.selectedDocument + '.png', { type: 'image/png' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'image/png' });
                        window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.png');
                    }
                }
                if (myDocExtention == 'pdf' || myDocExtention == '.pdf') {
                    try {
                        var file = new File([bb], this.selectedDocument + '.pdf', { type: 'application/pdf' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'application/pdf' });
                        window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.pdf');
                    }
                }
                if (myDocExtention == 'xls' || myDocExtention == 'xlsx') {
                    try {
                        var file = new File([bb], this.selectedDocument + '.xlsx', { type: 'application/vnd.ms-excel' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'application/vnd.ms-excel' });
                        window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.xlsx');
                    }
                }
                if (myDocExtention == 'doc' || myDocExtention == 'docx') {

                    try {
                        var file = new File([bb], this.selectedDocument + '.doc', { type: 'application/msword' });
                        saveAs(file);
                    } catch (err) {
                        var saveFileAsBlob = new Blob([bb], { type: 'application/msword' });
                        window.navigator.msSaveBlob(saveFileAsBlob, this.selectedDocument + '.doc');
                    }
                }
            }
        });
    }

    showAddNewUpload() {
        this.displayDocumentUpload = true;
    }
    // file upload
    displayDocumentUpload: boolean = false;
    displayUpload: boolean = false;
    displayUploadOtherDocument: boolean = false;
    loanDocumentUploadList: any[] = [];
    binaryFile: string;
    selectedDocument: string;


    uploadFileTitle: string = null;
    physicalFileNumber: string = null;
    physicalLocation: string = null;
    documentTypeId: number = null;
    files: FileList;
    file: File;
    @ViewChild('fileInput', {static: false}) fileInput: any;
    onFileChange(event) {
        this.files = event.target.files;
        this.file = this.files[0];
    }

    fileExtention(name: string) {
        var regex = /(?:\.([^.]+))?$/;
        return regex.exec(name)[1];
    }

    uploadFile() {
        if (this.file != undefined || this.uploadFileTitle != null) {
            let body = {
                loanApplicationNumber: this.applicationReferenceNumber,
                loanReferenceNumber: this.loanApplicationDetailId,
                documentTitle: this.uploadFileTitle,
                fileName: this.file.name,
                fileExtension: this.fileExtention(this.file.name),
                physicalFileNumber: this.physicalFileNumber,
                physicalLocation: this.physicalLocation,
                documentTypeId: 1, // TODO: redundant with fileExtension known
            };
            this.loadingService.show();
            this.camService.uploadFile(this.file, body).then((val: any) => {
                this.uploadFileTitle = null;
                this.fileInput.nativeElement.value = "";
                this.loadingService.hide();
                this.getLoanDocumentsUploads(this.applicationReferenceNumber);
                this.displayDocumentUpload = false;
            }, (error) => {
                this.loadingService.hide(1000);
                ////console.log("error", error);
            });
        }
    }

    allowFeeConcessionForEdit: boolean;
    loanDetailId: number;

    viewConcession(item) {
        this.loanDetailId = item.loanApplicationDetailId
        ////console.log(this.loanDetailId);

        this.allowFeeConcessionForEdit = true;
    }

    displayFinancialStatement: boolean = false;
    viewFinancialStatement() {
        this.customerFinancials.displayFinancialStatement = true;
        this.customerFinancials.loadCustomerDetails(this.selectedCustomerId);
        // console.log(this.customerFinancials.isCustomerTypeIndividual);
    }

    closeFeeConcession(event) {
        this.allowFeeConcessionForEdit = false;
    }

    initialiseSuggestionForm() {
        this.loanInitiatorSuggestionForm = this.fb.group({
            loanApplicationDetailId: [this.loanApplicationDetailId],
            conditionPrecedent: ['', Validators.required],
            conditionSubsequent: ['', Validators.required],
            transactionDynamics: ['', Validators.required]
        });
    }

    editSuggestionForm() {
        let row = this.selectedApplicationDetail;
        this.loanInitiatorSuggestionForm = this.fb.group({
            loanApplicationDetailId: [row.loanApplicationDetailId],
            conditionPrecedent: [row.conditionPrecedent, Validators.required],
            conditionSubsequent: [row.conditionSubsequent, Validators.required],
            transactionDynamics: [row.transactionDynamics, Validators.required]
        });
    }

    showSuggestionForm() {
        this.editSuggestionForm();
        this.displayRMSuggestions = true;
    }

    submitSuggestionForm(formObj) {
        let body = formObj.value;
        this.loadingService.show();
        this.loanAppService.loanApplicationDetailSuggestion(body).subscribe((x) => {
            this.loadingService.hide();
            if (x.success === true) {
                this.displayRMSuggestions = false;
                this.getSingleLoanApplicationdetail(body.loanApplicationDetailId);
                swal(`${GlobalConfig.APPLICATION_NAME}`, x.message, 'success');
            } else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, x.message, 'error');
            }
        }, (err) => {
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
        });
    }
}