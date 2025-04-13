import { CountryStateService } from '../../services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../../shared/services/loading.service';
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { GlobalConfig } from '../../../shared/constant/app.constant';
import { DashboardService } from 'app/dashboard/dashboard.service';

@Component({
    selector: 'app-state',
    templateUrl: './state.component.html',
})
export class StateComponent implements OnInit {
    
    states: any[];
    statesForm: FormGroup;
    selectedId: number = null;
    displayStateChargeModal: boolean = false;
    show: boolean = false; message: any; title: any; cssClass: any;
    currCode: any;
    regionName: string;
    panelHeader: any;
    countries: any;


    constructor(private loadingService: LoadingService, private fb: FormBuilder,
        private dashboard: DashboardService,
        private countryStateSrv: CountryStateService) { }

    ngOnInit() {
        this.refresh();
        this.clearControls();
        this.getState();
        this.getCountryCurrency();
        this.getCountries();
    }

    showAddModal() {
        this.panelHeader = 'New';
        this.clearControls();
        this.displayStateChargeModal = true;
    }

    refresh(): void {
        this.loadingService.show();
        this.countryStateSrv.getStates().subscribe((response:any) => {
            this.states = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });        
    }

    getStates() {
        this.countryStateSrv.getStatesByCompanyId()
            .subscribe((response:any) => {
                this.states = response.result;
            });
    }

    getState() {
        this.loadingService.show();
        this.countryStateSrv.getStates().subscribe((response:any) => {
            this.loadingService.hide();
            this.states = response.result;
            ////console.log('cities',this.cities);

        }, (err) => {
            this.loadingService.hide();
        });
    }

    getCountries(){
        this.loadingService.show();
        this.countryStateSrv.getAllCountries().subscribe((response:any) => {
            this.loadingService.hide();
            this.countries = response.result;
        }, (err) => {
            this.loadingService.hide();
        });
    }

    getCountryCurrency() {
        this.dashboard.getCountryCurrency()
            .subscribe(response => {
                this.currCode = response.result;  
                if(this.currCode.countryCode == 'GHS'){
                    this.regionName = 'Region';
                }
                else{
                    this.regionName = 'State';
                }
                });
    }
    
    editState(index, evt) {
        this.panelHeader = 'Edit';
        evt.preventDefault();

        let row = index;
        this.selectedId = row.stateId;
        ////console.log('selected', this.selectedId);

        this.statesForm = this.fb.group({
            stateId: [row.stateId],
            countryId: [row.countryId],
            stateName: [row.stateName],
            countryName: [row.countryName],
            collateralSearchChargeAmount: [row.collateralSearchChargeAmount],
            chartingAmount: [row.chartingAmount],
            verificationAmount: [row.verificationAmount],
        });
        this.displayStateChargeModal = true;
    }
    
    // submitForm(formObj) {
    //     this.loadingService.show();
    //     const bodyObj = formObj.value;
    //     if (this.selectedId > 0) {
    //         this.countryStateSrv.updateStates(this.selectedId, bodyObj).subscribe((res) => {
    //             if (res.success === true) {
    //                 this.selectedId = null;
    //                 this.finishGood(res.message);
    //                 this.getStates();
    //                 this.displayStateChargeModal = false;
    //             } else {
    //                 this.finishBad(res.message);
    //             }
    //         }, (err: any) => {
    //             this.finishBad(JSON.stringify(err));
    //         });
    //     }
    // }
    submitForm(form) {
        this.loadingService.show();
        let body = {
            stateName: form.value.stateName,
            countryId: form.value.countryId,
            countryName: form.value.countryName,
            collateralSearchChargeAmount: form.value.collateralSearchChargeAmount,
            chartingAmount: form.value.chartingAmount, 
            verificationAmount: form.value.verificationAmount,
        };
        if (this.selectedId === null) {

            this.countryStateSrv.addStates(body).subscribe((res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                    this.getState();
                    this.displayStateChargeModal = false;
                    ////console.log('GOOD!',JSON.stringify(res.message));
                } else {
                    this.finishBad(res.message);
                    ////console.log('BAD!',JSON.stringify(res.message));
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
        } else {
            ////console.log('this.selectedId...', this.selectedId+' - '+body);

            this.countryStateSrv.updateStates(body, this.selectedId).subscribe((res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                    //this.getStates();
                    this.getState();
                    this.displayStateChargeModal = false;
                } else {
                    this.finishBad(res.message);
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
        }
    }


    clearControls() {
        this.selectedId = null;
        this.statesForm = this.fb.group({
            stateId: [0, Validators.required],
            countryId: ['', Validators.required],
            stateName: ['', Validators.required],
            countryName: [''],
            collateralSearchChargeAmount: ['', Validators.required],
            chartingAmount: ['', Validators.required],
            verificationAmount: ['', Validators.required]
        });
    }

    finishBad(message) {
        swal(`${GlobalConfig.APPLICATION_NAME}`, message, 'error');
        this.loadingService.hide();
    }

    finishGood(message) {
        this.clearControls();
        this.loadingService.hide();
        swal(`${GlobalConfig.APPLICATION_NAME}`, message, 'success');
    }

    hideMessage(event) {
        this.show = false;
    }

    deleteState(row) {
        const __this = this;
        swal({
            title: 'Delete State?',
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
    
            __this.countryStateSrv.deleteState(row.stateId).subscribe((res) => {
                    if (res.success == true) {
                      __this.finishGood(res.message);  
                       __this.refresh();
                       //__this.states = __this.states.filter(state => state.stateId !== row.stateId);
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
}
