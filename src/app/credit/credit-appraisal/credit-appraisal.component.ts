import { Component, OnInit, ViewChild, Output, EventEmitter, Input, ElementRef } from '@angular/core';
import { LazyLoadEvent } from 'primeng/primeng'; // lazyloading
import { LoadingService } from '../../shared/services/loading.service';
import { CreditAppraisalService } from '../services/credit-appraisal.service';
import { FormGroup, FormBuilder, Validators, NgForm, FormControl } from '@angular/forms';
import { ApprovalGroupRole, ApprovalStatus, GlobalConfig, IntegratedCustomerTypeEnum, JobSource, ProductClassEnum, ProductClassProcessEnum } from '../../shared/constant/app.constant';
import { ProductService } from '../../setup/services/product.service';
import { LoanService } from '../services/loan.service';
import { CustomerService } from '../../customer/services/customer.service';
import swal from 'sweetalert2';
import { LoanApplicationService } from 'app/credit/services/loan-application.service';
import { CustomerFinancialStatementComponent } from 'app/shared/components/customer-financial-statement/customer-financial-statement.component';
import { StaffRoleService } from 'app/setup/services/staff-role.service';
import { ConditionPrecedentService } from 'app/setup/services/condition-precedent.service';
import { Subject ,  fromEvent } from 'rxjs';
import { StaffRealTimeSearchService } from 'app/setup/services/staff-realtime-search.service';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ReportService } from 'app/reports/service/report.service';
import { CollateralService } from 'app/setup/services/collateral.service';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import values from 'assets/config/values';
import { LoanTypeEnum } from '../loans';
import { AuthenticationService } from 'app/admin/services';
import { ILoanApplication } from '../loans/application/loanApplicationInfo.interface';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CurrencyService } from 'app/setup/services';
import { WorkflowTarget } from 'app/shared/models/workflow-target';
import { isNullOrUndefined } from 'util';

enum JobAllocationStatusEnum {
    RoundRobin = 1,
    SBUROUTING = 2,
    POOL = 3
}

@Component({
    styleUrls: ['credit-appraisal.style.scss'],
    templateUrl: 'credit-appraisal.component.html',
})
export class CreditAppraisalComponent implements OnInit {
    customerId: any;
    debugging: boolean = true;
    @ViewChild('approvalInPut', { static: false }) approvalInPut: ElementRef;
    
    startDate: Date;
    endDate: Date;
    fileDocument: any;
    customerRatios: any;
    accountAnanalysisFilterForm: FormGroup;
    contractorCriteriaForm: FormGroup;
    contractCriteria: any = null;
    account:string='';
    fromMonth:string='';
    to:string;
    fromYear:string;
    toYear:string;
    CamFamName: string;
    applicationId: any;
    customerTier: number=0;
    //==========================================
    showCasgBackForm: boolean = false;
    isLoadTemplate: boolean = false;
    displayContractorCriteriaModal: boolean = false;
    showContractorTieringForm: boolean = false;
    operationId: any; 
    cashBackHtml: any = {};
    cashBackForm: FormGroup;
    ExposureForm: FormGroup;
    contractorTieringForm: FormGroup;
    //=========================================
    readonly OPERATION_ID: number = 6; 
    readonly BONDS_AND_GUARANTEE_ID: number = 10;
    showCustomerCollaterals: boolean = false;
    proposedApplicationDetails: any;
    loanApplicationId: number = 0;
    contractCriteriaCount: number = 0;
    selectedApplicationDetailId: number = null;
    productId: number = 0;
    productClassProcessId: number = 0;
    productProgramClassProcessId: number = ProductClassProcessEnum.CreditProgram;
    reload: number = 0;
    facilityCount: number = 0;
    selectedId: number = null;
    feedback: string = null;
    commentLabel: string = 'Recommendation';//'Comment';
    approvalButtonLabel: string = 'A';
    errorMessage: string = '';
    searchString: string = '';
    searching: boolean = false;
    pageReady: boolean = false;
    applications: any[] = [];
    products: any[] = [];
    accountNumbers: any[] = [];
    complianceTimelines: any[] = [];
    contractTierings: any[] = [];
    contractTieringComputation: any[] = [];
    // LoanApplicationTags: any[] = [];
    itemTotal: number = 0; // lazyloading
    showLoadIcon: boolean = false; // lazyloading
    applicationSelection: any; // selection
    lineSelection: any;
    totalExposureLimit: any;
    workingLoanApplication: string = null;
    disableApplicationInformationTab = true;
    disableAppraisalMemorandumTab: boolean = true;
    disableSupportingDocumentsTab: boolean = true;
    disableApprovalsAndCommentsTab: boolean = true;
    disableConditionsTab: boolean = true;
    disableDynamicsTab: boolean = true;
    disableTriggersTab: boolean = true;
    userDepartmentId = 0;
    applicationCustomers: any[] = [];
    termSheets: any[] = [];
    applicationCustomerId: number = 0;
    jobSourceId: number;
    useCkeditor: boolean = true; // from SETTINGS
    autoLoadAnalystTemplate: boolean = false; // SETTINGS
    enabled: boolean = false;
    isBoard: boolean = false;
    isAnalyst: boolean = false;
    isBusiness: boolean = false;
    isSubsequent: boolean = false;
    displayDocument: boolean;
    formState: string = 'New';
    tformState: string = 'Edit';
    selectedDocument: number;
    contractorTierId: number = 0;
    displayEditContractorTiering: boolean = false;
    allowTemplateToLoad: boolean = false;
    // isTransaction = true;
    // isCondition = true;

    info: any[] = [];

    filteredProductClassId: number = null;
    // giveFacilityId: number;
    productPrograms: any[] = [];
    loanApplicationDetail: any;
    @Output() facilitySpecificConditionsId = new EventEmitter<number>(); 
    loanCollateral: any;

    apiRequestId: string;

    availableApprovers: any[] = [];
    displayApproverSearchForm: boolean = false;
    searchResults: Object;
    searchTerm$ = new Subject<any>();
    reportSrc: any;
    displayTestReport: boolean;
    isLLLViolated = false;
    legalLendingLimitImpact = 0;
    isRegistrationDoneViaLoanApplication = 1;
    faciliies: any;
    proposedProductId: any;
    productDropDown: any;
    isRacReady: boolean;
    loanApplicationDetailId: any;
    currencyId: any;
    AcceptButtonText = 'Accept';
    proposedCollateral: any[] = [];
    customerGroupId: any;
    loanTypeId: number;
    allRequiredDocumentsAreUploaded = true;
    facilityRatings: any;
    isFacilityRating: boolean = false;
    productClassId: any;
    selectedCustomerRating: any;
    loanApplicationDetaiId: any;
    displayExposureModal: boolean = false;
    displayEditExposureModal: boolean = false;
    entityName: string = "Edit Exposure";
    exposureId: any;
    exposureSave: any[] = [];
    workflowTarget: WorkflowTarget = new WorkflowTarget();
    workflowTargets: WorkflowTarget[] = [];

    //
    loanApplicationDetails: any[] = [];
    customer: any[] = [];
    readonly CREDITAPPRIASALDOC: string ="CREDIT APPRAISAL DOCUMENTS";
    readonly DRAWDOWNDOC: string ="DRAWDOWN DOCUMENTS";
    loanSource: string;
    isPoolRequest = false;
    isSBURouting : boolean;
    isRounRobin: boolean;
    currentStaffActivities: string[];
    approvalTrailIds: number[] = [];
    displayTermSheetForm: boolean = false;
    termSheetForm: FormGroup;

    displayMoreTermSheetDetails: boolean = false;
    termSheetDetails: any = {};
    onRatingSelectionChange:any;
    obligorRiskRatingId:number;
    showFinancialStatement: boolean = false;
    creditGradeId: number;

    //
    constructor(
        private fb: FormBuilder,
        private loadingService: LoadingService,
        private camService: CreditAppraisalService,
        private productService: ProductService,
        private loanService: LoanService,
        private realSearchSrv: StaffRealTimeSearchService,
        private customerService: CustomerService,
        private conditionService: ConditionPrecedentService,
        private router: Router,
        private loanApplService: LoanApplicationService,
        private staffRole: StaffRoleService,
        private sanitizer: DomSanitizer,
        private reportServ: ReportService,
        private collateralService: CollateralService,
        private authService: AuthenticationService,
        private currencyService: CurrencyService,
        private creditAppraisalService: CreditAppraisalService,
        
    ) {
        //this.realSearchSrv.search(this.searchTerm$).subscribe(results => {
        // this.realSearchSrv.searchApprovers(this.searchTerm$, this.OPERATION_ID).subscribe(results => {
        //     if (results != null) {
        //         this.availableApprovers = results.result;
        //     }
        // });
        this.startDate = new Date();
        this.endDate = new Date();
        this.CamFamName = values.MEMORANDUM_NAME;
    } 

    ngOnInit() {
        this.jobSourceId = JobSource.LoanApplicationDetail;
        this.getCurrentStaffActivities();
        this.getUserRole();
        this.resetOnApplicationChange();
        this.loadDropdowns();
        this.getDisbursmentApprovalLevels();
        this.getAllCurrencies();
        
        this.getAllFacilities();
        //this.getAllContractorCriteria();
        this.accountAnanalysisFilterForm = this.fb.group({
            account : [null, Validators.required],
            fromMonth : [null, Validators.required],
            toMonth : [null, Validators.required],
            fromYear: [null, Validators.required],
            toYear : [null, Validators.required],

        });

         this.cashBackForm = this.fb.group({
            background: ['', Validators.required],
            issues: ['', Validators.required],
            request: ['', Validators.required],  
        });

        // this.getUserPrivileges(this.applicationSelection.currentApprovalLevelId);
    }

    resetOnApplicationChange(){
        this.clearControls();
        this.clearRequestControls();
        this.nextLevelId = 0;
        this.allRequiredDocumentsAreUploaded = true;
        this.clearExposureControls();
    }
    
     getMessage(message: string) {
        this.loanApplicationDetaiId = message;
        this.getCashBackMemoHtml(this.operationId, this.loanApplicationDetaiId);
    }

    getTermSheets(termSheetCode) {
        if(termSheetCode != null && termSheetCode != undefined){
        this.creditAppraisalService.getTermSheetsCorrection(termSheetCode).subscribe((response:any) => {
            this.termSheets = response.result;
        });
    }
    }
    
    ngAfterViewInit(): void {
        fromEvent(this.approvalInPut.nativeElement, 'keyup').pipe(
            debounceTime(150),
            distinctUntilChanged(),)
            .subscribe(() => {
                this.realSearchSrv.searchApproversEntries(this.approvalInPut.nativeElement.value,this.nextLevelId)
                    .subscribe(results => {
                        if (results != null) {
                            this.availableApprovers = results.result;
                        }
                        //console.log("availableApprovers :", this.availableApprovers);
                    });
            })
    }

    userisAnalyst:boolean = false;
    userIsRelationshipManager = false;
    userIsAccountOfficer = false;
    userIsPMU = false;
    staffRoleRecord: any;
    
    getFacilitySpecificConditions(facilityId) {
        
    }

    
    getUserRole() {
        this.staffRole.getStaffRoleByStaffId().subscribe((res)=>{
            this.staffRoleRecord = res.result;
            if(this.staffRoleRecord.staffRoleCode == 'AO' || this.staffRoleRecord.staffRoleCode == 'RMO' || this.staffRoleRecord.staffRoleCode == 'CP' || this.staffRoleRecord.staffRoleCode == 'RO') { 
                this.userIsAccountOfficer = true; 
                this.AcceptButtonText = 'Submit';
            }
                
            if (this.staffRoleRecord.staffRoleCode == 'PMU') {
                this.userIsPMU = true;
            }
            
                if(this.staffRoleRecord.staffRoleCode == 'RM' || this.staffRoleRecord.staffRoleCode == 'RM / BM') { 
                    this.userIsRelationshipManager = true; 
                }
                
                if(this.staffRoleRecord.allocationTypeId  == JobAllocationStatusEnum.SBUROUTING){ this.isSBURouting = true;}

                if(this.staffRoleRecord.allocationTypeId  == JobAllocationStatusEnum.RoundRobin){ this.isRounRobin = true;}

                if(this.staffRoleRecord.allocationTypeId  == JobAllocationStatusEnum.POOL){ this.isPoolRequest = true;}

                if(this.staffRoleRecord.staffRoleCode == 'AO') { 
                    this.allowTemplateToLoad = true; 
                }
            });
    }

    loadDropdowns() {
        this.productService.getAllProductsLite().subscribe((response:any) => {
            this.products = response.result;
        });
        this.conditionService.getAllComplianceTimeline().subscribe((response:any) => {
            this.complianceTimelines = response.result;
        });
        this.loadProductPrograms();
    }

    editTermSheet(row) {
        this.clearControls();
        this.formState = 'Edit';
        this.selectedId = row.termSheetId;
        this.termSheetForm = this.fb.group({
            borrower: [row.borrower, Validators.required],
            facilityAmount: [row.facilityAmount, Validators.required],
            facilityType: [row.facilityType, Validators.required],
            purpose: [row.purpose, Validators.required],
            tenor: [row.tenor, Validators.required],
            permittedAccount: [row.permittedAccount, Validators.required],
            debtServiceReserveAccount: [row.debtServiceReserveAccount, Validators.required],
            cancellation: [row.cancellation, Validators.required],
            principalRepayment: [row.principalRepayment, Validators.required],
            interestPayment: [row.interestPayment, Validators.required],
            computationOfInterest: [row.computationOfInterest, Validators.required],
            repaymentSource: [row.repaymentSource, Validators.required],
            availability: [row.availability, Validators.required],
            currencyOfDisbursement: [row.currencyOfDisbursement, Validators.required],
            documentation: [row.documentation, Validators.required],
            drawdown: [row.drawdown, Validators.required],
            earlyRepaymentOfPrincipal: [row.earlyRepaymentOfPrincipal, Validators.required],
            interestRate: [row.interestRate, Validators.required],
            pricing: [row.pricing, Validators.required],
            managementFees: [row.managementFees, Validators.required],
            facilityFee: [row.facilityFee, Validators.required],
            processingFee: [row.processingFee, Validators.required],
            securityCondition: [row.securityCondition, Validators.required],
            transactionDynamics: [row.transactionDynamics, Validators.required],
            conditionsPrecedentToUtilisation: [row.conditionsPrecedentToUtilisation, Validators.required],
            otherCondition: [row.otherCondition, Validators.required],
            taxes: [row.taxes, Validators.required],
            presentationsAndWarrantees: [row.presentationsAndWarrantees, Validators.required],
            covenants: [row.covenants, Validators.required],
            eventsOfDefault: [row.eventsOfDefault, Validators.required],
            transferability: [row.transferability, Validators.required],
            governingLawAndJurisdiction: [row.governingLawAndJurisdiction, Validators.required],
        });
        this.displayTermSheetForm = true;
    }

    loadProductPrograms() {
        this.loadingService.show();
        this.camService.getProductPrograms().subscribe((response:any) => { // make refreshable
            this.productPrograms = response.result;
            
            this.pageReady = true;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    // page 4

    displayPageFour: boolean = false;
    firstTransaction: any[] = [];
    secondTransaction: any[] = [];

    onCustomerChange() {
        this.getCustomerRatios(this.applicationCustomerId)
        if (this.applicationCustomerId > 0) {
            this.getCustomerByCustomerId(this.applicationCustomerId);
            this.getCustomerTransaction(this.applicationCustomerId);
        }
        else { swal(`${GlobalConfig.APPLICATION_NAME}`, 'Kindly Select a Customer From Drop-Down', 'error'); }
    }

    getCustomerByCustomerId(customerId) {
        this.customerService.getCustomerById(customerId).subscribe((response:any) => {
            if (response.success == true) {
                let result = response.result;

                if (result != null) {
                    //alert(result);
                    this.selectedCustomerRating = result[0].customerRating;
                    
                }
            }
        });
    }

    getCustomerTransaction(customerId) {
        this.camService.getCustomerTransaction(customerId, this.applicationSelection.loanApplicationId).subscribe((response:any) => { // make refreshable
            if (response.success == true) {
                let result = response.result;
                this.firstTransaction = result.firstTransaction;
                this.secondTransaction = result.secondTransaction;
                this.displayPageFour = true;

            }
            else {
                this.displayPageFour = false;
            } 
        });
    }

    processAccountAnalysisFilter(form) {
         //let customer = form.value.account;
         let fromMonth = form.value.fromMonth;
         let toMonth = form.value.toMonth;
         let fromYear = form.value.fromYear;
         let toYear = form.value.toYear;

        this.camService.getCustomerTransactionFilter(this.applicationCustomerId, this.applicationSelection.loanApplicationId, fromMonth, toMonth, fromYear, toYear).subscribe((response:any) => { // make refreshable
            if (response.success == true) {
                let result = response.result;
                this.firstTransaction = result.firstTransaction;
                this.secondTransaction = result.secondTransaction;
                this.displayPageFour = true;

            }
            else {
                this.displayPageFour = false;
            }
        });
    }

    getCustomerRatios(customerId) {
            this.camService.getCustomerRatios(customerId, this.applicationSelection.loanApplicationId).subscribe((response:any) => { // make refreshable
                if (response.success == true) {
                   this.customerRatios = response.result;
                }
            });
    }

    getCustomerTurnover() {
        this.loadingService.show();
        let data = {
            startDate: this.startDate,
            endDate: this.endDate
        }
        this.camService.getCustomerTurnover(this.applicationSelection.loanApplicationId, data).subscribe((response:any) => { // make refreshable
            this.loadingService.hide();
            if (response.success == true) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
            }
            else if (response.errorCode == "99") {
                //swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Failed to Load Customer Turnover', 'error');
            }
            else {
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
            }
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    getCustomerRatiosFromBasel() {
        this.loadingService.show();
        this.camService.getCustomerRatiosFromBasel(this.applicationSelection.loanApplicationId).subscribe((response:any) => {           
            this.loadingService.hide();          
            if (response.success == true) {     
               swal(`${GlobalConfig.APPLICATION_NAME}`, 'Customer Ratios Generated Successfully', 'success');
            }else{
                this.finishBad(response.message);
            }
        }, (err) => {
            this.loadingService.hide(1000);
        });
        this.loadingService.show();
        this.camService.getCustomerGroupRatiosFromBasel(this.applicationSelection.loanApplicationId).subscribe((response:any) => {
            this.loadingService.hide();          
            if (response.success == true) {
               swal(`${GlobalConfig.APPLICATION_NAME}`, 'Customer Group Ratios Generated Successfully', 'success');
            }else{
                this.finishBad(response.message);
            }
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    getCorporateCustomerRatingFromBasel() {
        this.loadingService.show();

        this.camService.getCorporateCustomerRatingFromBasel(this.applicationSelection.loanApplicationId).subscribe((response:any) => {
            this.loadingService.hide();
            if (response.success == true) {
                this.getCustomerByCustomerId(this.customerId);
               swal(`${GlobalConfig.APPLICATION_NAME}`, 'Customer Rating Generated Successfully', 'success');
               //swal(`${GlobalConfig.APPLICATION_NAME}`, 'Loaded Corporate Customer Rating', 'success');
            }        
        }, (err) => {
            this.loadingService.hide(1000);
        });
        this.getFacilityRatingFromBasel();
        this.getCustomerRatiosFromBasel();
    }

    getFacilityRatingFromBasel() {
        this.loadingService.show();
        this.camService.getFacilityRatingFromBasel(this.applicationSelection.loanApplicationId).subscribe((response:any) => {
            this.loadingService.hide();
            if (response.success == true) {
               swal(`${GlobalConfig.APPLICATION_NAME}`, 'Facility Rating Generated Successfully', 'success');
            }        
        }, (err) => {
            this.loadingService.hide(1000);
        });    
    }
    // lazyloading table

    currentLazyLoadEvent: LazyLoadEvent;

    loadData(event: LazyLoadEvent) {
        this.getLoanApplications(event.first, event.rows);
        this.currentLazyLoadEvent = event;
    }

    viewCustomerFinancialStatement: boolean=false;
    canDoFinancialStatementEntry: boolean=false;

    getLLLDetails(){
        this.loadingService.show();
        this.camService.getIsLLLViolated(6, this.applicationSelection.loanApplicationId).subscribe((response:any) => {
            console.log('result', response.result);
            if (response.success) {
                // console.log('bool', response.result.item1);
                // console.log('decimal',response.result.item2);
                this.isLLLViolated = response.result;
                this.legalLendingLimitImpact = response.result.item2;
            //console.log('this.legalLendingLimit', this.legalLendingLimitImpact);
            }
            
            this.loadingService.hide();
        }, (err:any ) => {
            this.loadingService.hide(1000);
            this.finishBad(JSON.stringify(err));
            swal(GlobalConfig.APPLICATION_NAME, 'Operation cancelled', err);
        });
    }

    onReturnToPool(data){
        
        console.log('data',data); 
        const __this = this;
        swal({
            title: 'Are you sure?',
            text: 'You want to return this application requests to pool?',
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
            __this.loadingService.show();
            __this.camService.ReturnTransactionToPool(__this.workflowTargets,data.approvalTrailId).subscribe((result) => {
                __this.loadingService.hide();
                if (result.success == true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, result.message, 'success');
                    __this.reset();
                    // __this.getLoanApplications(0, this.currentLazyLoadEvent.rows); // refresh list
                    // __this.updatePendingData();
                    //__this.refresh();
                   // __this.displayApproverSearchForm = false;
                    __this.workflowTargets = [];
                }
            }, (err) => {
                __this.loadingService.hide(1000);
            });
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(GlobalConfig.APPLICATION_NAME, 'Operation cancelled', 'error');
            }
        });
    }

    onViewSelection(row){ this.applicationSelection = row; this.onSelectedApplicationChange(); }

    onSelectedApplicationChange(): void {debugger
        this.getTermSheets(this.applicationSelection.termSheetCode);
        this.cancelForm();
        this.resetOnApplicationChange();
        this.getLLLDetails();
        this.getAllContractorTiering(this.applicationSelection.loanApplicationId, this.applicationSelection.customerId);
        this.getAllContractorTieringComputation(this.applicationSelection.loanApplicationId, this.applicationSelection.customerId);
        this.isRacReady = false;
        this.documentationSections = [];
        this.documentations = [];
        this.documentTemplates = [];
        this.getLoanDetail();
        this.GetFacilityByApplicationId(this.applicationSelection.loanApplicationId);
        this.recommendedItems = [];
        this.selectedCustomerRating = null;
        this.enabled = true;
        
        this.applicationId = this.applicationSelection.loanApplicationId;
        this.loanApplicationId = this.applicationId;
        this.productClassProcessId = this.applicationSelection.productClassProcessId
        this.operationId = this.applicationSelection.operationId;
        this.apiRequestId = this.applicationSelection.apiRequestId;

        this.loanApplicationDetail = this.applicationSelection;
        //this.loanApplicationDetailId = this.applicationSelection;
        this.customerId = this.applicationSelection.customerId;
        this.currencyId = this.applicationSelection.currencyId;
        this.creditGradeId = this.applicationSelection.creditGradeId;
        this.customerGroupId = this.applicationSelection.customerGroupId;
        this.loanTypeId = this.applicationSelection.loanTypeId;
        this.workingLoanApplication = this.applicationSelection.applicationReferenceNumber;// + ' ' + appl.applicantName;
        this.isProductProgram = this.productPrograms.some(x => x.productClassId == this.applicationSelection.productClassId);

        
        this.resolveUntenored();debugger
        this.getUserPrivileges(this.applicationSelection.currentApprovalLevelId); // call this inside getObligorInformation
        // this.getAppraisalMemorandumDocument(applicationId);

        this.getLoanApplicationFees();
        // this.getLoanDetailChangeLog(); // --------------- REMOVE & LAZY LOAD!

        //new
        this.loadAllLoanApplicationDetails(this.applicationSelection); // foreign!
        this.getTrail();
        this.activeTabindex = 1;
        // this.activeTabindex = 2; this.approve();

        if (this.applicationSelection.productClassId == 7) { this.getProductLimitValidation(); }

        if (this.applicationSelection.customerId) {
            this.getAccountNumbers(this.applicationSelection.customerId);
        }

        this.applicationDisbursmentApprovalLevelId();
        this.customer = this.getCustomerIds();
            if (this.loanTypeId == LoanTypeEnum.GroupCustomer) {
                this.customer.push(this.customerGroupId);
            }
        // this.getObligorExposure();
        this.getCustomerbyApplication(this.applicationId);
        this.getTotalExposureLimit(this.applicationId);
        this.getProposedCollateral(this.applicationId);

        let roleRec = this.staffRoleRecord;
       
        if (roleRec.staffRoleCode=="CRM"){ // HARD CODING !!!!!!!!!!!!!!!!!
            this.userisAnalyst=true;
            this.viewCustomerFinancialStatement = false;
            this.canDoFinancialStatementEntry =true;
            //this.customerFinancials.displayFinancialStatement = true;
            this.customerFinancials.loadCustomerDetails(this.applicationSelection.customerId);
            //this.viewFinancialStatement();
        }else{
            this.userisAnalyst=false;
            this.viewCustomerFinancialStatement = true;
            this.canDoFinancialStatementEntry =false;
        }

        
        this.getDocumentTemplate(false);
        this.loadDefaultDocumentTemplate();
        
        this.getCustomerRatios(this.applicationSelection.customerId);
        // this.reload ++;
        this.reloadGrid();
        // this.refreshCollateral();
        // this.productClassId = this.applicationSelection.productClassId;

        if (this.apiRequestId == null) {
            this.loanSource = "Credit360 Portal";
        }
        else {
            this.loanSource = "Cashflow Portal";
        }
            
        this.showFinancialStatement = this.applicationSelection.custTypeId == IntegratedCustomerTypeEnum.CORPORATE ? true : false;
    }
    untenored: boolean = false;


    resolveUntenored() {
        if (this.applicationSelection.productClassId == this.BONDS_AND_GUARANTEE_ID) {
            this.loadingService.show();
            this.camService.getUntenoredStatus(this.applicationSelection.loanApplicationId).subscribe((response:any) => {
                this.untenored = response.result;
                this.loadingService.hide();
            }, (err) => {
                this.loadingService.hide(1000);
            });
        }
    }

    editCashBack(){
    this.showCasgBackForm = true;
    }
    
    submitCashbackForm(form) {
        this.loadingService.show();
        let body = {
            background: form.value.background,
            issues: form.value.issues,
            request: form.value.request,
            loanApplicationDetailId: this.loanApplicationDetaiId,
            operationId: this.operationId, 
        };
    
            this.loanService.saveCashbackTemplate(body).subscribe((res) => {
                this.loadingService.hide();
                if (res.success == true) {
                    this.finishGood2(res.message);
                    this.showCasgBackForm = false;
                    this.getCashBackMemoHtml(this.operationId, this.loanApplicationDetaiId) 

                } else {
                    this.finishBad(res.message);
                }
            }, (err: any) => {
                this.loadingService.hide(1000);
                this.finishBad(JSON.stringify(err));
            });
    }


    getCashBackMemoHtml(operationId, targetId) {
        this.camService.getCashBackMemoHtml(operationId, targetId).subscribe((response:any) => {
            if (response.result == null) return;
            this.cashBackHtml = response.result;
        }, (err) => {
           
        });
    }

    finishGood2(message) {
        this.showMessage(message, 'success', "FintrakBanking");
    }

    assignedApplications: any[] = [];
    getLoanApplications(
        page: number,
        itemsPerPage: number,
        classId: number = this.filteredProductClassId,
        search: boolean = false
        ) {
            if (search == false) { this.searchString = ''; this.searching = false; } else { this.searching = true; }
            this.loadingService.show();
            this.camService.getLoanApplicationJobs(this.OPERATION_ID, page, itemsPerPage, classId, this.searchString, this.isPoolRequest).subscribe((response:any) => {
            this.itemTotal = response.count;
                this.applications = response.result;
                if(this.isPoolRequest == true){
                    // this.assignedApplications = this.applications.filter(x=>x.toStaffId != null);   
                    // if(this.assignedApplications != null && this.assignedApplications != undefined && this.assignedApplications.length > 0){
                    //     this.assignedApplications.slice; 
                    // }
                
                    // COMMENT IF YOU NEED TO SHOW ASSIGNED JOBS ON GENERAL POOL
                    this.applications = this.applications.filter(x=>x.toStaffId == null);
                }
                if(this.isPoolRequest == false || this.isPoolRequest == null){
                    this.assignedApplications = this.applications;
                }
                  
                if (this.applications.length > 0) { this.applications.slice; }
                         
            this.showLoadIcon = false;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
        if(this.isPoolRequest == true){
            this.getLoanApplicationsPool(classId,search);
        }
    }

    getLoanApplicationsPool(
        // page: number,
        // itemsPerPage: number,
        classId: number = this.filteredProductClassId,
        search: boolean = false
        ) {
            if(this.isPoolRequest == false){
                return;
            }
            this.loadingService.show();
            if (search == false) { 
                this.searchString = ''; this.searching = false; } else { this.searching = true; 
                }
                this.camService.getPoolApplications(this.OPERATION_ID, classId, this.searchString).subscribe((response:any) => {
            	this.loadingService.hide();
                this.assignedApplications = response.result;
                if ( !isNullOrUndefined(this.assignedApplications) && this.assignedApplications.length > 0){
                    this.assignedApplications.slice; 
                }
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    // resolve privileges
    resolve: any;
    privileges;
    
    privilege: any
        = {
        viewCamDocument: false,
        viewUploadedFiles: false,
        viewApproval: false,
        canMakeChanges: false,
        canAppendTemplate: false,
        canApprove: false,
        canUploadFile: false,
        canSendRequest: false,
        canEscalate: false,
        owner: false,
        approvalLimit: 0,
        userApprovalLevelIds: null,
        currentApprovalLevelId: 0,
        currentApprovalLevel: null,
        groupRoleId: 1, // bu,ca,md,comm,bd
    };
   

    canForward() {
        if (this.applicationSelection == null) return;
        if (this.applicationSelection.currentApprovalLevelId > 0
            && (this.applicationSelection.currentApprovalLevelId == this.privilege.approvalLevelId)) {
            return true;
        }
       if (this.privilege.currentApprovalLevelId < 1
            || this.privilege.currentApprovalLevelId == this.applicationSelection.currentApprovalLevel) {
            return true;
        }
        return false;
    }

    canEditDocument() {
        if (this.applicationSelection == null) return;
        if (this.applicationSelection.currentApprovalLevelId < 1) { return true; }
        if (this.privilege.canMakeChanges == true || this.privilege.owner == true) { return true; }
        return false;
    }
    
    getCustomerbyApplication(applicationId) {
        this.camService.getCustomerbyApplication(applicationId, "LOS").subscribe((response:any) => {
            this.applicationCustomers = response.result;
        });

    }
    getLowestUserLevelId() {
        if (this.privilege.userApprovalLevelIds.length > 0) {
            return this.privilege.userApprovalLevelIds[0];
        }
        return 0;
    }

    documentOwner() {
        if (this.privilege.currentApprovalLevelId < 1 || this.memo == null) {
            this.privilege.owner = true;
            return;
        }
        if (this.memo.approvalLevelId < 1) {
            this.privilege.owner = true;
            return;
        }
        if (this.privilege.userApprovalLevelIds == null) return;
        this.privilege.owner = this.privilege.userApprovalLevelIds.indexOf(this.memo.approvalLevelId) > -1;
    }

    // withinApprovalLimits() {
    //     if (this.applicationSelection == null) return;
    //     if (this.privilege.approvalLimit >= this.applicationSelection.applicationAmount) { // <------------------- tenor and investment grade not factored in !!!!!
    //         return true;
    //     }
    //     return false;
    // }
    withinApprovalLimits() {
        if (this.applicationSelection == null) return;
        if (this.privilege.approvalLimit > 0) {
            if (this.privilege.approvalLimit >= (this.applicationSelection.applicationAmount + this.applicationSelection.customerExposure)
                && this.privilege.canApprove
            ) {
                // <------------------- tenor and investment grade not factored in !!!!!
                return true;
            }
            return false;
        } else {
            return true;
        }
    }

    approveActionLabel: string = 'Approve';
    // authorizeActionLabel: string = 'Authorize';

    getApproveButtonLabel() {
        if (this.withinApprovalLimits() == true) {
            return this.approveActionLabel;
        }
        return 'Accept'; // this.authorizeActionLabel;
    }

    getUserPrivileges(levelId: number = null) {debugger
        let body = {
            levelId: levelId,
            operationId: this.OPERATION_ID,
            targetId: this.applicationSelection.loanApplicationId,
            productClassId: this.applicationSelection.productClassId,
            productId: null,
        };

        this.camService.getPrivilege(body).subscribe((response: any) => {
            this.privilege = response.result;
            //console.log('privilege...', this.privilege);
            // this.privilege.currentApprovalLevelId = this.obligor.currentApprovalLevelId;
            this.privilege.currentApprovalLevel =
                this.applicationSelection.currentApprovalLevel;
            this.isAnalyst =
                this.privilege.groupRoleId === ApprovalGroupRole.CAP ? true : false;
            this.isBusiness =
                this.privilege.groupRoleId === ApprovalGroupRole.BU ? true : false;
            if (this.privilege.groupRoleId === 0) this.isBusiness = true;
            this.isBoard =
                this.privilege.groupRoleId === ApprovalGroupRole.BOD ? true : false;
            this.refreshTabs();
            //this.getRecommendedCollateral(); // lazyload this!
            this.getCustomerLimitValidation();
            this.getRatings();

            if (this.isAnalyst) {
                this.forwardCamStatus();
            }
            //this.enebleFacilityChange = this.enableLineChanges();
        });
    }


    

    // cam document

    memo: any = {};
    // camDocument: any;
    documentExist: boolean = false;

    // getAppraisalMemorandumDocument(applicationId: number) {
    //     this.camService.getCamDocument(applicationId).subscribe((response:any) => {
    //         this.memo = response.result;
    //         this.documentExist = (response.result != null) ? true : false;
    //         this.selectedAppraisalMemorandumId = (response.result != null) ? response.result.appraisalMemorandumId : null; // TODO: get this from the memo object 
    //         this.selectedDocumentationId = (response.result != null) ? response.result.documentationId : null; // TODO: get this from the memo object 
    //         if (response.result != null) { this.loadEditor(response.result.camDocumentation); } // could be directly assigned
    //         this.refreshTabs();
    //         this.documentOwner();
    //     });
    // }

    refreshTabs() {
        this.disableApplicationInformationTab = false;
        this.disableAppraisalMemorandumTab = false;
        this.disableSupportingDocumentsTab = false;
        this.disableApprovalsAndCommentsTab = false;
        this.disableConditionsTab = false;
        this.disableDynamicsTab = false;
        this.disableTriggersTab = false;
    }

    createDocument(): void {
        let body = {
            loanApplicationId: this.applicationSelection.loanApplicationId,
        }
        this.loadingService.show();
        this.camService.createNewDocument(body).subscribe((response:any) => {
            this.loadingService.hide();
            if (response.success == false) {
                this.finishBad(response.message);
                this.errorMessage = response.message;
            } else {
                this.documentExist = (response.result != null) ? true : false;
                this.selectedAppraisalMemorandumId = (response.result != null) ? response.result.appraisalMemorandumId : null; // TODO: get this from the memo object 
                this.selectedDocumentationId = (response.result != null) ? response.result.documentationId : null; // TODO: get this from the memo object 
                if (response.result != null) { this.loadEditor(response.result.camDocumentation); } // could be directly assigned
                this.getLoanApplications(this.currentLazyLoadEvent.first, this.currentLazyLoadEvent.rows); // refresh list
            }
        }, (err: any) => {
            this.loadingService.hide(1000);
            this.finishBad(JSON.stringify(err));
        });
    }

    selectedDocumentationId?: number = null;
    selectedAppraisalMemorandumId?: number = null;

    // getCamBody() {
    //     return {
    //         appraisalMemorandumId: this.selectedAppraisalMemorandumId,
    //         camDocumentation: this.camDocument
    //     }
    // }

    // saveChanges() {
    //     this.updateFromEditor++;
    //     let __this = this;
    //     setTimeout(function () {
    //         __this.camService.saveDocument(__this.getCamBody(), __this.selectedDocumentationId).subscribe((response:any) => {
    //             if (response.success == false) {
    //                 __this.finishBad(response.message);
    //             } else {
    //                 __this.finishGood();
    //                 __this.editMode = false;
    //             }
    //         }, (err: any) => {
    //             __this.finishBad(JSON.stringify(err));
    //         });
    //     }, 0);
    // }

    getReapplicationType() {
        const result = 'Unknown';
    }

    // append document

    appendForm: FormGroup;
    documentTemplates: any[] = [];
    displayAppendModal: boolean = false;

    clearControls() {
        this.formState = 'New';
        this.documentSectionForm = this.fb.group({
            sectionId: ['', Validators.required],
        });
        this.appendForm = this.fb.group({
            creditTemplateId: ['', Validators.required],
        });
        this.limitValidationForm = this.fb.group({
            recommendedAmount: ['', Validators.required],
            controlAmount: ['', Validators.required],
            applicationDetailId: ['', Validators.required],
        });

        this.loanApplicationTagsForm = this.fb.group({
            isProjectRelated: [''],
            isOnLending: [''],
            isInterventionFunds: [''],
            withInstruction: [''],
            domiciliationNotInPlace: [''],
            isAgricRelated: '',
            isSyndicated:''
          
        });

        this.contractorTieringForm = this.fb.group({
            projectList: ['', Validators.required],
            companyAge: ['', Validators.required],
            expertise: ['', Validators.required],
            ownershipStructure: ['', Validators.required],
            annualTurnOver: ['', Validators.required],
            assetsValueOwn: ['', Validators.required],
            netWorth: ['', Validators.required],
            financialStatement: ['', Validators.required],
            obligorRisk: ['', Validators.required]
        });

    }

    clearExposureControls(){
        this.ExposureForm = this.fb.group({
            facilityName:[''],
            currency:[''],
            impact:[''],
            approvedAmount:[''],
            outstandingExpo:[''],
            currencyCode:[''],
            date:[''],
            legalLendingUnit:[''],
            tenor:[''],
        });
    }

    numberFormat(number): string {
        return number.toLocaleString(undefined, { maximumFractionDigits: 2 })
    }

    getAccountNumbers(id: number) {
        this.customerService.getAllCustomerAccountByCustomerId(id).subscribe((response:any) => {
            this.accountNumbers = response.result;
        });
    }

    // exposures: any[] = [];
    // customerIds: number[] = [];

    // getCustomerExposures() {
    //     this.loadingService.show();
    //     this.loanService.getCurrentCustomerExposure(this.customerIds.map(x => ({ 'customerId': x }))).subscribe((response:any) => {
    //         this.exposures = response.result;
    //         this.loadingService.hide();
    //     }, (error) => {
    //         this.loadingService.hide(1000);
    //     });
    // }


    format(number) {
        return number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    clearRequestControls() {
        // this.replyForm = this.fb.group({
        //     responseComment: ['', Validators.required],
        // });
        // this.reassignForm = this.fb.group({
        //     reassignedTo: ['', Validators.required],
        //     staffName: ['', Validators.required],
        // });
        this.commentForm = this.fb.group({
            comment: ['', Validators.required], // debug_test, flow_test
            vote: ['', Validators.required],
            principal: [''],
            rate: [''],
            tenor: [''],
            productId: [''],
            trailId: [''],
            statusId: [''],
            exchangeRate: [''],
            initialExposure: [''],
            totalExposure: [''],
            newExposure: [''],
        });

        
        // this.templateForm = this.fb.group({
        //     testContent: ['', Validators.required],
        // });
        this.isBusiness == true ? 'Comment' : 'Recommendation';
    }

    // forward / approve / refer back

    displayCommentForm: boolean = false;
    commentTitle: string = null;
    commentForm: FormGroup;
    forwardAction: number = 0;
    receiverLevelId: number = null;
    receiverStaffId: number = null;
    nextLevelId: number = 0;

    initiator() {
        return this.applicationSelection.approvedAmount == 0 && this.privilege.canApprove == false;
    }

    forward() {
        this.getDocumentationSections();
        if (this.isLLLViolated == true) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Sorry, Legal Lending Limit is Violated, You can\'t move further!', 'error');
                return;
            }
        if (this.allRequiredDocumentsAreUploaded == false) {
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Some required documents Upload still pending!', 'error');
            return;
        }

        if (this.isLoadTemplate == false && this.userIsAccountOfficer){
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Please kindly load a template for the request!', 'error');
            return;
        }

        if ((this.creditGradeId == null || this.creditGradeId == 0) && this.userIsAccountOfficer && this.productClassProcessId !=2) {
            swal(
              `${GlobalConfig.APPLICATION_NAME}`,
              "Please select a credit grade for this request!",
              "error"
            );
            return;
          }

        if ((this.contractTierings == null || this.contractTierings.length == 0) && this.isChecked == true){
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Please kindly fill Contractor Criteria form!', 'error');
            this.displayContractorCriteriaModal = true;
            return;
        }

        
        // if (this.termsIsSet == false && this.isAnalyst == true) {
        //     swal(`${GlobalConfig.APPLICATION_NAME}`, 'Repayment Schedule terms NOT set!', 'error');
        //     return;
        // }
        // if (this.obligorLimitValid(this.applicationSelection.approvedAmount) == false) return;
        this.receiverLevelId = null;
        // this.receiverStaffId = null;
        this.getWarningMessage();
        this.clearRequestControls();
        this.computeInitialExposure();
        this.forwardAction = ApprovalStatus.PROCESSING;
        this.displayCommentForm = true;
        this.commentTitle = 'Forward';
        // if (this.isBusiness) { this.commentForm.controls['vote'].setValue(2); }
        this.commentForm.controls['vote'].setValue(2);
        // if (this.userIsAccountOfficer || this.userIsRelationshipManager || this.userisAnalyst) { this.commentForm.controls['vote'].setValue(2); }
    }

    approve() {
        if (this.allRequiredDocumentsAreUploaded == false) {
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Some required documents Upload still pending!', 'error');
            return;
        }

        // if (this.termsIsSet == false && this.isAnalyst == true) {
        //     swal(`${GlobalConfig.APPLICATION_NAME}`, 'Repayment Schedule terms NOT set!', 'error');
        //     return;
        // }
        this.receiverLevelId = null;
        this.getWarningMessage();
        this.clearRequestControls();
        this.computeInitialExposure();
        this.forwardAction = ApprovalStatus.APPROVED;
        this.displayCommentForm = true;
        this.commentTitle = this.getApproveButtonLabel() + '';
        // if (this.isBusiness) { this.commentForm.controls['vote'].setValue(2); }
        this.commentForm.controls['vote'].setValue(2);
        // if (this.userIsAccountOfficer || this.userIsRelationshipManager) { this.commentForm.controls['vote'].setValue(2); }
    }

    disapprove() {
        this.clearRequestControls();
        this.computeInitialExposure();
        this.forwardAction = ApprovalStatus.DISAPPROVED;
        this.displayCommentForm = true;
        this.commentTitle = 'Disapprove';
        this.commentForm.controls['vote'].setValue(3);
        // this.commentForm.controls['vote'].setValue(1);
    }

    refer() {
        this.clearRequestControls();
        this.computeInitialExposure();
        this.forwardAction = ApprovalStatus.REFERRED;
        this.displayCommentForm = true;
        this.commentTitle = 'Refer Back';
        this.referBackTrail();
        let control = this.commentForm.controls['trailId'];
        control.setValidators([Validators.required]);
        control.updateValueAndValidity();
        this.commentForm.controls['vote'].setValue(5);
    }

    escalate() {
        this.clearRequestControls();
        this.computeInitialExposure();
        this.forwardAction = ApprovalStatus.ESCALATED;
        this.displayCommentForm = true;
        this.commentTitle = 'Escalate';
        this.commentForm.controls['vote'].setValue(7);
    }

    // forwardCam(form) {
    //     // this.showMessage('Specify', 'error', "FintrakBanking");

    //     let body = {
    //         forwardAction: this.forwardAction,
    //         applicationId: this.applicationSelection.loanApplicationId,
    //         appraisalMemorandumId: this.selectedAppraisalMemorandumId,
    //         amount: this.applicationSelection.applicationAmount,
    //         applicationTenor: this.applicationSelection.applicationTenor,
    //         politicallyExposed: this.applicationSelection.isPoliticallyExposed,
    //         productClassId: this.applicationSelection.productClassId,
    //         productId: this.applicationSelection.productId,
    //         investmentGrade: this.applicationSelection.isInvestmentGrade,
    //         receiverLevelId: this.receiverLevelId, // refer back
    //         receiverStaffId: this.receiverStaffId, // refer back
    //         comment: form.value.comment,
    //         vote: +form.value.vote,
    //         recommendedChanges: this.recommendedItems, // line item changes
    //         isBusiness: this.isBusiness,
    //         untenored: this.untenored,//untenored
    //         interestRateConcession: null, // TODO
    //         feeRateConcession: this.getConcession(), // TODO
    //     };


    //     this.errorMessage = '';
    //     if (this.validLineItems() == false) {
    //         this.errorMessage = 'All items in the facility list above must be approved or disapproved to go forward.';
    //         return;
    //     }
    //     this.loadingService.show();
    //     this.camService.forwardCam(body).subscribe((response:any) => {
    //         if (response.success == true) {
    //             this.reset();
    //             this.displayCommentForm = false;
    //             this.clearRequestControls();
    //             this.loadingService.hide();
              
    //                 if(response.result.isFinal == true)
    //                 {
    //                     this.reportServ.generateOoutPutDocument(this.loanApplicationId).subscribe((res) => {
    //                         let  path = res.result;
    //                         if (path != null) {
                                

    //                           this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
                              
                              
    //                           this.displayTestReport = false;
                              
    //                           this.displayApplicationStatusMessage(response.result);
                                
    //                         }
                              
    //                         });
    //                 }else{
    //                     this.displayApplicationStatusMessage(response.result);
    //             }
                
    //         } else {
    //             this.finishBad(response.message);
    //             this.errorMessage = response.message;
    //         }
    //     }, (err: any) => {
                    // this.loadingService.hide(1000);
        //         this.finishBad(JSON.stringify(err));
    //     });
    // }

    getNextLevel(){
        const __this =this;
        let body = {
            forwardAction: 0,
            applicationId: __this.applicationSelection.loanApplicationId,
            appraisalMemorandumId: __this.selectedAppraisalMemorandumId,
            amount: __this.applicationSelection.applicationAmount,
            applicationTenor: __this.applicationSelection.applicationTenor,
            politicallyExposed: __this.applicationSelection.isPoliticallyExposed,
            productClassId: __this.applicationSelection.productClassId,
            productId: __this.applicationSelection.productId,
            investmentGrade: __this.applicationSelection.isInvestmentGrade,
            receiverLevelId: __this.receiverLevelId, // refer back
            receiverStaffId: __this.receiverStaffId, // refer back
            comment: "get Next Level",
            vote: 1,
            recommendedChanges: __this.recommendedItems, // line item changes
            isBusiness: __this.isBusiness,
            untenored: __this.untenored,//untenored
            interestRateConcession: null, // TODO
            feeRateConcession: __this.getConcession(), // TODO
            isFlowTest : true,
            legalLendingLimit: __this.legalLendingLimitImpact,
            isFromPc: true,
            creditGradeId: this.creditGradeId
        };

        __this.loadingService.show();
        __this.camService.forwardCam(body).subscribe((response:any) => { //console.log('response',response);
        __this.loadingService.hide();
            if (response.success == true){
                __this.nextLevelId = response.result.nextLevelId;
                __this.displayApproverSearchForm = true;
            } else {
                __this.finishBad(response.message);
                __this.errorMessage = response.message;
            }
        }, (err: any) => {
            __this.loadingService.hide(1000);
            __this.finishBad(JSON.stringify(err));
        });
    }

    forwardCam(form) {
        
        // this.showMessage('Specify', 'error', "FintrakBanking");
        const __this =this;
        let body = {
            forwardAction: __this.forwardAction,
            applicationId: __this.applicationSelection.loanApplicationId,
            appraisalMemorandumId: __this.selectedAppraisalMemorandumId,
            amount: __this.applicationSelection.applicationAmount,
            applicationTenor: __this.applicationSelection.applicationTenor,
            politicallyExposed: __this.applicationSelection.isPoliticallyExposed,
            productClassId: __this.applicationSelection.productClassId,
            productId: __this.applicationSelection.productId,
            investmentGrade: __this.applicationSelection.isInvestmentGrade,
            receiverLevelId: __this.receiverLevelId, // refer back
            receiverStaffId: __this.receiverStaffId, // refer back
            comment: form.value.comment,
            vote: +form.value.vote,
            recommendedChanges: __this.recommendedItems, // line item changes
            isBusiness: __this.isBusiness,
            untenored: __this.untenored,//untenored
            interestRateConcession: null, // TODO
            feeRateConcession: __this.getConcession(), // TODO
            isFlowTest : true,
            legalLendingLimit: __this.legalLendingLimitImpact,
            isFromPc: true,
            creditGradeId: this.creditGradeId
        };
            if(__this.forwardAction == 5)    { body.isFlowTest = false}

        __this.errorMessage = '';
        if (__this.validLineItems() == false) {
            __this.errorMessage = 'All items in the facility list above must be approved or disapproved to go forward.';
            return;
        }
        __this.loadingService.show();
        __this.camService.forwardCam(body).subscribe((response:any) => { //console.log('response',response);
        __this.loadingService.hide();
        if (response.success == true) {
            if(__this.forwardAction == 5) {
                 
                __this.reset();
                __this.displayCommentForm = false;
                __this.clearRequestControls();
                if(response.result.isFinal == true)
                {
                    __this.reportServ.generateOoutPutDocument(__this.loanApplicationId).subscribe((res) => {
                        let  path = res.result;
                        if (path != null) {
                            __this.reportSrc = __this.sanitizer.bypassSecurityTrustResourceUrl(path);
                            __this.displayTestReport = false;
                            
                            __this.displayApplicationStatusMessage(response.result);
                        }
                            
                        });
                }
                else{
                    __this.displayApplicationStatusMessage(response.result);
                }
                return;
            }
            
                var promptMessage;
                if (response.stateId == 3)
                promptMessage = 'The loan application has been '+response.result.statusName;
            else{

                promptMessage = 'Application Status: '+ response.result.statusName +'. \n Next Approver: '+response.result.nextLevelName  +'-'+response.result.nextPersonName ;
            }
            swal({
                title: 'Workflow Destination Route',
                text: promptMessage + '\n Do you want to proceed?',
                type: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No, I want to select another approver',
                confirmButtonClass: 'btn btn-success btn-move',
                cancelButtonClass: 'btn btn-danger',
                buttonsStyling: true,
            }).then(function () {
                __this.loadingService.show();
                body.isFlowTest = false;
                __this.camService.forwardCam(body).subscribe((response:any) => {
                    __this.loadingService.hide();
                    
                    if (response.success == true) {
                        __this.reset();
                        __this.displayCommentForm = false;
                        __this.clearRequestControls();
                        if(response.result.isFinal == true)
                        {
                            __this.reportServ.generateOoutPutDocument(__this.loanApplicationId).subscribe((res) => {
                                let  path = res.result;
                                if (path != null) {
                                    __this.reportSrc = __this.sanitizer.bypassSecurityTrustResourceUrl(path);
                                    __this.displayTestReport = false;
                                    
                                    __this.displayApplicationStatusMessage(response.result);
                                    __this.reset();
                                }
                                    
                                });
                        }
                        else{
                            __this.displayApplicationStatusMessage(response.result);
                            __this.reset();
                        }
                    } else {
                        __this.finishBad(response.message);
                        __this.errorMessage = response.message;
                    }
                }, (err: any) => {
                    __this.loadingService.hide(1000);
                    __this.finishBad(JSON.stringify(err));
                });

            }, function (dismiss) {
                if (dismiss === 'cancel') {
                    __this.nextLevelId = response.result.nextLevelId;
                    __this.displayApproverSearchForm = true;
                    //swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
                }
            });
                
            } else {
                __this.finishBad(response.message);
                __this.errorMessage = response.message;
            }
        }, (err: any) => {
            __this.loadingService.hide(1000);
            __this.finishBad(JSON.stringify(err));
        });
    }

    displayApplicationStatusMessage(response:any) {
        if (response.stateId == 3)
            swal(`${GlobalConfig.APPLICATION_NAME}`, `The loan application has been <strong i18n>${response.statusName}</strong>`, 'success');
        else{

            swal(`${GlobalConfig.APPLICATION_NAME}`, `Application Status: <strong i18n>${response.statusName}</strong>, Sent to: ${response.nextLevelName} <i>${response.nextPersonName}</i>`, 'success');
        }
    }

    termsIsSet: boolean = false;

    hasTerms(event) { this.termsIsSet = event; }

    cancelForm() {
        this.displayCommentForm = false;
        this.errorMessage = '';
        this.lineSelection = null;
        this.receiverLevelId = null;
        this.receiverStaffId = null;
        this.selectedLineId = null;
        this.forwardAction = 0;
        // this.isBusiness = false;
        this.untenored = null;
    }

    // line recommended and proposed items

    fees: any[] = [];
    changeLog: any[] = [];
    customerRatiosItems: any[]= [];
    proposedItems: any[] = [];
    recommendedItems: any[] = [];
    touchedLineItems: number[] = [];
    duplications: number[] = [];
    selectedLineId: number;
    showChangeLog: boolean = false;
    displayChangeLog: boolean = false;
    showSpinnerChangeLog: boolean = false;
    enebleFacilityChange: boolean = false;

    getLoanDetail(): void {
        this.reload = 0;
        this.loadingService.show();
        this.camService.getLoanDetail(this.applicationSelection.loanApplicationId).subscribe((response:any) => {
            // console.log();
            this.duplications = response.result.duplications;
            this.proposedItems = response.result.facilities;
            this.facilityCount = response.result.facilities.length;
            // this.reload++;
            // console.log("proposedItems1: ", this.proposedItems);
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    getLoanApplicationFees(): void {
        this.loadingService.show();
        this.camService.getLoanApplicationFees(this.applicationSelection.loanApplicationId).subscribe((response:any) => {
            this.fees = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

   
    getConcession() {
        const has = this.fees.some(x => x.hasConcession == true);
        if (has == false) return null;
        const concessions = this.fees.filter(x => x.hasConcession == true);
        const concession = concessions.reduce((prev, current) => (prev.recommendedFeeRate > current.recommendedFeeRate) ? prev : current);
        return concession.recommendedFeeRate;
    }

    getLoanDetailChangeLog(modal: boolean = false): void { // PLEASE LAZY LOAD THIS!!!
        this.showSpinnerChangeLog = true;
        this.showChangeLog = modal == true ? true : false;

        this.loadingService.show();
        this.camService.getLoanDetailChangeLog(this.applicationSelection.loanApplicationId).subscribe((response:any) => {
            this.loadingService.hide();
            this.changeLog = response.result;
            this.displayChangeLog = true;
            this.showSpinnerChangeLog = false;
        }, (err) => {
            this.loadingService.hide(1000);
            this.showSpinnerChangeLog = false;
        });
    }

    onLineRowSelect(row, clear = true) {
        this.enebleFacilityChange = this.enableChanges();
        if (this.enebleFacilityChange == false) return;
        this.selectedLineId = row.loanApplicationDetailId; // tobe used @ onLineItemChange()
        if (clear) this.clearRecommendationForm(this.selectedLineId);
        let item = this.recommendedItems.find(x => x.detailId == row.loanApplicationDetailId);
        this.computeTotalExposure();
        this.computeNewExposure();
        if (item == null) { return; }
        this.commentForm.controls['principal'].setValue(item.amount);
        this.commentForm.controls['rate'].setValue(item.interestRate);
        this.commentForm.controls['tenor'].setValue(item.tenor);
        this.commentForm.controls['productId'].setValue(item.productId);
        this.commentForm.controls['statusId'].setValue(item.statusId);
        this.commentForm.controls['exchangeRate'].setValue(item.exchangeRate);
    }

    computeInitialExposure() {
        var sum = this.proposedItems
            .map(x => x.convertedApprovedAmount) // converts the object array to int array
            .reduce((a, b) => +a + +b, 0);
        this.commentForm.controls['initialExposure'].setValue(sum.toLocaleString('en-US', { minimumFractionDigits: 2 }));
        return sum;
    }
    @ViewChild(CustomerFinancialStatementComponent, { static: true }) customerFinancials: CustomerFinancialStatementComponent;

    displayFinancialStatement: boolean = false;
    viewFinancialStatement() {
        this.customerFinancials.displayFinancialStatement = true;
        this.customerFinancials.loadCustomerDetails(this.applicationSelection.customerId);
    }
    computeTotalExposure() {
        var sum = this.proposedItems
            .filter(x => x.statusId == ApprovalStatus.APPROVED)
            .map(x => x.convertedApprovedAmount) // converts the object array to int array
            .reduce((a, b) => +a + +b, 0);
        this.commentForm.controls['totalExposure'].setValue(sum.toLocaleString('en-US', { minimumFractionDigits: 2 }));
        return sum;
    }

    computeNewExposure() {
        var r = this.recommendedItems
            .filter(x => x.statusId == ApprovalStatus.APPROVED)
            .map(x => x.convertedAmount) // converts the object array to int array
            .reduce((a, b) => +a + +b, 0);
        var touchedIds = this.recommendedItems.map(x => x.detailId);
        var p = this.proposedItems
            .filter(x => x.statusId == ApprovalStatus.APPROVED && touchedIds.indexOf(x.loanApplicationDetailId) == -1)
            .map(x => x.convertedApprovedAmount) // converts the object array to int array
            .reduce((a, b) => +a + +b, 0);
        var sum = r + p;
        ////console.log('recommended...', JSON.stringify(this.recommendedItems));
        ////console.log('touched...', JSON.stringify(touchedIds));
        ////console.log('R...', JSON.stringify(r));
        ////console.log('P...', JSON.stringify(p));
        this.commentForm.controls['newExposure'].setValue(sum.toLocaleString('en-US', { minimumFractionDigits: 2 }));
        return sum;
    }

    onLineItemChange(input, value, id = null) {
        if (value.toString().trim() == '') return;
        if (this.selectedLineId == null) this.handleZeroSelection();
        this.selectedLineId = id == null ? this.selectedLineId : +id;
        let item = this.recommendedItems.find(x => x.detailId == this.selectedLineId);
        if (item == null) {
            let o = this.proposedItems.find(x => x.loanApplicationDetailId == this.selectedLineId);
            let newRecommendation = {
                detailId: o.loanApplicationDetailId,
                productId: o.approvedProductId,
                statusId: o.statusId,
                amount: o.approvedAmount,
                exchangeRate: o.exchangeRate,
                interestRate: o.approvedRate,
                tenor: o.approvedTenor,
                productName: o.approvedProductName,
                convertedAmount: o.convertedApprovedAmount
            };
            this.recommendedItems.push(newRecommendation);
            item = newRecommendation;
        }
        if (input == 1) { value = this.formatMCleanup(value); } // resolve the null=0 bug
        switch (input) {
            case 1: item.amount = value; item.convertedAmount = value * item.exchangeRate; break;
            case 2: item.interestRate = value; break;
            case 3: item.tenor = value * 30; break;
            case 4: item.productId = value; item.productName = this.getProductName(value); break;
            case 5: item.statusId = value; this.commentForm.controls['statusId'].setValue(value); this.setProductApprovalStatus(value); break;
            case 6: item.exchangeRate = value; item.convertedAmount = value * item.amount; break;
        }
        this.computeTotalExposure();
        this.computeNewExposure();
        this.touchedLineItems.push(this.selectedLineId); // mark change made here *
    }

    formatMCleanup(value) {
        var numberPart = value.substr(0, value.length - 1);
        var readablePart: string = value.substr(-1);
        numberPart = parseFloat(numberPart.replace(/,/g, '')).toString();
        if (readablePart === 'M' || readablePart == 'm') {
            return Number(numberPart) * 1000000;
        } else if (readablePart === 'T' || readablePart == 't' || readablePart === 'K' || readablePart === 'k') {
            return Number(numberPart) * 1000;
        } else if (readablePart === 'b' || readablePart === 'B') {
            return Number(numberPart) * 1000000000;
        } else {
            return Number(numberPart);
        }
    }

    getProductName(id) {
        return this.products.find(x => x.productId == id).productName;
    }

    setProductApprovalStatus(value) {
        let o = this.proposedItems.find(x => x.loanApplicationDetailId == this.selectedLineId);
        o.statusId = value;
    }

    getProductApprovalStatus() {
        let o = this.proposedItems.find(x => x.loanApplicationDetailId == this.selectedLineId);
        return o.statusId;
    }

    validLineItems() {
        if (this.forwardAction != ApprovalStatus.APPROVED && this.forwardAction != ApprovalStatus.ESCALATED) { return true; }
        if (this.privilege.canApprove == false) { return true; }
        if (this.facilityCount == 1) {
            const id = this.proposedItems[0].loanApplicationDetailId;
            this.onLineItemChange(5, 2, id);
        }
        if (this.proposedItems.some(x => x.statusId == ApprovalStatus.PROCESSING)) { return false; }
        return this.proposedItems.some(x => x.statusId == ApprovalStatus.APPROVED);
    }

    clearRecommendationForm(id = null) {
        this.commentForm.controls['principal'].setValue('');
        this.commentForm.controls['rate'].setValue('');
        this.commentForm.controls['tenor'].setValue('');
        this.commentForm.controls['productId'].setValue('');
        this.commentForm.controls['statusId'].setValue(this.getProductApprovalStatus());
        this.commentForm.controls['exchangeRate'].setValue('');
    }

    enableChanges() {
        return (this.privilege.canMakeChanges == true);
            // || (this.privilege.canApprove == true && this.privilege.canMakeChanges == true);
    }

    canSupport() {
        return this.privilege.canApprove && this.forwardAction != 3 && this.facilityCount > 1;
    }

    handleZeroSelection() {
        if (this.proposedItems.length > 1) {
            this.clearControls();
            this.errorMessage = 'Please select a facility to change.';
            return;
        }
        this.onLineRowSelect(this.proposedItems[0], false);
    }

    // tab management

    activeTabindex: number = 0;

    reset() {
        this.loadingService.reset();
        this.cancelForm();
        let control = this.commentForm.controls['trailId'];
        control.setValidators(null);
        control.updateValueAndValidity();
        // this.monitoringTriggerCollection = [];
        this.enabled = false;
        this.reload = 1;
        this.activeTabindex = 0;
        this.applicationSelection = null;
        this.workingLoanApplication = null;
        this.disableApplicationInformationTab = true;
        this.disableAppraisalMemorandumTab = true;
        this.disableSupportingDocumentsTab = true;
        this.disableApprovalsAndCommentsTab = true;
        this.disableConditionsTab = true;
        this.disableDynamicsTab = true;
        this.disableTriggersTab = true;
        this.nextLevelId = 0;
        
        this.filteredProductClass = null;
        this.filteredProductClassId = null; // MUST RUN BEFORE getLoanApplications()
        this.getLoanApplications(0, this.currentLazyLoadEvent.rows); // refresh list

        this.loadProductPrograms();
        this.selectedApplicationDetailId = null;
        this.duplications = [];
        this.proposedItems = [];
        this.conditionsSeen = false;
        this.dynamicsSeen = false;
        this.termsIsSet = false;
        this.pageReady = false;
        this.obligorLimitValidated = false;
        this.changeLog = [];

        this.documentationSections = [];
        this.documentTemplates = [];
        this.isLoadTemplate = false;
        this.tranchDisbursmentApprovalLevelId = null;
        this.workflowTargets = [];

    }

    onTabChange(e) {
        this.activeTabindex = e.index;
        // if (e.index == 1) { this.getDocumentationSections(); this.getTrail(); }
        if (e.index == 0) {this.reset();}
        if (e.index == 1) { this.getTrail(); }
        // if (e.index == 2) { this.getTrail(); this.canForward(); this.documentOwner(); this.autoLoadTemplate(); }
        if (e.index == 3) { }//this.getSupportingDocuments(this.applicationSelection.applicationReferenceNumber); }
        if (e.index == 7) { this.getTrail(); }
        if (e.index == 3) { this.conditionsSeen = true; }
        if (e.index == 4) { this.dynamicsSeen = true; }
    }

    // trail & comment

    trail: any[] = [];
    backtrail: any[] = [];
    trailCount: number = 0;
    trailLevels: any[] = [];
    trailRecent: any = null;

    getTrail() {
        this.loadingService.show();
        this.camService.getTrail(this.applicationSelection.loanApplicationId, this.applicationSelection.operationId).subscribe((response:any) => {
            this.trail = response.result;
            if (this.trail == null) return;
            this.trailCount = this.trail.length;
            
            this.trailRecent = response.result[0];
            response.result.forEach((trail) => {
                if (this.trailLevels.find(x => x.requestStaffId === trail.requestStaffId) === undefined) {
                    this.trailLevels.push(trail);
                }
            });
            // this.referBackTrail();
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    referBackTrail(): any {
        // console.log('trail', this.trail);
        // console.log('backtrail', this.backtrail);
        this.backtrail = []; 
        this.loadingService.show();
        this.camService.getTrailForReferBack(this.applicationSelection.loanApplicationId, this.applicationSelection.operationId, this.applicationSelection.currentApprovalLevelId, false).subscribe((response:any) => {
            this.loadingService.hide();
            this.backtrail = response.result;
        }, (err) => {
            this.loadingService.hide(1000);
        });
        // this.trail.forEach(x => {
        //     if (this.backtrail.find(t =>
        //         t.fromApprovalLevelId == x.fromApprovalLevelId
        //         && t.requestStaffId == x.requestStaffId
        //     ) == null && x.fromApprovalLevelId != null
        //     ) {
        //         this.backtrail.push({
        //             approvalTrailId: x.approvalTrailId,
        //             fromApprovalLevelId: x.fromApprovalLevelId,
        //             fromApprovalLevelName: x.fromApprovalLevelName,
        //             requestStaffId: x.requestStaffId,
        //             staffName: x.fromStaffName,
        //         });
        //     }
        // });
    }

    approvalStatus = [
        { id: 0, name: 'Pending' },
        { id: 1, name: 'Processing' },
        { id: 2, name: 'Approved' },
        { id: 3, name: 'Disapproved' },
        { id: 4, name: 'Authorised' },
        { id: 5, name: 'Referred' },
        { id: 6, name: 'Rerouted' },
    ];


    decision = [
        { id: 1, name: 'No' },
        { id: 2, name: 'Yes' },
        { id: 3, name: 'No with condition' },
        { id: 4, name: 'Yes with condition' },
    ];

    getApprovalStatus(id) {
        let item = this.approvalStatus.find(x => x.id == id);
        return item == null ? 'n/a' : item.name;
    }

    getDecision(id) {
        let item = this.decision.find(x => x.id == id);
        return item == null ? 'n/a' : item.name;
    }

    // refer back filter

    // queryReferBack: string;
    // filteredTrail: any[] = [];

    // filterReferBack() {
    //     if (this.queryReferBack !== "") {
    //         this.filteredTrail = this.trail.filter(function (e) {
    //             return e.staffName.toLowerCase().indexOf(this.queryReferBack.toLowerCase()) > -1;
    //         }.bind(this));
    //     } else {
    //         this.filteredTrail = [];
    //     }
    // }

    // selectReferBackLevel(id, name) {
    //     this.filteredTrail = [];
    //     this.commentForm.controls['staffName'].setValue(name);
    //     this.receiverLevelId = id;
    // }

    onTargetStaffLevelChange(trailId) {
        let selected = this.trail.find(x => x.approvalTrailId == trailId);
        if (selected != null) {
            this.receiverStaffId = selected.requestStaffId;
            this.receiverLevelId = selected.fromApprovalLevelId;
        }
    }

    // before demo

    getApplicationStatus(submitted, approvalStatus) {
        if (submitted == true) {
            let processLabel = 'PROCESSING';
            // if (this.privilege.groupRoleId != ApprovalGroupRole.BU) { processLabel = 'FAM PROCESS'; }
            if (approvalStatus == ApprovalStatus.PROCESSING)
                return '<span class="label label-info">' + processLabel + '</span>';
            if (approvalStatus == ApprovalStatus.AUTHORISED)
                return '<span class="label label-info">' + processLabel + '</span>';
            if (approvalStatus == ApprovalStatus.REFERRED)
                return '<span class="label label-danger">REFERRED BACK</span>';
            if (approvalStatus == ApprovalStatus.APPROVED)
                return '<span class="label label-success">APPROVED</span>';
            if (approvalStatus == ApprovalStatus.DISAPPROVED)
                return '<span class="label label-danger">REJECTED</span>';
        }
        return '<span class="label label-warning">NEW APPLICATION</span>';
    }

    // multi cams

    newDocumentation() {
        const __this = this;
        swal({
            title: 'Create New Appraisal Memorandum?',
            text: 'You won\'t be able to revert this!',
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

            let body = {
                loanApplicationId: __this.applicationSelection.loanApplicationId,
            }
            __this.loadingService.show();
            __this.camService.createNewDocument(body).subscribe((response:any) => {
                __this.loadingService.hide();
                if (response.success === true) {
                    swal(GlobalConfig.APPLICATION_NAME, 'New Memorandum Created.', 'success');
                    __this.documentExist = (response.result != null) ? true : false;
                    __this.selectedAppraisalMemorandumId = (response.result != null) ? response.result.appraisalMemorandumId : null; // TODO: get __this from the memo object 
                    __this.selectedDocumentationId = (response.result != null) ? response.result.documentationId : null; // TODO: get __this from the memo object 
                    if (response.result != null) { __this.loadEditor(response.result.camDocumentation); } // could be directly assigned
                    __this.getLoanApplications(__this.currentLazyLoadEvent.first, __this.currentLazyLoadEvent.rows); // refresh list
                    __this.memo = response.result;
                    __this.documentOwner();
                } else {
                    swal(GlobalConfig.APPLICATION_NAME, response.message, 'error');
                }
            }, (err: any) => {
                __this.loadingService.hide(1000);
                __this.finishBad(JSON.stringify(err));
            });

        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(GlobalConfig.APPLICATION_NAME, 'Operation cancelled', 'error');
            }
        });
    }

    // CUSTOMER INFORMATION TAB

    loadAllLoanApplicationDetails(appl) {
        this.getcustomerLimitAndRating(appl.customerId);
        // others ...
    }

    existingLoans: any[] = [];
    outstandingAmt: number;
    totalApproved: number;
    existingExposure: string;
    existingApproved: string;

    showSpinnerExistingLoans: boolean = false;
    displayExistingLoans: boolean = false;

    getCustomerExistingLoans() { // credit\loans\start-loan-application\start-loan-application.component
        this.showSpinnerExistingLoans = true;
        this.loanService.getExistingLoans(this.applicationSelection.loanApplicationId).subscribe((response:any) => {
            this.existingLoans = [];
            this.outstandingAmt = 0;
            this.totalApproved = 0;
            this.existingLoans = response.result;
            this.showSpinnerExistingLoans = false;
            this.displayExistingLoans = true;
            console.log('Existing loans:',this.existingLoans);
            if (this.existingLoans.length > 0) {
                this.existingLoans.forEach(el => {
                    this.outstandingAmt += el.outstandingPrincipal;
                    this.totalApproved += el.approvedAmount;
                });
                this.existingExposure = this.outstandingAmt.toLocaleString('en-US', { minimumFractionDigits: 2 });
                this.existingApproved = this.totalApproved.toLocaleString('en-US', { minimumFractionDigits: 2 });
            }
        });
    }

    // Limit / Exposure
    customerRating: string;
    investmentGrade: boolean;

    isCleanLending = true; lgroupLimit: any; lrMLimit: any; lnPLLimit: any; lcustomerLimit: any;
    lsegmentLimit: any; lsectorLimit: any; lbranchLimit: any; ogroupLimit: any; orMLimit: any;
    onPLLimit: any; ocustomerLimit: any; osegmentLimit: any; osectorLimit: any; obranchLimit: any;

    getcustomerLimitAndRating(customerId) { // credit\loans\application\newloanapplication.component.h
        if (customerId == null) return;
        this.customerService.getCustomerRatingAndLimit(customerId).subscribe((res) => {
            ////console.log('res - ', res);
            if (res.success == true && res.result != null) {
                this.lcustomerLimit = res.result.limit;
                this.customerRating = res.result.rating;
                this.investmentGrade = res.result.isInvestment;
            }
        }, (err) => {
            ////console.log(err);
        });
    }

    // CUSTOMER rating

    ratings: any[] = [];
    riskRatingId: number = null;
    obligorLimitValidated: boolean = false;
    limitValidation: any = { outstandingBalance: 0, limit: 1, difference: 0, riskRatingId: 0 }
    obligorExposure: number = 0;
    availableLimit: number = 0;

    obligorLimitValid(amount = this.applicationSelection.approvedAmount) {
        if (this.isAnalyst == false) return true;
        if (this.limitValidation.limit == 0) return true;
        let validity = false;
        validity = (amount + this.limitValidation.outstandingBalance) <= this.limitValidation.outstandingBalance;
        // if (validity == false) {
        //     swal(`${GlobalConfig.APPLICATION_NAME}`, 'Obligor limit NOT validated!', 'error');
        //     return false;
        // }
        return true;
    }

    getRatings() {
        this.loadingService.show();
        this.camService.getRatings().subscribe((response:any) => {
            this.ratings = response.result;
            ////console.log(this.ratings);
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    saveCustomerRating() {
        const body = {
            scenerio: 1,
            customerId: this.applicationSelection.customerId,
            customerGroupId: this.applicationSelection.customerGroupId,
            applicationId: this.applicationSelection.loanApplicationId,
            riskRatingId: this.riskRatingId
        }
        this.loadingService.show();
        this.camService.saveCustomerRating(body).subscribe((response:any) => {
            this.loadingService.hide();
            if (response.result == true) 
            { 
                this.getCustomerLimitValidation();
            }else{ 
            swal(
                'Fintrak Credit Credit 360',
                response.message,
                'error'
                )
            }
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    getCustomerLimitValidation() {
        const body = {
            scenerio: 1,
            customerId: this.applicationSelection.customerId,
            customerGroupId: this.applicationSelection.customerGroupId,
            applicationId: this.applicationSelection.loanApplicationId,
            riskRatingId: this.riskRatingId
        }
        this.loadingService.show();
        this.camService.getCustomerLimitValidation(body).subscribe((response:any) => {
            this.loadingService.hide();
            this.limitValidation = response.result;
            this.availableLimit = this.limitValidation.limit - this.obligorExposure;
            //console.log('rat',response);
            this.riskRatingId = this.limitValidation.riskRatingId;
            this.obligorLimitValidated = this.limitValidation.limit == 0
                ? true : (this.applicationSelection.approvedAmount + this.limitValidation.outstandingBalance) <= this.limitValidation.outstandingBalance;
            // this.obligorLimitValid();
            
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }


    // TEMPLATE FORM

    displayTemplateForm: boolean = false;

    closeTemplateForm() {
        this.displayTemplateForm = false;
        this.editMode = false;
    }

    // AUTLOAD ANALYST TEMPLATE --- this block exist due to customization request - not recommended!!!!

    autoLoadTemplate() {
        if (this.autoLoadAnalystTemplate == false) { return; }
        // if (this.isAnalyst == false) { return; }
        if (this.documentations.length == 0) {
            this.loadingService.show(); // DUPLICATION
            this.camService.getDocumentations(this.applicationSelection.loanApplicationId).subscribe((response:any) => {
                this.documentations = response.result;
                this.loadingService.hide();
                ////console.log('cams..', response.result);
            }, (err) => {
                this.loadingService.hide(1000);
                ////console.log("error", err);
            });
        }
        let cams = this.documentations.length;
        if (cams === 1) { // set for only 2 if (cams === 1)
            this.newDocumentationAuto();
        }
    }

    newDocumentationAuto() { // mirror of newDocumentation()
        const __this = this;
        let body = {
            loanApplicationId: __this.applicationSelection.loanApplicationId,
        }
        __this.loadingService.show();
        __this.camService.createNewDocument(body).subscribe((response:any) => {
            __this.loadingService.hide();
            if (response.success === true) {
                __this.documentExist = (response.result != null) ? true : false;
                __this.selectedAppraisalMemorandumId = (response.result != null) ? response.result.appraisalMemorandumId : null; // TODO: get __this from the memo object 
                __this.selectedDocumentationId = (response.result != null) ? response.result.documentationId : null; // TODO: get __this from the memo object 
                if (response.result != null) { __this.loadEditor(response.result.camDocumentation); } // could be directly assigned
                __this.getLoanApplications(__this.currentLazyLoadEvent.first, __this.currentLazyLoadEvent.rows); // refresh list
                __this.memo = response.result;
                __this.documentOwner();
                // __this.activeTabindex = 2;
                __this.editMode = true;
            }
        }, (err: any) => {
            __this.loadingService.hide(1000);
            __this.finishBad(JSON.stringify(err));
        });
    }

    // ENDOF AUTLOAD ANALYST TEMPLATE

    /**

    CanDoRiskAssessment
    HasChecklist
    CanPerformFinancialAnalysis

    -- financial analysis ?
    -- checklist
    -- risk assessments & rating
    -- collateral evaluation
    -- convenant
     */

    // dropdown list

    maritalStatus = [
        { id: 1, name: 'Single' },
        { id: 2, name: 'Married' },
        { id: 3, name: 'Divorced' },
        { id: 4, name: 'Widowed' },
    ];

    getMaritalStatus(id) {
        let item = this.maritalStatus.find(x => x.id == id);
        return item == null ? 'n/a' : item.name;
    }

    // ---------------------- product papers ----------------------

    filteredProductClass: string = null;
    isProductProgram: boolean = false;

    filterByProductClass(classId, className) {
        this.filteredProductClass = className;
        this.filteredProductClassId = classId;
        this.getLoanApplications(0, this.currentLazyLoadEvent.rows, classId);
    }

    // ----------------------- limits validation -----------------

    limitValidations: any[] = [];
    limitValidationForm: FormGroup;
    expectedRecommendedAmount: number = 0;
    perLimit: number = 0;
    displayLimitValidationForm: boolean = false;

    editRecommended(row) {
        this.limitValidationForm = this.fb.group({
            recommendedAmount: [row.recommendedAmount, Validators.required],
            applicationDetailId: [row.applicationDetailId, Validators.required],
            controlAmount: [row.controlAmount, Validators.required],
        });
        this.perLimit = row.percentageLimit;
        this.calculateExpectedRecommended(row.controlAmount);
        this.displayLimitValidationForm = true;
    }

    saveProductLimitValidation(form) {
        let body = {
            recommendedAmount: form.value.recommendedAmount,
            applicationDetailId: form.value.applicationDetailId,
            productClassId: this.applicationSelection.productClassId,
            controlAmount: form.value.controlAmount,
        };
        this.loadingService.show();
        this.camService.saveProductLimitValidation(body).subscribe((response:any) => {
            this.limitValidations = response.result;
            if(this.limitValidations.length >0)this.limitValidations.slice(); // table refresh
            this.displayLimitValidationForm = false;
            this.loadingService.hide();
            this.getLoanDetail(); // reload details
        }, (err) => {
            this.loadingService.hide(1000);
            ////console.log('ERROR saving limits validation!', JSON.stringify(err));
        });
    }

    getProductLimitValidation() {
        this.camService.getProductLimitValidation(
            this.applicationSelection.loanApplicationId,
            this.applicationSelection.productClassId
        ).subscribe((response:any) => {
            this.limitValidations = response.result;
            if(this.limitValidations.length >0)this.limitValidations.slice(); // table refresh
        }, (err) => {
            ////console.log('ERROR getting limits validation!', JSON.stringify(err));
        });
    }

    calculateExpectedRecommended(control = null) {
        const form = this.limitValidationForm.value;
        if (control != null) { this.expectedRecommendedAmount = (this.perLimit / 100) * control; return; }
        this.expectedRecommendedAmount = (this.perLimit / 100) * parseFloat(form.controlAmount.toString().replace(/,/g, ''));
    }

    // ----------------------- before ff warning ----------------

    warningMessage: string = '';
    conditionsSeen: boolean = false;
    dynamicsSeen: boolean = false;

    getWarningMessage() {
        let message = '';
        if (this.conditionsSeen == false && this.isAnalyst == true) message = message + 'You have not reviewed condition precedent!. ';
        if (this.dynamicsSeen == false && this.isAnalyst == true) message = message + 'You have not reviewed transaction dynamics!. ';
        this.warningMessage = message
    }

    // ----------------------- signatures ------------------------

    signatures: any[] = [];

    getAllStaffSignatures() {
        this.loadingService.show();
        this.camService.getAllStaffSignatures().subscribe((response:any) => {
            this.signatures = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
            ////console.log('server error', err);
        });
    }

    // ----------------------- navigation ------------------------

    navigateTo(location: string): void {
        window.location.hash = location;
        setTimeout(() => {
            document.querySelector(location).parentElement.scrollIntoView();
        });
    }

    // Tranch disbursement approval level

    tranchDisbursmentApprovalLevelId: number = null;

    tranchDisbursmentApprovalLevels: any[] = [];

    applicationDisbursmentApprovalLevelId() { this.tranchDisbursmentApprovalLevelId = this.applicationSelection.tranchLevelId; }

    getDisbursmentApprovalLevels() {
        this.camService.getTranchDisbursmentApprovalLevels().subscribe((response:any) => {
            this.tranchDisbursmentApprovalLevels = response.result;
        });
    }

    // getDisbursmentApprovalLevels() {
    //     this.camService.getApprovalLevelByOperationByProduct(39, null).subscribe((response:any) => {
    //         this.tranchDisbursmentApprovalLevels = response.result;
    //     });
    // }

    saveTranchDisbursmentApprovalLevel() {
        const body = {
            approvalLevelId: this.tranchDisbursmentApprovalLevelId,
            loanApplicationId: this.applicationSelection.loanApplicationId
        }
        this.loadingService.show();
        this.camService.saveTranchDisbursmentApprovalLevel(body).subscribe((response:any) => { // TODO
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    // ---------------------- form cam ----------------------

    // ckeditor
    ckeditorChanges: any;
    contentChange(updates) { this.ckeditorChanges = updates; }

    sectionContent: any;
    sectionDescription: any = '';
    documentationSections: any[] = [];
    editMode: boolean = false;
    selectedSectionId: number = null;
    selectedSectionIdIndex: number = null;
    documentSectionForm: FormGroup;
    displayDocumentation: boolean = false;
    documentations: any[] = [];
    updateFromEditor: number = 0;

    getDocumentationSections() {
        this.loadingService.show();
        this.documentationSections = [];
        this.camService.getDocumentSections(this.OPERATION_ID, this.applicationSelection.loanApplicationId).subscribe((response:any) => {
            this.loadingService.hide();
            this.documentationSections = response.result;
            if (this.documentationSections != null && this.documentationSections != undefined && this.documentationSections.length > 0) {
                this.isLoadTemplate = true;
            }
            else{
                this.isLoadTemplate = false;
            }
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    getDocumentTemplate(requireModal = true) {
        this.clearControls();
        this.loadingService.show();
        this.documentTemplates = [];

        this.camService.getDocumentTemplates(this.OPERATION_ID).subscribe((response:any) => {
            this.documentTemplates = response.result;
            // console.log('documentTemplates',this.documentTemplates);
            if(requireModal == true) { 
            // console.log('requireModal ',requireModal);
                this.displayAppendModal = true; 
            } else if(response.success == true){
            // console.log('response.success ', response.success);
            // this.loadDefaultDocumentTemplate();
            }
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    loadDocumentTemplate(form) {
        const body = {
            templateId: form.value.creditTemplateId,
            operationId: this.OPERATION_ID,
            targetId: this.applicationSelection.loanApplicationId,
        }

        this.loadingService.show();
        this.camService.loadDocumentTemplate(body).subscribe((response:any) => { // heavy call!
        this.loadingService.hide();
        if(response.success == true){
            this.isLoadTemplate = true;
        }
        this.displayAppendModal = false;
        ////console.log('loadDocumentTemplate -> ',response);
        this.getDocumentationSections();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    

    onDocumentSectionChange(sectionId) { 
        this.loadingService.show();

        if(sectionId == null || sectionId == '') {
             this.displayDocumentation = true; 
            }
        if(sectionId > 0) {
             this.displayDocumentation = false 
            }

        this.camService.getDocumentSection(this.OPERATION_ID, this.applicationSelection.loanApplicationId, sectionId).subscribe((response:any) => {
            ////console.log('getDocumentSection -> ', response);
            if (response.result == null) return;
            this.editMode = (response.result.editable == true);
            this.sectionContent = response.result.templateDocument;
            this.sectionDescription = response.result.description;
            this.selectedSectionId = sectionId;
            this.selectedSectionIdIndex = this.documentationSections.findIndex(x => x.sectionId == sectionId);
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    saveSection(alert = false) {
        this.sectionContent = this.ckeditorChanges; // on save click
        const body = {
            templateDocument: this.sectionContent,
            sectionId: this.selectedSectionId
        };
        this.camService.saveSection(body).subscribe((response:any) => {
            ////console.log('saved --> ', response);
            this.ckeditorChanges = null; // cleanup
            if (alert == true) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Document saved!', 'success');
            }
        });
    }

    nextSection(direction) {
        const max = this.documentationSections.length - 1;
        let index = direction == 1 ? this.selectedSectionIdIndex - 1 : this.selectedSectionIdIndex + 1;
        if (index > max) index = 0;
        if (index < 0) index = max;
        const sectionId = this.documentationSections[index].sectionId;
        this.documentSectionForm.controls['sectionId'].setValue(sectionId);
        this.onDocumentSectionChange(sectionId);
    }

    previewDocumentation(print = false) {
        this.documentations = [];
        this.loadingService.show();
        this.camService.getDocumentation(this.OPERATION_ID, this.applicationSelection.loanApplicationId).subscribe((response:any) => {
        this.documentations = response.result;
        this.loadingService.hide();
        if (print == false) this.displayDocumentation = true;
        else setTimeout(() => this.print(), 1000);
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    dialogHiding(event: Event) {

        const element = document.getElementsByTagName('html');
        element[0].style.overflow = "visible" ;
    }

    dialogShowing(event: Event) {
        const element = document.getElementsByTagName('html');
        element[0].style.overflow = "hidden" ;
    }

    loadDefaultDocumentTemplate() {
        if (this.documentTemplates.length > 0) {
            const body = {
                templateId: this.documentTemplates[0].templateId,
                operationId: this.OPERATION_ID,
                targetId: this.applicationSelection.loanApplicationId,
            };
            this.loadingService.show();
            this.camService.loadDocumentTemplate(body).subscribe((response:any) => { // heavy call!
            if(response.success == true){
              this.isLoadTemplate = true;
            }
            this.loadingService.hide();
            this.displayAppendModal = false;
            if(response.success){
                this.preLoadDocument();
            }

        }, (err) => {
                this.loadingService.hide(1000);
            });
        }
        this.getDocumentationSections();
    }

    preLoadDocument() {
       // this.onDocumentSectionChange(this.documentationSections[0].sectionId);
      // this.getDocumentationSections();
        this.previewDocumentation(false);
    }


    print(): void {

        let printTitle = 'FACILITY APPROVAL MEMO No.:' + this.workingLoanApplication;
        let printContents, popupWin;

        let content = '<div class="row">';
        this.documentations.forEach(x => {
            content = content + `<div class="col-md-12"><p><span style="font face: arial; size:12px">${x.templateDocument}</span></p></div>`;
        });
        content = content + '</div>';

        printContents = content;// document.getElementById('print-section').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
            <html>
                <head>
                <title style="font face: arial; size:12px">${printTitle}</title>
                <style>
                //........Customized style.......
                </style>
                </head>
                <body onload="window.print();window.close()" style="font face: arial; size:12px">${printContents}</body>
            </html>`
        );
        popupWin.document.close();
    }

    printSelectedSection(): void {
        //this.previewDocumentation(true);
            let printTitle = 'FACILITY APPROVAL MEMO No.:' + this.workingLoanApplication;
            let printContents, popupWin;
            printContents = document.getElementById('print-selected-section').innerHTML;
            popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=100%');
            popupWin.document.open();
            popupWin.document.write(`
            <html>
                <head>
                <title>${printTitle}</title>
                <style>
                //........Customized style.......
                </style>
                </head>
                <body onload="window.print();window.close()">${printContents}</body>
            </html>`
            );
            popupWin.document.close();
        
      }

    closeDocumentation() {
        this.displayDocumentation = false;
        this.documentations = [];
    }

    loadEditor(body) {
        this.sectionContent = body;
    }

    getCustomerIds() {
        var customerIds = this.proposedItems.map(item => item.customerId)
            .filter((value, index, self) => self.indexOf(value) === index);

        return customerIds;
    }

    totalOutstandingAmount: number;
    totalExistingLimitAmount: number;
    totalObligorExposure: number;
    customerExposure: any[] = [];

    getObligorExposure() {
        this.loanService.getExistingLoans(this.applicationSelection.loanApplicationId).subscribe((response:any) => {
            this.existingLoans = [];
            this.outstandingAmt = 0;
            this.totalApproved = 0;
            this.customerExposure = [];

            this.totalObligorExposure = 0;
            this.existingLoans = response.result;
            if (this.existingLoans.length > 0) {
                this.existingLoans.forEach(el => {
                    this.outstandingAmt += el.outstandingPrincipal;
                    this.totalApproved += el.approvedAmount;
                });

                this.obligorExposure = this.outstandingAmt// + this.applicationSelection.applicationAmount;
           }
            

            this.loanService.getCurrentCustomerExposure(this.customer.map(x => ({ 'customerId': x })))
            .subscribe((response:any) => {
                this.customerExposure = response.result;
                if (this.customerExposure == null || this.customerExposure == undefined || this.customerExposure.length <= 0) {return;}
                let el =this.customerExposure.find(x=>x.facilityType == "TOTAL")

                // this.totalOutstandingAmount = el.proposedLimit;
                // this.totalExistingLimitAmount = el.existingLimit;
                // this.totalObligorExposure =this.totalOutstandingAmount+this.totalExistingLimitAmount;
            });
           
        });
    }

    //[disabled]="(this.penApplications == null || this.penApplications == undefined) ? null : null"
    getAvailableLimit() { this.obligorExposure - 0 }//this.limitValidation.limit; }

    // getNewDocumentValue(content) {
    //     this.sectionContent = content;
    // }


    loanApplicationTags: any;
    loanApplicationTagsForm: FormGroup;
 
    saveLoanApplicationTags(form) {
        let body = {
            isProjectRelated: form.value.isProjectRelated,
            isOnLending: form.value.isOnLending,
            isInterventionFunds: form.value.isInterventionFunds,
            withInstruction: form.value.withInstruction,
            domiciliationNotInPlace: form.value.domiciliationNotInPlace,
            isAgricRelated: form.value.isAgricRelated,
            isSyndicated: form.value.isSyndicated,

        };
        this.loadingService.show();
        this.camService.updateLoanApplicationTags(body, this.loanApplicationId).subscribe((response:any) => {
            this.loadingService.hide();
            if (response.success == true) {
                this.finishGood2(response.message);
                this.reloadGrid();
            } else {
                this.finishBad(response.message);
            }
        }, (err: any) => {
            this.loadingService.hide(1000);
            this.finishBad(JSON.stringify(err));
        });
    }

    getLoanApplicationTags() {
        this.camService.getLoanApplicationTags(this.loanApplicationId).subscribe((response:any) => {
            this.loanApplicationTags = response.result;
            this.loanApplicationTagsForm.controls['isProjectRelated'].setValue(this.loanApplicationTags.isProjectRelated);
            this.loanApplicationTagsForm.controls['isOnLending'].setValue(this.loanApplicationTags.isOnLending);
            this.loanApplicationTagsForm.controls['isInterventionFunds'].setValue(this.loanApplicationTags.isInterventionFunds);
            this.loanApplicationTagsForm.controls['withInstruction'].setValue(this.loanApplicationTags.withInstruction);
            this.loanApplicationTagsForm.controls['domiciliationNotInPlace'].setValue(this.loanApplicationTags.domiciliationNotInPlace);
            this.loanApplicationTagsForm.controls['isAgricRelated'].setValue(this.loanApplicationTags.isAgricRelated);
            this.loanApplicationTagsForm.controls['isSyndicated'].setValue(this.loanApplicationTags.isSyndicated);

        });
    }

    
    setrequiredUploadValue(value: boolean) {
        this.allRequiredDocumentsAreUploaded = value;
        // console.log( this.allRequiredDocumentsAreUploaded);
    }

    reloadGrid() {
        this.loanApplicationTagsForm.reset();
        // this.displayLoanApplicationTagsForm = false;
        this.getLoanApplicationTags();
       // this.reload = 999;
        this.reload = 0;
        this.reload = this.applicationSelection.loanApplicationId;
    }

    // editLoanApplicationTags(row) {
    //     this.clearControls();
    //     this.formState = 'Edit';
    //     this.selectedId = row.loanApplicationTagsId;
    //     this.loanApplicationTagsForm = this.fb.group({
    //         isProjectRelated: [row.isProjectRelated, Validators.required],
    //         isOnLending: [row.isOnLending, Validators.required],
    //         isInterventionFunds: [row.isInterventionFunds, Validators.required],
    //     });
    //     this.displayLoanApplicationTagsForm = true;
    // }
    // -------------------------- test status -------------------------


    forwardCamStatus() {
        let body = {
            forwardAction: 2,
            applicationId: this.applicationSelection.loanApplicationId,
            amount: this.applicationSelection.applicationAmount,
            applicationTenor: this.applicationSelection.applicationTenor,
            politicallyExposed: this.applicationSelection.isPoliticallyExposed,
            productClassId: this.applicationSelection.productClassId,
            productId: this.applicationSelection.productId,
            investmentGrade: this.applicationSelection.isInvestmentGrade,
            comment: '',
            isBusiness: this.isBusiness,
            creditGradeId: this.creditGradeId
        };
        this.camService.forwardCamStatus(body).subscribe((response:any) => {
            if (response.success == true) {
                if (response.result.statusId != 2) this.approveActionLabel = 'Submit';
            }
        }, (err: any) => {
            this.finishBad(JSON.stringify(err));
        });
    }

    submitContractorTieringForm(formValues){
        this.loadingService.show();
        let form = formValues.value;
        let body = {
            form: Object.keys(form).map(key => { return { criteriaId: key, value: form[key] } }),
            loanApplicationId: this.applicationSelection.loanApplicationId,
            customerId: this.applicationSelection.customerId,
        };
        this.camService.forwardContractorTiering(body).subscribe((response:any) => {
            this.loadingService.hide();
            if (response.success == true) {
                this.success(response.message);
                this.getAllContractorTiering(this.applicationSelection.loanApplicationId, this.applicationSelection.customerId);
                this.getAllContractorTieringComputation(this.applicationSelection.loanApplicationId, this.applicationSelection.customerId);
                this.displayContractorCriteriaModal=false; ;
            }
        }, (err: any) => {
            this.loadingService.hide(1000);
            this.finishBad(JSON.stringify(err));
        });  
    }
            
    getTotalExposureLimit(loanApplicationId): void {
        this.camService.getTotalExposureLimit({
            applicationId: loanApplicationId,
        }).subscribe((response:any) => {
            this.totalExposureLimit = response.result;
        });
    }

    // ---------------------- message ----------------------

    show: boolean = false; message: any; title: any; cssClass: any; // message box

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
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

    refreshCollateral() {
        this.getProposedCollateral(this.loanApplicationId);
        // this.getLoanApplicationCollateral(this.loanApplicationId);
       // this.collateralDataList.splice();
    }

    getLoanApplicationCollateral(loanApplicationId: number) {
        this.loanService.getLoanApplicationCollateral(loanApplicationId).subscribe((data) => {
            this.loanCollateral = data.result;
        }, err => { });
    }

    // ----------------------------------

    selectedApprover: string = '';

    selectApprover() {
        this.selectedApprover = '';
        this.getNextLevel();
        // this.displayApproverSearchForm = true;
        //if (this.allStaff.length === 0) { this.openSearchBox(); }
    }

    pickSearchedApprover(data) {
        // this.allStaff.push({ staffId: data.staffId, staffName: data.fullName });
        // let control = this.rerouteForm.get('staffId');
        // control.setValue(data.staffId);
        // control.updateValueAndValidity();
        if (data.secondName == undefined)
            this.selectedApprover = data.staffCode + ' -- ' + data.firstName + ' ' + data.lastName;
        else
            this.selectedApprover = data.staffCode + ' -- ' + data.firstName + ' ' + data.secondName + ' ' + data.lastName;
        
        this.receiverStaffId = data.staffId;
        this.displayApproverSearchForm = false;
    }

    searchApprover(searchString) {
        searchString.preventDefault;
        this.searchTerm$.next(searchString);
    }

    loanHasValidFacilityNumbers(): boolean {
        return (this.loanApplicationDetails != null && this.loanApplicationDetails != undefined && this.loanApplicationDetails.length > 0);
    }

    GetFacilityByApplicationId(loanApplicationId) {
        this.proposedProductId = 0;
        this.productDropDown =""
        this.camService.GetFacilityByApplicationId(loanApplicationId).subscribe((data) => {
            this.faciliies = data.result;
            this.loanApplicationDetails = data.result;
        }, err => { });
    }
    
    getRac(id) {
        
        let list = this.faciliies.filter(x => x.productId == id); 
        this.loanApplicationDetailId = list[0].loanApplicationDetailId;
        this.proposedProductId = id

    }
    // JOB REQUEST COMPONENT
    // CallRequestClose() { this.displayRequestForm = false; }
    // getRequestData(event: any) { if (event) { this.displayRequestForm = false; } else {} }

    // ------------------------------------- development only --------------------------------
    testflow() {
        this.camService.testWorkflow().subscribe((response:any) => {
            ////console.log('--test-- ', JSON.stringify(response:any));
        });
    }


    getProposedCollateral(loanApplicationId): void {

        this.collateralService.getProposedCustomerCollateral(loanApplicationId, this.currencyId).subscribe((response:any) => {
            this.proposedCollateral = response.result;

        });
    }

    getCollateralCoverageStatus(): string {
        if (this.proposedCollateral == null || this.proposedCollateral == undefined || this.proposedCollateral.length == 0) {
                return '';
        }
        var totalPercentageCoverage = this.proposedCollateral[0].totalCoverage;
        var expectedCoveragePercentage = this.proposedCollateral[0].expectedCoveragePercentage;
        // this.proposedCollateral.forEach((p) => {
        //     totalPercentageCoverage + p.actualCoveragePercentage;
        // });
        if (totalPercentageCoverage < expectedCoveragePercentage) {
            return '<span class="label label-danger">FACILITY NOT FULLY COVERED</span>';
        } else if (totalPercentageCoverage >= expectedCoveragePercentage) {
            return '<span class="label label-success">FACILITY FULLY COVERED</span>';
        } 
    }

    sendLoanToApplications(){
        const __this = this;
            swal({
                title: 'Are you sure?',
                text: 'You want to modify Loan, this will nullify every approval already done on the loan?',
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
                __this.loadingService.show();
                __this.loanApplService.sendLoanToApplications(__this.loanApplicationId, __this.operationId).
                    subscribe((res) => {
                    __this.loadingService.hide();
                    if (res.success){
                        swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
                        __this.returnToStart();
                    } else {
                        swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
                    }
                }, (err) => {
                    __this.loadingService.hide(1000);
                });
            }, function (dismiss) {
                if (dismiss === 'cancel') {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
                }
            });
    }

    returnToStart() {
        this.router.navigate(['/credit/loan/loan-application-list']);
    }

    DisplayExposureForm() {
        this.getAllExposureManual();
        this.displayExposureModal = true;
        this.displayEditExposureModal = false;
    }

    DisplayEditExposureForm() {
        this.displayExposureModal = false;
        this.displayEditExposureModal = true;
    }

    CloseExposure(){
        this.displayExposureModal = false;
    }

    CloseEditExposure(){
        this.displayEditExposureModal = false;
        this.displayExposureModal = true;
    }
    facilities: any[] =[];
    currencies: any[] =[];
    getAllCurrencies() {
        this.currencyService.getAllCurrencies().subscribe((res) => {
            this.currencies = res.result;
        }, (err) => {

        });
    }

    getAllFacilities() {
        this.currencyService.getAllFacilities().subscribe((res) => {
            this.facilities = res.result;
        }, (err) => {

        });
    }

    getAllExposureManual() {
        this.loanApplService.getAllExposureManual().subscribe((res) => {
            this.exposureSave = res.result;
            //console.log("i am here now for the records"+  JSON.stringify(this.exposureSave));
        }, (err) => {

        });
    }

    
    editContractorTiering(value){
     this.contractorTierId = value;
     this.getContractorTieringForEdit(value);
     this.displayEditContractorTiering = true; 
    }

    submitexposureForm(formObj) {  
        let bodyObj = formObj.value;
        bodyObj.customerId = this.applicationSelection.customerId
        bodyObj.loanApplicationId = this.applicationSelection.loanApplicationId
       // console.log("kingsman", formObj);
        this.entityName = "Edit Exposure";
        if (this.selectedId == null) {
            this.loadingService.show();
            this.loanApplService.addExposure(bodyObj).subscribe((res) => {
                this.loadingService.hide();
                if (res.success == true) {
                this.clearExposureControls();
                this.selectedId = null;
                swal('FinTrak Credit 360', res.message, 'success');
                } else {
                swal('FinTrak Credit 360', res.message, 'error');
                }
            }, (err: any) => {
                swal('FinTrak Credit 360', JSON.stringify(err), 'error');
                this.loadingService.hide(1000);
            });
        } else {
            this.loadingService.show();
            this.loanApplService.updateExposure(bodyObj,this.exposureId).subscribe((res) => {
                this.loadingService.hide();
                if (res.success == true) {
                this.selectedId = null;
                swal('FinTrak Credit 360', res.message, 'success');
            } else {
              swal('FinTrak Credit 360', res.message, 'error');
            }
          }, (err: any) => {
            swal('FinTrak Credit 360', JSON.stringify(err), 'error');
            this.loadingService.hide(1000);
          });
        }
      }


      deleteExposure(row) {

       // console.log(row,"primarykey")
        let __this = this;
        swal({
            title: 'Are you sure?',
            text: "This cannot be reversed. Are you sure you want to proceed?",
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
            
            
        __this.loanApplService.deleteExposure(row.exposureId).subscribe((response:any) => {
            if (response.message == true) 
            __this.getAllExposureManual();
        });
           
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
                __this.getAllExposureManual();
            }
        });
    }

    getCurrentStaffActivities() {
        const userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
        this.currentStaffActivities = userInfo.activities;

        if (this.isAmongActivities('Reassign Requests')) {
            this.isPoolRequest = true;
        }
    }

    isAmongActivities(activity: string): boolean {
        if (this.currentStaffActivities == undefined) {
            return false;
        }
        return (this.currentStaffActivities.indexOf(activity) >= 0);
    }

    enableReroute: boolean;
    pushSelectedLoans(row){
        this.workflowTarget = new WorkflowTarget;
        var record = row.data;
        this.getTermSheets(record.termSheetCode);
        this.workflowTarget.targetId = record.loanApplicationId;
        this.workflowTarget.operationId = record.operationId;
        this.workflowTarget.trailId = record.approvalTrailId;
        this.enableReroute = true;
        this.approvalTrailIds.push(record.approvalTrailId);
        this.workflowTargets.push(this.workflowTarget);
        this.getAllContractorTieringComputation(record.loanApplicationId, record.customerId);
        this.applicationSelection = null;
        
    }

    popSelectedLoans(row) {
        var record = row.data;
        var index = this.workflowTargets.findIndex(x=>x.targetId == record.loanApplicationId);
        this.workflowTargets.splice(index,1);
        // if(this.workflowTargets.length <= 0){
        //     this.routableMode =false;
        // }
    }

    updatePendingData(){
        // this.applications.forEach((item) => {
        //     var assignedItem = this.workflowTargets.filter(x=>x.targetId == item.loanApplicationId);
        //     if(assignedItem != null && assignedItem != undefined){
        //         item.toStaffId = this.staffRoleRecord.staffId;
        //     }
        // });

        var assignedList = this.applications.filter(x=>x.toStaffId > 0);
        this.assignedApplications.push(assignedList);

        this.applications = this.applications.filter(x=>x.toStaffId == null);

        if(this.applications.length >0)this.applications.slice;
        if(this.assignedApplications.length >0)this.assignedApplications.slice;
    }


    AddToMyDesk() {
        const __this = this;
        swal({
            title: 'Are you sure?',
            text: 'You want to assign the application(s) requests to yourself?',
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
            __this.loadingService.show();
            __this.camService.assignRequestToSelf(__this.workflowTargets).subscribe((result) => {
                __this.loadingService.hide();
                if (result.success == true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, result.message, 'success');
                    __this.reset();
                    // __this.getLoanApplications(0, this.currentLazyLoadEvent.rows); // refresh list
                    // __this.updatePendingData();
                    //__this.refresh();
                    __this.displayApproverSearchForm = false;
                    __this.workflowTargets = [];
                }
            }, (err) => {
                __this.loadingService.hide(1000);
            });
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(GlobalConfig.APPLICATION_NAME, 'Operation cancelled', 'error');
            }
        });
    }
    
    resetGrid(yes: boolean) {
        if (yes == true){
            // swal('Fintrak Credit 360','You have successfully routed to a modifier','success');
            this.reset();
        }
        // else swal('Fintrak Credit 360','Routing to modifier failed','error');
    }

    // ------------------------------------- contractor criteria --------------------------------

    initializeContractorCriteriaForm() {
        if (this.contractCriteria == null || this.contractCriteria == {} || this.contractCriteria == undefined) return;
        let formControls = {}; 
            for (let f of this.contractCriteria) {
                formControls[f.criteriaId] = new FormControl("", Validators.required);
            }
            this.contractorCriteriaForm = this.fb.group(formControls);
    }

    getAllContractorCriteria(): void {
        this.camService.getAllContractorCriteria().subscribe((response:any) => {
          this.contractCriteria = response.result;
          this.initializeContractorCriteriaForm();
        });
      }

      getAllContractorTiering(loanApplicationId, customerId): void {
        this.camService.getAllContractorTiering(loanApplicationId, customerId).subscribe((response:any) => {
          this.contractTierings = response.result;
          this.initializeContractorCriteriaForm();
        });
      }

      rating: any;
      getAllContractorTieringComputation(loanApplicationId, customerId): void {
        this.camService.getAllContractorTieringComputation(loanApplicationId, customerId).subscribe((response:any) => {
          this.contractTieringComputation = response.result;
          if(this.contractTieringComputation.length > 0){
            this.customerTier = this.contractTieringComputation[0].computation;
          }
         
          if(this.customerTier >= 80){
              this.rating = "Tier 1";
          }else if(this.customerTier >= 60 && this.customerTier <=79){
            this.rating = "Tier 2";
        }else{
            this.rating = "Tier 3";
        }
          this.initializeContractorCriteriaForm();
        });
      }

      isChecked: boolean = false;
      changed = (evt) => {    
        this.isChecked = evt.target.checked;
        if(this.isChecked && (this.contractTierings.length == 0 || this.contractTierings == null || this.contractTierings == undefined)){
            this.getAllContractorCriteria();
            this.displayContractorCriteriaModal = true;
        }
    }
    
    success(message) {
        this.showMessage(message, 'success', "FintrakBanking");
      }

    getContractorTieringForEdit(contractorTieringId): void {
        this.camService.getContractorTieringForEdit(contractorTieringId).subscribe((response:any) => {
          this.contractCriteria = response.result;
          this.initializeContractorCriteriaForm();
        });
      }


      viewTermSheetDetails(row){
      this.termSheetDetails = row;
      this.displayMoreTermSheetDetails = true;
      }

      

}


/*{
  "isNewApplication": false,
  "closeApplication": false,
  "loanApplicationId": 5927,
  "loanApplicationDetailId": 0,
  "applicationReferenceNumber": "1523985833",
  "customerId": 60,
  "operationId": 6,
  "requireCollateral": false,
  "newApplicationDate": "2018-03-23T00:00:00+01:00",
  "branchId": 2,
  "productClassId": null,
  "productClassName": null,
  "productId": 0,
  "customerGroupId": null,
  "customerGroupCode": null,
  "loanTypeId": 1,
  "casaAccountId": 0,
  "currencyId": 0,
  "currencyCode": null,
  "loanStatusId": 0,
  "loanStatus": null,
  "relationshipOfficerId": 1,
  "relationshipManagerId": 2,
  "applicationDate": "0001-01-01T00:00:00+01:00",
  "applicationAmount": 80000000,
  "approvedAmount": 80000000,
  "applicationTenor": 212,
  "interestRate": 0,
  "effectiveDate": null,
  "expiryDate": null,
  "customerAccount": null,
  "tenorModeId": 0,
  "loanInformation": "<p>This Loan is meant for Dangote subsidary expansion in foriegn countries</p>",
  "misCode": "001",
  "teamMisCode": null,
  "submittedForAppraisal": true,
  "isRelatedParty": false,
  "isPoliticallyExposed": false,
  "approvalStatusId": 1,
  "proposedAmount": 0,
  "proposedTenor": 0,
  "approvalLevelId": 0,
  "subSectorId": 0,
  "sectorId": 0,
  "sectorName": null,
  "isInvestmentGrade": false,
  "customerName": "PELMA INTERNATIONAL PLC  ",
  "branchName": "Ikeja Office",
  "productName": null,
  "customerGroupName": "",
  "loanTypeName": "Single Customer",
  "relationshipOfficerName": "Adesina Mark Omoniyi",
  "relationshipManagerName": "Jane Doe v Doe",
  "tenorModeName": null,
  "applicantName": "PELMA INTERNATIONAL PLC  ()",
  "loanPreliminaryEvaluationId": null,
  "exchangeRate": 0,
  "loanApplicationCollateral": null,
  "loanApplicationDetail": [],
  "details": null,
  "currentApprovalStateId": 2,
  "currentApprovalLevelId": 34,
  "currentApprovalLevel": "Credit Analyst",
  "lastComment": "ok",
  "approvalTrailId": 14061,
  "applicationStatusId": 3,
  "isCollateralBacked": false,
  "tenor": 0,
  "customerInfoValidated": false,
  "notInNegativeCrms": false,
  "notInBlackbook": false,
  "notInCamsol": false,
  "notInXds": false,
  "notInCrc": false,
  "firstName": null,
  "middleName": null,
  "customerCode": null,
  "lastName": null,
  "groupRoleId": 0,
  "accountNumber": null,
  "applicationStatus": null,
  "relatedReferenceNumber": null,
  "toStaffId": null,
  "productClassProcessId": 1,
  "companyId": 0,
  "companyName": null,
  "createdBy": 1558,
  "lastUpdatedBy": 0,
  "dateTimeCreated": "0001-01-01T00:00:00+01:00",
  "dateTimeUpdated": null,
  "deleted": false,
  "deletedBy": null,
  "dateTimeDeleted": null,
  "canModified": false,
  "userBranchId": 0,
  "userIPAddress": null,
  "applicationUrl": null,
  "staffId": 0
}*/