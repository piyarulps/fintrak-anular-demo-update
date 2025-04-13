import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../services/loading.service';
import { RiskAcceptanceCriteriaService } from '../../services/risk-acceptance-criteria.service'; // TODO: modify path!
import swal from 'sweetalert2';

@Component({
    templateUrl: 'risk-acceptance-criteria.component.html',
    selector: 'risk-acceptance-criteria',
    providers: [RiskAcceptanceCriteriaService, LoadingService] 
})
export class RiskAcceptanceCriteriaComponent implements OnInit {

    // ------------------- declarations -----------------

    @Input() operationId: number; // REQUIRED
    @Input() targetId: number; // REQUIRED for updates & readonly

    @Input() approvalLevelId: number;
    
    @Input() targetReferenceNumber: any;
        
    @Input() roleId: number;

    @Input() loanApplicationId;


    customerId:number;
    @Input() set racCustomerId(value: number) { 
        this.customerId = value;
        if (value > 0) this.getRiskAcceptanceCriteria(value); 
    }

    @Input() isDrawdown;

    @Input() readonly: boolean = false;
    @Input() checklistStatus: number = 0;

    @Input() panel: boolean = false;
    @Input() label: string = '';

    @Input() racCategoryTypeId: any;

    @Output() formOutput: EventEmitter<any> = new EventEmitter<any>();

    @Input() set productId(value: number) { 
        if (value > 0) this.getRiskAcceptanceCriteria(value); 
    }

    operationSpecific:boolean;
    @Input() set isOperationbased(value) {  
        if (value) { 
        this.operationSpecific = value;
            this.getRiskAcceptanceCriteria(this.selectedProductId);
        } else {
            this.rac = null;
            this.racForm = new FormGroup({});
        }
    }

    @Input() set reload(value: number) {
            //this.getRiskAcceptanceCriteria(value); 
    }


    @Input() set getFormOutput(value) {
        if (value > 0) {
            if (this.racForm == null) {
                this.formOutput.emit({
                    operationId: this.operationId,
                    targetId: this.targetId,
                    checklistStatus: this.checklistStatus,
                    productId: this.selectedProductId,
                    productClassId: this.productClassId,
                    customerId : this.customerId 
                }); 
                return;
            }
            let form = this.racForm.value;
            this.formOutput.emit({
                form: Object.keys(form).map(key => { return { criteriaId: key, value: form[key] } }),
                operationId: this.operationId,
                targetId: this.targetId,
                checklistStatus: this.checklistStatus,
                productId: this.selectedProductId,
                productClassId: this.productClassId,
                customerId : this.customerId 
            });
        }
    } 
   
    selectedCurrencyId:any
    @Input() set racCurrencyId(value) {  
        if (value > 0 && value != null) { 
            this.selectedCurrencyId = value;
            this.getRiskAcceptanceCriteria(this.selectedProductId);
        }
    } 

    

    // searchBaseId:any
    // @Input() set racSearchBaseId(value) {  
    //     if (value > 0 && value != 0) {
    //         this.searchBaseId = value;
    //         this.getRiskAcceptanceCriteria(this.selectedProductId);
    //     } else this.searchBaseId = null;
    // } 

    selectedCurrencyType:any;
    @Input() set currencyType(value) { 
        if (value != null ) {
            this.selectedCurrencyType = value;
            this.getRiskAcceptanceCriteria(this.selectedProductId);
        }
    } 

    selectedRacOperationId:any;
    @Input() set racOperationId(value) { 
        if (value != null && value != 0) {
            this.selectedRacOperationId = this.operationId =  value;
            this.getRiskAcceptanceCriteria(this.selectedProductId);
        } else {
            this.rac = null;
            this.racForm = new FormGroup({});
        }
    } 

    productClassId:any;
    @Input() set racProductClassId(value) { //console.log('p - class', value);
        if (value != null && value != 0) {
            this.productClassId = value;
            this.getRiskAcceptanceCriteria(this.selectedProductId);
        }
    }

    placeholder:any;
    @Input() set searchBasePlaceholder(value) {  //console.log('p - searchBasePlaceholder', value);
        if (value != null) { 
            this.placeholder = value;
            this.getRiskAcceptanceCriteria(this.selectedProductId);
           
        }
    }
    
    selectedProductId: number = null;
    riskAcceptanceCriterias: any[] = [];
    displayRiskAcceptanceCriteriaForm: boolean = false;

    racForm: FormGroup;
    categoriesCount: number = 0;

    // input types 1. text, 2. numeric, 3.select, 4. radio

    fakerac = {
        count: 2,//[{ criteriaId: 2, staffId: 2, remark: '' }],
        categories: [
            {
                name: 'PRICIPAL RAC',
                rows: [ //criterias
                    {
                        id: 13,//criteriaId
                        criteria: 'Overall Debt Service Ratio',
                        required: '33.33% of basic monthly income',
                        hasException: true,
                        label: '',
                        name: 'overall debt service',
                        value: '',
                        type: 'text',
                        typeId: 1,
                        optionId: null,
                        options: null,
                        status: 2,
                        fileUpload: false,
                    },
                    {
                        id: 34,
                        criteria: 'Overall Debt Service Ratio',
                        required: '33.33% of basic monthly income',
                        label: '',
                        hasException: false,
                        name: 'basic monthly income',
                        value: '',
                        typeId: 2,
                        type: 'text',
                        optionId: null,
                        options: null,
                        status: 3,
                        fileUpload: true,
                    },
                ]
            },
            {
                name: 'OBLIGOR RAC',
                rows: [
                    {
                        id: 64,
                        criteria: 'Line ED’s approval ',
                        required: 'yes',
                        label: '',
                        hasException: false,
                        name: 'lineapproval',
                        value: '',
                        typeId: 3,
                        type: 'select',
                        optionId: 1,
                        options: [
                            { key: 1, label: 'Yes' },
                            { key: 2, label: 'No' },
                        ],
                        status: 3,
                        fileUpload: true,
                    },

                    {
                        id: 76,
                        criteria: 'Line ED’s approval ',
                        required: 'yes',
                        label: '',
                        hasException: false,
                        name: 'line-approval-radio',
                        value: '',
                        typeId: 4,
                        type: 'radio',
                        optionId: 1,
                        options: [
                            { key: 1, label: 'Yes' },
                            { key: 2, label: 'No' },
                        ],
                        status: 3,
                        fileUpload: true,
                    },
                ]
            }
        ], // CATEGORIES

    };

    rac: any = null;

    // ---------------------- init ----------------------
 
    constructor(
        private fb: FormBuilder,
        private loadingService: LoadingService,
        private racService: RiskAcceptanceCriteriaService,
    ) { }

    ngOnInit() {
        this.clearControls();
        //this.getRiskAcceptanceCriterias();
        //this.initializeDynamicForm();
        
    }

    getCriteriaComments() {
        // this._SERVICE_INJECTION_.getCriteriaComments().subscribe((response:any) => {
        //     this.CriteriaComments = response.result;
        // });
    }

    saveCriteriaComment(form) {
        let body = {
            comment: form.value.comment,
        };
        this.displayCriteriaCommentForm = false
    }

    criteriaComments: any[] = [];
    criteriaCommentForm: FormGroup;
    displayCriteriaCommentForm: boolean = false;
    displayCriteriaUploadsForm: boolean = false;

    showComments(id) {
        this.displayCriteriaCommentForm = true;
    }

    showUploads(id) {
        this.displayCriteriaUploadsForm = true;
    }

    initializeDynamicForm() {
        if (this.rac == null || this.rac == {} || this.rac == undefined) return;
        this.categoriesCount = this.rac.count;
        let formControls = {}; 

        for (let c of this.rac.categories) {
            for (let f of c.rows) {
                formControls[f.id] = f.hasException ? new FormControl(f.value) : new FormControl(f.value, Validators.required);
            }
        }
        this.racForm = this.fb.group(formControls);
    }

    // ------------------- api-calls --------------------
    getRiskAcceptanceCriteria(productId) {
        this.rac = {};
        this.selectedProductId = productId;
        if (this.targetId == null) {
            let data = {
                productId: productId,
                productClassId: this.productClassId,
                racCategoryTypeId: this.racCategoryTypeId,
                currencyId:   this.selectedCurrencyId ,
                currencyType: this.selectedCurrencyType,
                operationId: this.selectedRacOperationId,
                searchBasePlaceholder: this.placeholder,
                customerId:this.customerId,
                isOperationbased:this.operationSpecific,
                isDrawdown: this.isDrawdown
            }; 
           
            this.racService.getRiskAcceptanceCriteria(data).subscribe((response:any) => {
                // response.result = this.fakerac; // fake mocking
                this.rac = response.result;
                this.initializeDynamicForm();
            });
        } else {

            this.racService.getRiskAcceptanceCriteriaUpdate(productId, this.targetId).subscribe((response:any) => {
                this.rac = response.result;
                this.initializeDynamicForm();
            });
        }
        //console.log('rac', this.rac);
    }

    // deleteRiskAcceptanceCriteria(row) {
    //     this.racService.deleteRiskAcceptanceCriteria(row.riskAcceptanceCriteriaId).subscribe((response:any) => {
    //         if (response.result == true) this.reloadGrid();
    //     });
    // }

    // reloadGrid() {
    //     this.displayRiskAcceptanceCriteriaForm = false;
    //     this.getRiskAcceptanceCriterias(this.productId);
    // }

    // ---------------------- form ----------------------

    clearControls() {

        this.criteriaCommentForm = this.fb.group({
            comment: ['', Validators.required],
        });
    }


    // ---------------------- message ----------------------

    show: boolean = false; message: any; title: any; cssClass: any;

    finishGood() { this.loadingService.hide(); }

    hideMessage(event) { this.show = false; }

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }

    showMessage(message: string, cssClass: string, title: string) {
        this.message = message;
        this.title = title;
        this.cssClass = cssClass;
        this.show = true;
    }
}
