import { Component, OnInit } from '@angular/core';

import { CountryStateService } from '../../services';
import { LoadingService } from '../../../shared/services/loading.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { City } from '../../models/city';
import { DashboardService } from 'app/dashboard/dashboard.service';

@Component({
    templateUrl: 'city.component.html'
})

export class CityComponent implements OnInit {
    showCityClass: boolean;
    lgaCities: any;
    localGovtList: any;
    localGovt: any;
    display: boolean = false;
    cityForm: FormGroup;
    states: any[];
    show: boolean = false;
    message: any;
    title: any;
    cssClass: any;
    cities: any[];
    cityClasses: any[];
    panelHeader = 'New City';
    currCode: any;
    regionName: string;
    subRegionName: string;
    smallerSubRegionName: string;

    constructor(
        private loadingService: LoadingService,
        private fb: FormBuilder,
        private countryStateSrv: CountryStateService,
        private dashboard: DashboardService
    ) { }

    ngOnInit() {
        this.getStates();
        this.getCityClasses();
        this.clearControls();
        this.getLocalGovt();
        this.getCities();
        this.getCountryCurrency();
    }

    clearControls() {

        this.cityForm = this.fb.group({
            cityId: [0, Validators.required],
            cityName: ['', Validators.required],
            stateId: ['', Validators.required],
            cityClassId: [''],
            allowedForCollateral: [false, Validators.required],
            localGovernmentId: ['', Validators.required],

        });
        this.showCityClass = false;
    }

    getCountryCurrency() {
        this.dashboard.getCountryCurrency()
            .subscribe(response => {
                this.currCode = response.result;  
                if(this.currCode.countryCode == 'GHS'){
                    this.regionName = 'Region';
                    this.subRegionName = 'Region Capital';
                    this.smallerSubRegionName = 'District (MMDA)'
                }
                else{
                    this.regionName = 'State';
                    this.subRegionName = 'Local Govt. Area';
                    this.smallerSubRegionName = 'City' 
                }
                });
    }

    getCities() {
        this.loadingService.show();
        this.countryStateSrv.getAllCities().subscribe((response:any) => {
            this.loadingService.hide();
            this.cities = response.result;
            ////console.log('cities',this.cities);

        }, (err) => {
            this.loadingService.hide();
        });
    }

    getLocalGovt() {
        this.loadingService.show();
        this.countryStateSrv.getAllLocalGovt().subscribe((response:any) => {
            this.loadingService.hide();
            this.localGovt = response.result;
            ////console.log('this.localGovt',this.localGovt);

        }, (err) => {
            this.loadingService.hide();
        });
    }
    getLocalGovtById(vrb): void {
        // this.localGovtList =  this.localGovt.find(x=>x.stateId===vrb)
        this.countryStateSrv.getAllLocalGovtById(vrb).subscribe((response:any) => {
            this.localGovt = response.result;
            ////console.log('this.localGovt',this.localGovt);

        }, (err) => {
        });

        //   ////console.log('this.localGovtList',this.localGovtList);
    }
    getStates() {
        this.countryStateSrv.getStates().subscribe((response:any) => {
            this.states = response.result;
        });
    }

    getCityClasses() {
        this.countryStateSrv.getAllCityClass().subscribe((response:any) => {
            this.cityClasses = response.result;
        });
    }
    getCity(lgaId) {
        this.countryStateSrv.getCityClass(lgaId).subscribe((response:any) => {
            this.lgaCities = response.result;
            
        });
    }

    ShowCityClass(e){

        let citiType = this.cityForm.get('cityClassId');
    
        if(e.target.checked){

        this.showCityClass = true;
        citiType.setValidators(Validators.required);
        }else{
            this.showCityClass = false;
            citiType.clearValidators();
        }
    }

    showCityForm() {
        this.panelHeader = 'New';
        this.clearControls();
        this.display = true;
        this.selectedId = null;
    }

    editState(citi) {
        this.panelHeader = 'Edit';
        this.display = true;
        let row = citi;
        ////console.log('citi',citi);

        this.cityForm = this.fb.group({
            cityId: [row.cityId],
            cityName: [row.cityName],
            stateId: [row.stateId],
            cityClassId: [row.cityClassId],
            allowedForCollateral: [row.allowedForCollateral],
            localGovernmentId: [row.localGovernmentId],

        });
        this.selectedId = row.cityId;
        this.getLocalGovtById(row.stateId);
    }

    selectedId: number = null;

    submitForm(form) {
        this.loadingService.show();
        let body = {
            cityName: form.value.cityName,
            stateId: form.value.stateId,
            cityClassId: form.value.cityClassId,
            allowedForCollateral: form.value.allowedForCollateral,
            localGovernmentId: form.value.localGovernmentId,
        };
        if (this.selectedId === null) {

            this.countryStateSrv.addCity(body).subscribe((res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                    this.getCities();
                    this.display = false;
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

            this.countryStateSrv.updateCity(body, this.selectedId).subscribe((res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                    this.getCities();
                    this.display = false;
                } else {
                    this.finishBad(res.message);
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
        }
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
}
