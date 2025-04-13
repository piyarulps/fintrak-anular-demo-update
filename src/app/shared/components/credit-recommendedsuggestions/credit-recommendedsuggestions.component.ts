import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../services/loading.service';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { ApprovalGroupRole, ApprovalStatus, RequestStatus, GlobalConfig } from '../../constant/app.constant';
import { LoanReviewApplicationService } from '../../../credit/services';
import { CreditAppraisalService } from '../../../credit/services/credit-appraisal.service';
import { ConditionPrecedentService } from '../../../setup/services';
import swal from 'sweetalert2';

@Component({
    templateUrl: 'credit-recommendedsuggestions.component.html',
    selector: 'app-credit-recommendedsuggestions',
    providers: [CreditAppraisalService, LoanReviewApplicationService, LoadingService]
})
export class CreditRecommendedSuggestionsComponent implements OnInit {

    @Input() panel: boolean = false;
    @Input() label: string = '';
    @Input() callerId: number = 1;
    @Input() applicationId: number;
    @Input() proposedItems: any[] = [];
    @Input() isAnalyst: boolean = false;

    @Input() operation: number = null;
    formState: string = 'New';
    conditions: any[] = [];
    selectedId: number = null;
    isSubsequent: boolean = false;

    complianceTimelines: any[] = [];

    @Input() set reload(value: number) { if (value == 0) this.reset(); }

    constructor(
        private fb: FormBuilder,
        private loadingService: LoadingService,
        private camService: CreditAppraisalService,
        private reviewService: LoanReviewApplicationService,
        private conditionService: ConditionPrecedentService,
    ) { }

    ngOnInit() {
        this.clearControls();
        this.loadDropdowns();
    }

    loadDropdowns() {
        this.conditionService.getAllComplianceTimeline().subscribe((response:any) => {
            this.complianceTimelines = response.result;
        });
    }

    clearControls() {
        this.formState = 'New';
        this.conditionForm = this.fb.group({
            loanApplicationDetailId: [this.selectedDetailId],
            condition: ['', Validators.required],
            timelineId: [''],
            isExternal: [false],
            isSubsequent: [false],
        });
    }

    // condition precedent

    conditionForm: FormGroup;
    displayConditionForm: boolean = false;
    lastSelectedApplicationId: number = 0;
    defaultConditions: any[] = [];

    onConditionsFacilityChange(detailId) {
        this.selectedDetailId = detailId;
        this.getConditionsPrecedent(detailId);
    }

    getConditionsPrecedent(detailId = this.selectedDetailId): void {

        if (detailId == null) return;

        if(this.operation!=null)
        {
        this.getDeaultConditionByOperation(detailId)
        }else{
            this.getDeaultCondition(detailId)
        }
        // if (this.applicationSelection.loanApplicationId != this.lastSelectedApplicationId) {
        
    }

    getDeaultConditionByOperation(detailId)
    {
        this.loadingService.show();
        this.camService.getDefaultConditionsPrecedentByOperation(this.callerId,detailId,this.operation).subscribe((response:any) => {
            this.defaultConditions = response.result;

            this.loadingService.hide();
            this.getLoanConditions(detailId);

            if(this.defaultConditions[0]==null) return;
            if(this.defaultConditions[0].isCheckListSpecific==true){
                //auto load ASP condition as default selected.
                this.saveAPSConditions();
            }

        }, (err) => {
            this.loadingService.hide(1000);
            ////console.log('cond error.. ', err);
        });
    }
    getDeaultCondition(detailId)
    {
        this.loadingService.show();
        this.camService.getDefaultConditionsPrecedent(this.callerId,detailId).subscribe((response:any) => {
            this.defaultConditions = response.result;

            this.loadingService.hide();
            this.getLoanConditions(detailId);

        }, (err) => {
            this.loadingService.hide(1000);
            ////console.log('cond error.. ', err);
        });
    }
    getLoanConditions(detailId = this.selectedDetailId) {
        this.loadingService.show();
        this.camService.getConditionsPrecedent(this.callerId, detailId).subscribe((response:any) => {

            
            
            ////console.log('loan condx.. ', JSON.stringify(response:any));
            this.conditions = response.result;
            this.loadingService.hide();
            this.preSelectConditions();
        }, (err) => {
            this.loadingService.hide(1000);
            ////console.log('cond error.. ', err);
        });
    }

    preSelectConditions() { 
        this.selectedConditions = [];
        const ids = this.conditions
            .filter(x => x.conditionId != null)
            .map(x => x.conditionId);
            if (ids.length != 0)
            this.selectedConditions = this.defaultConditions.filter(x => ids.indexOf(x.conditionId) != -1);
        //if (this.defaultConditions.length == 0)   ////console.log('defaultConditions -- NOT READY!!!!!!!!!!!!!');
       // this.selectedConditions = this.defaultConditions.filter(x => ids.indexOf(x.conditionId) != -1);


    }

    showConditionForm() {
        this.clearControls();
        this.formState = 'New';
        this.displayConditionForm = true;
        this.selectedId = null;
    }

    saveCondition(form) {
        let body = {
            condition: form.value.condition,
            timelineId: form.value.timelineId,
            isExternal: form.value.isExternal,
            isSubsequent: form.value.isSubsequent,
            loanApplicationDetailId: form.value.loanApplicationDetailId,
            loanApplicationId: this.applicationId,
        };
        ////console.log('...id', this.selectedId + ', body' + JSON.stringify(body));
        this.loadingService.show();
        if (this.selectedId === null) {
            this.camService.saveConditionPrecedent(this.callerId, body).subscribe((response:any) => {
                if (response.success == true) {
                    this.displayConditionForm = false;
                    this.loadingService.hide();
                    this.getConditionsPrecedent();
                    ////console.log('GOOD!', JSON.stringify(response.message));
                } else {
                    this.finishBad(response.message);
                    ////console.log('BAD!', JSON.stringify(response.error));
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
        } else {
            this.camService.editConditionPrecedent(this.callerId, body, this.selectedId).subscribe((response:any) => {
                if (response.success == true) {
                    this.displayConditionForm = false;
                    this.loadingService.hide();
                    this.getConditionsPrecedent();
                    ////console.log('GOOD!', JSON.stringify(response.message));
                } else {
                    this.finishBad(response.message);
                    ////console.log('BAD!', JSON.stringify(response.error));
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
        }
    }

    editCondition(row, addedit = false) {
        ////console.log('row..', row);
        if (addedit == true) {
            this.formState = 'Edit & Add';
            this.selectedId = null;
            this.conditionForm = this.fb.group({
                loanApplicationDetailId: [this.selectedDetailId],
                condition: [row.condition, Validators.required],
                timelineId: [row.timelineId],
                isExternal: [row.isExternal],
                isSubsequent: [row.isSubsequent]
            });
            this.displayConditionForm = true;
            return;
        }
        this.formState = 'Edit';
        this.selectedId = row.loanConditionId;
        this.conditionForm = this.fb.group({
            loanApplicationDetailId: [this.selectedDetailId],
            condition: [row.condition, Validators.required],
            timelineId: [row.timelineId],
            isExternal: [row.isExternal],
            isSubsequent: [row.isSubsequent]
        });
        this.displayConditionForm = true;
    }

    onSubsequentChange(checked: boolean) {
        this.isSubsequent = checked;
        if (checked == false) this.conditionForm.controls['timelineId'].setValue('');
    }

    removeCondition(id) {
        const __this = this;
        swal({
            title: 'Remove Condition ' + id + '?',
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
            __this.camService.removeConditionPrecedent(__this.callerId,id).subscribe((response:any) => {
                if (response.success === true) {
                    swal(GlobalConfig.APPLICATION_NAME, 'Condition Removed.', 'success');
                    __this.displayConditionForm = false;
                    __this.loadingService.hide();
                    __this.getConditionsPrecedent();
                    __this.finishGood();
                } else {
                    swal(GlobalConfig.APPLICATION_NAME, response.message, 'error');
                }
            }, (err: any) => {
                __this.finishBad(JSON.stringify(err));
            });
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(GlobalConfig.APPLICATION_NAME, 'Operation cancelled', 'error');
            }
        });
    }

    // new

    selectedConditions: any[];
    unsavedConditions = false;
    selectedDetailId: number = null;

    onSelectedCondition(e) {
        this.unsavedConditions = true;
    }

    removeSelectedCondition(e) {
        this.unsavedConditions = true;
    }

    onSelectedAllCondition(e) {
        this.unsavedConditions = true;
    }


    saveAPSConditions(){
        let body = {
            id: this.applicationId,
            selectedIds: this.defaultConditions.map(x => x.conditionId),
            detailId: this.selectedDetailId,
        };

       // console.log('body',body);
        
        this.camService.saveSelectConditionsChanges(this.callerId, body).subscribe((response:any) => {
            if (response.success == true) {
                this.conditions = response.result; // get only loancd
            } else {
                this.finishBad(response.message);
                ////console.log('BAD!', JSON.stringify(response.error));
            }
        }, (err: any) => {
            this.finishBad(JSON.stringify(err));
        });
    }

    saveSelectConditionsChanges() {
        let body = {
            id: this.applicationId,
            selectedIds: this.selectedConditions.map(x => x.conditionId),
            detailId: this.selectedDetailId,
        };
        this.loadingService.show();
        this.camService.saveSelectConditionsChanges(this.callerId, body).subscribe((response:any) => {
            if (response.success == true) {
                this.unsavedConditions = false;
                this.loadingService.hide();
                this.conditions = response.result; // get only loancd
                ////console.log('GOOD!', JSON.stringify(response.message));
            } else {
                this.finishBad(response.message);
                ////console.log('BAD!', JSON.stringify(response.error));
            }
        }, (err: any) => {
            this.finishBad(JSON.stringify(err));
        });
    }

    reset() {
        this.selectedConditions = [];
        this.unsavedConditions = false;
        this.selectedDetailId = null;
        this.displayConditionForm = false;
        this.lastSelectedApplicationId = 0;
        this.defaultConditions = [];
        this.conditions = [];
        this.selectedId = null;
        this.isSubsequent = false;
    }

    // ---------------------- message ----------------------

    show: boolean = false; message: any; title: any; cssClass: any; // message box

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }

    finishGood() {
        this.loadingService.hide();
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


}