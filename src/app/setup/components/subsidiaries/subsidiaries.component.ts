import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../../shared/services/loading.service';
import { BranchService } from '../../services';
import { CountryStateService } from '../../services';
import { DataTableModule, SharedModule } from 'primeng/primeng';

@Component({
  selector: 'app-subsidiaries',
  templateUrl: './subsidiaries.component.html',
})


export class SubsidiariesComponent implements OnInit {
    //regions: any[];
    subsidiaries: any[];
    countries: any[];
    cities: any[];
    displayAddModal: boolean = false;
    entityName: string = 'Add New Subsidiary';
    addForm: FormGroup;
    show: boolean = false; message: any; title: any; cssClass: any; 
    loggedInUserBranch: string;
    loggedInUserCompany: string;
    selectedId: number = null;

    constructor(
        private loadingService: LoadingService,
        private fb: FormBuilder,
        private branchService: BranchService,
        private countryService: CountryStateService
    ) { }

    ngOnInit() {
        this.getAllSubsidiaries();
        this.getAllCountries();
        this.clearControls();
    }
    // getAllRegion() {
    //     this.branchService.getAllRegion().subscribe((res) => {
    //         this.regions = res.result;

    //         ////console.log('this.regions',this.regions);
    //     });
    // }
    getAllSubsidiaries(): void {
        this.loadingService.show();
        this.countryService.getSubsidiary().subscribe((response: any) => {
            this.subsidiaries = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    getAllCountries(): void {
        this.countryService.getAllCountries().subscribe((response: any) => {
            this.countries = response.result;
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    getStateCities(id): void {
        this.countryService.getCityByState(id).subscribe((response: any) => {
            this.cities = response.result;
            ////console.log('CITIES', response.result);
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    onChangeSelectedState(id) {
        this.getStateCities(id);
    }

    showAddModal() {
        this.clearControls();
        this.displayAddModal = true;
    }

    clearControls() {
        this.selectedId = null;
        this.entityName = 'Add New Subsidiary';
        this.addForm = this.fb.group({
            subsidiaryName: ['', Validators.required],
            countryId: ['', Validators.required],
            location: [''],
            urlLink: [''],
            isActive: [false]
        });
    }

    submitForm(form) {
        this.loadingService.show();
        let body = {
            subsidiaryName: form.value.subsidiaryName,
            countryId: form.value.countryId,
            location: form.value.location,
            urlLink: form.value.urlLink,
            isActive: form.value.isActive
        };
        if (this.selectedId === null) {
            this.countryService.addSubsidiary(body).subscribe((res) => {
                ////console.log('SAVE!');
                if (res.success == true) {
                    this.finishGood(res.message);
                    this.getAllSubsidiaries();
                    this.displayAddModal = false;
                    ////console.log('GOOD!', JSON.stringify(res.message));
                } else {
                    this.finishBad(res.message);
                    ////console.log('BAD!', JSON.stringify(res.message));
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
        } else {
            this.countryService.updateSubsidiary(body, this.selectedId).subscribe((res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                    this.getAllSubsidiaries();
                    this.displayAddModal = false;
                } else {
                    this.finishBad(res.message);
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
        }
    }

    editSubsidiary(row) {
        this.entityName = '';
        this.entityName = `Edit ${row.subsidiaryName}`;
        this.selectedId = row.subsidiaryId;

        this.addForm = this.fb.group({
            subsidiaryName: [row.subsidiaryName, Validators.required],
            countryId: [row.countryId, Validators.required],
            location: [row.location],
            urlLink: [row.urlLink],
            isActive: [row.isActive]
        });
        this.displayAddModal = true;
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