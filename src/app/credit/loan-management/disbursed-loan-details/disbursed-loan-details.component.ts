import { LoanOperationService } from '../../services/loan-operations.service';
import { DateUtilService } from '../../../shared/services/dateutils';
import { LoanService } from '../../services/loan.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { Subscription } from 'rxjs';
import { ReviewIrregularScheduleModel } from '../../models/loan-operation-review';
import { Component, OnInit, Input } from '@angular/core';
import { LoanApplicationService, CreditAppraisalService } from 'app/credit/services';
import { GlobalConfig, LoanSystemTypeEnum } from 'app/shared/constant/app.constant';
import swal from 'sweetalert2';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReportService } from 'app/reports/service/report.service';
import { DocumentpUloadService } from 'app/shared/services/document-upload.service';
import { saveAs } from 'file-saver';
import { StaffRoleService } from 'app/setup/services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { result } from 'lodash';

@Component({
  selector: 'app-disbursed-loan-details',
  templateUrl: './disbursed-loan-details.component.html',
})
export class DisbursedLoanDetailsComponent implements OnInit {
  principalValanceString: any;
  principalBalance: any = 0;
  irregularReviewCollection: ReviewIrregularScheduleModel[] = [];
  scatterdPayments: any[] = [];
  data: any = {};
  loanScheduleDetails: any[];
  customerLoansData: any[];
  operationTypes: any[];
  filteredProducts: any[];
  convenatDetails: any[];// LoanCovenantModel[] = [];;
  collateralDetails: any[];// LoanCovenantModel[] = [];;
  guarantorDetails: any[];// GuarantorAppModel[] = [];
  chargeFeeDetails: any[];// ChargeFeeAppModel[] = [];;
  frequencies: any[];
  displaySearchModal: boolean = false;
  displayReviewModal: boolean = false;
  displayCustomerLoanDetails: boolean = false;
  displayCASASearchModal: boolean = false;
  displayPaymentPlan: boolean = false;
  displayLoanSearch: boolean = true;
  displatBackToSearch: boolean = false;
  displayCasaDetails: boolean = false;
  guarantor: boolean = false;
  selectedTypeId: number = null;
  loanSelection: any;
  model: any;
  entityName: string = "";
  originalForm3800bSrc: any = {};
  displayPaymentPlanButton: boolean = false;
  checkBoxApplicable: boolean = false;
  OPERATION_ID: number = 46;
  documentations: any[] = [];
  displayDocumentation: boolean = false;
  showForm3800B: boolean = true;
  supportingDocuments: any[] = [];
  documentSectionForm: FormGroup;
  uploadFileTitle: string = null;
  files: FileList;
  file: File;
  fileDocument: any;
  pdfFile: any;
  pdfFileName: string;
  displayPdf: boolean = false;
  myDocExtention: string;
  pdfData: any;
  fileUrl: string;
  reviewDetails: any;
  readonly CREDITAPPRIASALDOC: string = "APPRAISAL DOCUMENTS";
  reload: number = 0;
  trail: any[] = [];
  all: boolean = false;
  supportingDocumentsLms: any[] = [];
  operationTypeName: any;
  approvedTenor: number;

  ckeditorChanges: any;
  contentChange(updates) { this.ckeditorChanges = updates; }

  sectionContent: any;
  sectionDescription: any = '';
  documentationSections: any[] = [];
  editMode: boolean = false;
  selectedSectionId: number = null;
  selectedSectionIdIndex: number = null;
  updateFromEditor: number = 0;
  TEMPLATE_OPERATION_ID: number = 6;
  LMS_TEMPLATE_OPERATION_ID: number = 46;
  documentTemplates: any[] = [];
  displayAppendModal: boolean = false;
  private subscriptions = new Subscription();

  @Input('displayDetails') displayDetails: boolean = false;
  @Input('displayCustomerODDetails') displayCustomerODDetails: boolean = false;
  @Input('displayFacilityDetails') displayFacilityDetails: boolean = true;
  @Input('termLoanId') selectedLoanId: number = 0;
  @Input('loanSystemTypeId') loanSystemTypeId: number = 0;
  @Input('selectedApplicationRefNumber') selectedApplicationRefNumber: string;
  @Input('selectedloanReviewApplicationId') selectedloanReviewApplicationId: number;

  @Input('creditAppraisalLoanApplicationId') creditAppraisalLoanApplicationId: number;
  @Input('creditAppraisalOperationId') creditAppraisalOperationId: number;

  @Input('loanApplicationId') loanApplicationId: number = 0;
  @Input('operationId') operationId: number = 0;
  @Input('appraisalOperationName') appraisalOperationName: string;
  @Input('appraisalApprovedTenor') appraisalApprovedTenor: number;

  @Input('lmsLoanApplicationId') lmsLoanApplicationId: number = 0;
  @Input('lmsOperationId') lmsOperationId: number = 0;

  private _loadLoanDetails: number;
  reportSource: SafeResourceUrl;
  applicationReferenceNumber: string;

  @Input() set LoadLoanDetails(value: number) {
    this._loadLoanDetails = value;
    this.applicationReferenceNumber = this.selectedApplicationRefNumber;

    if (value > 0) {
      this.operationTypeName = this.appraisalOperationName;
      this.approvedTenor = this.appraisalApprovedTenor;
      this.loadDistursedLoanDetails(this._loadLoanDetails, this.loanSystemTypeId);

    }
  }
  constructor(private loadingService: LoadingService, private loanSrv: LoanService, private loanApplService: LoanApplicationService,
    private loanOperationService: LoanOperationService, private dateUtilService: DateUtilService, private camService: CreditAppraisalService,
    private sanitizer: DomSanitizer,
    private reportServ: ReportService,
    private documentpUloadService: DocumentpUloadService,
    private staffRole: StaffRoleService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.loanSelection = [];
    this.getUserRole();
    this.check(this.loanSelection.productTypeId);


    //  this.loadDistursedLoanDetails(this.selectedLoanId);

  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  userisAnalyst: boolean = false;
  userIsRelationshipManager = false;
  userIsAccountOfficer = false;
  staffRoleRecord: any;
  selectedId: number = null;

  getFacilitySpecificConditions(facilityId) {

  }

  getUserRole() {
    this.staffRole.getStaffRoleByStaffId().subscribe((res) => {
      this.staffRoleRecord = res.result;
      if (this.staffRoleRecord.staffRoleCode == 'AO' || this.staffRoleRecord.staffRoleCode == 'AO / RO') {
        this.userIsAccountOfficer = true;
      }
      if (this.staffRoleRecord.staffRoleCode == 'RM' || this.staffRoleRecord.staffRoleCode == 'RM / BM') {
        this.userIsRelationshipManager = true;
      }
    });

    this.selectedId = null;
    this.documentSectionForm = this.fb.group({
      sectionId: ['', Validators.required],
    });
  }

  isCreator() {
    if (this.loanSelection == null) return false;
    const user = JSON.parse(window.sessionStorage.getItem('userInfo'));
    return this.loanSelection.createdBy == user.staffId;
  }

  showBalance() {
    //this.showCASAAccountBanlancePopup = true;
    //this.GetAccountBalance();
  }

  getTrail(applicationId, operationId) {
    this.camService.getTrailLms(applicationId, operationId).subscribe((response: any) => {
      this.trail = response.result;
    });
  }

  loadDistursedLoanDetails(loanId, loanType) {
    this.loanSelection = {};
    this.getDocumentationSections(true);
    this.getTrail(this.loanApplicationId, this.operationId);
    this.getApprovedLoanDetails(loanId, loanType);
    if(this.loanSystemTypeId == LoanSystemTypeEnum.ContingentFacility){
      this.GetLoanCollateralOD(loanId, loanType);
      this.GetLoanConvenantOD(loanId, loanType);
      this.GetLoanChargeFeeOD(loanId, loanType);
    }
    if(this.loanSystemTypeId == LoanSystemTypeEnum.TermDisbursedFacility){
      this.GetLoanCollateral(loanId);
      this.GetLoanConvenant(loanId);
      this.GetLoanChargeFee(loanId);
    }
    if(this.loanSystemTypeId == LoanSystemTypeEnum.OverdraftFacility){
      this.GetLoanCollateralODF(loanId);
      this.GetLoanConvenantODF(loanId);
      this.GetLoanChargeFeeODF(loanId);
    }
    
    this.GetLoanScheduleByLoanId(loanId);
    this.getAllUploadedDocumentLms(this.operationId, this.loanApplicationId);
    //this.GetLaonConvenant(loanId);
    // }
    // else
    // {
    //   // this.GetLaonGuarantors(loanId);
    //   this.GetLoanCollateral(loanId);
    //   this.GetLaonConvenant(loanId);
    //   this.GetLaonChargeFee(loanId);
    //   this.GetLaonScheduleByLoanId(loanId);
    // }

  }

  check(productTypeId) {

    if (productTypeId == 6 || productTypeId == 9) {
      this.displayCustomerODDetails = true;

    }
    else {
      this.displayCustomerODDetails = false;

    }
  }

  onDocumentSectionChange(sectionId) {
    this.loadingService.show();
    this.subscriptions.add(
      this.camService.getDocumentSection(this.OPERATION_ID, this.selectedloanReviewApplicationId, sectionId).subscribe((response: any) => {
        if (response.result == null) return;
        this.editMode = response.result.editable;
        this.sectionContent = response.result.templateDocument;
        this.sectionDescription = response.result.description;
        this.selectedSectionId = sectionId;
        this.selectedSectionIdIndex = this.documentationSections.findIndex(x => x.sectionId == sectionId);
        this.loadingService.hide();
      }, (err) => {
        this.loadingService.hide(1000);
      }));
  }
  loadOriginalForm3800BTemplate(applicationReferenceNumber: string) {
    this.loadingService.show();
    this.loanApplService.getForm3800TemplateLMS(applicationReferenceNumber)
      .subscribe((response: any) => {
        let tempSrc = response.result;
        if (tempSrc != null) {
          this.originalForm3800bSrc = tempSrc;
        }
        else {
          this.originalForm3800bSrc = {};
        }
        this.loadingService.hide();
      }, (err) => {
        this.loadingService.hide();
        swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');

      });
  }
  getApprovedLoanDetails(loanId, loanType) {
    this.loadingService.show();
    this.loanOperationService.getDisbursedLoanDetailsById(loanId, loanType).subscribe((response: any) => {
      this.loadingService.hide();
      this.loanSelection = response.result;
      // let facilityType = this.loanSelection.loanSystemTypeId;
      // this.loanSystemTypeId = facilityType;

      // this.getTrail(this.loanApplicationId,this.operationId); 
      // this.getAllUploadedDocumentLms(this.operationId,this.loanApplicationId);
      //console.log("hello "+JSON.stringify(this.loanSelection));
      this.GetLaonGuarantors(this.loanSelection.loanApplicationId);
      this.check(this.loanSelection.productTypeId);
      this.getAllUploadedDocument();
      if (this.selectedloanReviewApplicationId == 0) {
        this.showForm3800B = false;
      }
      else {
        this.showForm3800B = true;

        // this.form3800b(this.selectedApplicationRefNumber);
      }

    });
  }
  //activeTabindex: number = 0;

  //   onTabChange(e) {
  //     this.activeTabindex = e.index;
  //     if (e.index == 0) { this.getDocumentationSections(true);}
  //     //if (e.index == 3) {this.getDocumentationSections(true); }

  // }

  getDocumentationSections(showLoadDocumentModal: boolean) {
    this.loadingService.show();
    this.subscriptions.add(
      this.camService.getDocumentSections(this.OPERATION_ID, this.selectedloanReviewApplicationId).subscribe((response: any) => {
        this.documentationSections = response.result;
        this.loadingService.hide();
        // if (this.documentationSections.length < 1) {
        //     this.getDocumentTemplate(showLoadDocumentModal);
        // }
      }, (err) => {
        this.loadingService.hide(1000);
      }));
  }
  closeDocumentation() {
    this.displayDocumentation = false;
    this.documentations = [];
  }
  previewDocumentation(print = false) {
    this.loadingService.show();
    this.camService.getDocumentation(this.OPERATION_ID, this.selectedloanReviewApplicationId).subscribe((response: any) => {
      this.documentations = response.result;
      this.loadingService.hide();
      if (print == false) this.displayDocumentation = true;
      else setTimeout(() => this.print(), 1000);
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }

  previewDocumentationLos(print = false) {
    this.loadingService.show();
    this.camService.getDocumentation(this.creditAppraisalOperationId, this.creditAppraisalLoanApplicationId).subscribe((response: any) => {
      this.documentations = response.result;
      this.loadingService.hide();
      if (print == false) this.displayDocumentation = true;
      else setTimeout(() => this.print(), 1000);
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }



  getAllUploadedDocumentLms(operationId, targetId) {
    this.loadingService.show();
    this.documentpUloadService.getAllUploadedDocumentLms(operationId, targetId).subscribe((response: any) => {
      this.supportingDocumentsLms = response.result;
      this.loadingService.hide();
    }, (error) => {
      this.loadingService.hide(1000);
    });
  }

  getAllUploadedDocument() {
    this.loadingService.show();
    let body = {
      loanApplicationId: this.loanApplicationId,
      operationId: this.operationId,
      loanReferenceNumber: this.applicationReferenceNumber,
    }

    this.documentpUloadService.getAllUploadedDocument(body).subscribe((response: any) => {
      this.supportingDocuments = response.result;
      this.loadingService.hide();
    }, (error) => {
      this.loadingService.hide(1000);
    });
  }

  print(): void {

    let printTitle = 'FACILITY APPROVAL MEMO No.:' + this.selectedApplicationRefNumber;
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

  GetLoanConvenant(loanId) {
    this.loanOperationService.getLoanConvenant(loanId)
      .subscribe(results => {
        if(results.result && Array.isArray(results.result))
        {this.convenatDetails = results.result;}
      });
    this.check(this.loanSelection.productTypeId);
  }
  GetLoanCollateral(loanId) {
    this.loanOperationService.getLoanCollateral(loanId)
      .subscribe(results => {
        this.collateralDetails = results.result;
      });
    this.check(this.loanSelection.productTypeId);
  }
  GetLoanChargeFee(loanId) {
    this.loanOperationService.getLoanChargeFee(loanId)
      .subscribe(results => {
        if(results.result && Array.isArray(results.result))
        {this.chargeFeeDetails = results.result;}
      });
    this.check(this.loanSelection.productTypeId);
  }

  GetLoanConvenantODF(loanId) {
    this.loanOperationService.getLoanConvenantODF(loanId)
      .subscribe(results => {
        if(results.result && Array.isArray(results.result))
        {this.convenatDetails = results.result;}
      });
    this.check(this.loanSelection.productTypeId);
  }
  GetLoanCollateralODF(loanId) {
    this.loanOperationService.getLoanCollateralODF(loanId)
      .subscribe(results => {
        this.collateralDetails = results.result;
      });
    this.check(this.loanSelection.productTypeId);
  }
  GetLoanChargeFeeODF(loanId) {
    this.loanOperationService.getLoanChargeFeeODF(loanId)
      .subscribe(results => {
        if(results.result && Array.isArray(results.result))
        {this.chargeFeeDetails = results.result;}
      });
    this.check(this.loanSelection.productTypeId);
  }
  GetLaonGuarantors(loanId) {
    // this.loanOperationService.getLoanGuarantors(loanId)
    //   .subscribe((results) => {
    //     this.guarantorDetails = results.result;
    //   });
    //   this.check(this.loanSelection.productTypeId);
  }
  GetLoanConvenantOD(loanId, loanType) {
    this.loanOperationService.getLoanConvenantOD(loanId, loanType)
      .subscribe(results => {
        if(results.result && Array.isArray(results.result))
        {this.convenatDetails = results.result;}
      });
    this.check(this.loanSelection.productTypeId);
  }


  GetLoanCollateralOD(loanId, loanType) {
    this.loanOperationService.getLoanCollateralOD(loanId, loanType)
      .subscribe(results => {
        this.collateralDetails = results.result;
      });
    this.check(this.loanSelection.productTypeId);
  }
  GetLoanChargeFeeOD(loanId, loanType) {
    this.loanOperationService.getLoanChargeFeeOD(loanId, loanType)
      .subscribe(results => {
        if(results.result && Array.isArray(results.result))
        {this.chargeFeeDetails = results.result;}
      });
    this.check(this.loanSelection.productTypeId);
  }
  GetLoanScheduleByLoanId(loanId) {
    this.loanOperationService.getLoanScheduleByLoanId(loanId)
      .subscribe(results => {
        if(results.result && Array.isArray(results.result))
        {this.loanScheduleDetails = results.result;}
      });
    this.check(this.loanSelection.productTypeId);
  }
  binaryFile: string;
  selectedDocument: string;
  displayDocument: boolean = false;
  myPdfFile: any;

  viewDocument(row) {
    this.loadingService.show();
    this.documentpUloadService.getUploadedDocument(row).subscribe((response: any) => {
      this.binaryFile = response.result.fileData;
      this.selectedDocument = response.result.documentTitle;
      this.displayDocument = true;
      this.loadingService.hide();
    }, (error) => {
      this.loadingService.hide(1000);
    });
  }
  viewPdfDocument(id: number) {
    let doc = this.supportingDocuments.find(x => x.documentId == id);
    if (doc != null) {
      this.displayPdf = true;
      this.fileUrl = 'https://cdn.rawgit.com/DenisVuyka/pdf-test-01/4b729e21/sample.pdf';
    };
  }

  viewExcelDocument(id: number) {
    let doc = this.supportingDocuments.find(x => x.documentId == id);
    if (doc != null) {
      this.pdfFile = doc.fileData;
      this.pdfFileName = doc.documentTitle;
      var byteString = atob(this.pdfFile);
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      var bb = new Blob([ab]);
      var file = new File([bb], this.pdfFileName + '.xlsx', { type: 'application/vnd.ms-excel' });
      // saveAs(file)
    }
  }


  DownloadDocument(id: number) {
    this.fileDocument = null;
    this.camService.getSupportingDocumentByDocumentId(id).subscribe((response: any) => {
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

}
