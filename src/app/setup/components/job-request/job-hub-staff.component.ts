import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'app/shared/services/loading.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CustomerService } from 'app/customer/services/customer.service';
import { RequestJobTypeService, StaffRealTimeSearchService } from 'app/setup/services';
import { Subject } from 'rxjs';
import swal from 'sweetalert2';

@Component({
    templateUrl: 'job-hub-staff.component.html'
})
export class JobHubStaffComponent implements OnInit {
    customerRelationshipTypes: any[];
    displayJobHubStaffForm: boolean = false;
    entityName: string = 'New Customer Relationship Type';
    entity: string = 'Add Job Hub Staff';
    jobJobTypeHubStaffForm: FormGroup;
    show: boolean = false; message: any; title: any; cssClass: any; // message box
    selectedId: number = 0;
    jobTypeList: any;
    jobTypeHubStaffList: any;
    displaySearchModal: boolean;
    levelStaffForm: any;
    searchResults: Object;
    searchTerm$ = new Subject<any>();
    searchedName: any;
    isTeamLead: boolean;
    jobTypeUnitList: any;
    jobTypeHub: any;
    hubStaffId: number;
    selectedStaffId: number;
    jobTypeId: number;
    jobTypeHubId: number;
    jobTypeUnitId: number;
    isUpdate = false;


    constructor(private loadingService: LoadingService, 
        private fb: FormBuilder, 
        private customerService: CustomerService,
        private realSearchSrv: StaffRealTimeSearchService,
        private requestJobTypeService: RequestJobTypeService) {
            this.realSearchSrv.search(this.searchTerm$).subscribe(results => {
                if (results != null) {
                    this.searchResults = results.result;
                }
            });
         }

    ngOnInit() {
        this.displayJobHubStaffForm = false;
        this.getJobType();
        this.getJobType();
        this.getJobTypeHubStaff();
        this.clearForm();
        this.clearControls();
    }

    getJobType() {
        this.loadingService.show();
        this.requestJobTypeService.getJobTypes().subscribe((response:any) => {
            this.loadingService.hide();
            this.jobTypeList = response.result;
        }, (err) => {
            this.loadingService.hide();
        });
    }

    getJobtypeUnitByJobTypeId(id){
        this.requestJobTypeService.getJobDestinationUnits(id).subscribe((response:any) => {
            this.jobTypeUnitList = response.result;
        }, (err) => {
        });

        this.getHubByJobTypeId(id);
    }

    getHubByJobTypeId(id){
        this.requestJobTypeService.getJobTypeHub(id).subscribe((response:any) => {
            this.jobTypeHub = response.result;
        }, (err) => {
        });
    }

    getJobTypeHubStaff() { 
      this.requestJobTypeService.getJobTypeHubStaff().subscribe((response:any) => {
          this.jobTypeHubStaffList = response.result;
      }, (err) => {
          this.loadingService.hide();
      });
    }

    showDialog() {
        this.hubStaffId = 0;
        this.selectedStaffId = 0;
        this.isUpdate = false;
        this.displayJobHubStaffForm = true; 
        this.entity = 'Add Job Hub Staff';
        this.clearControls();
       }

    clearControls() {
        this.jobJobTypeHubStaffForm = this.fb.group({
            jobTypeId: ['', Validators.required],
            staffId: ['', Validators.required],
            jobTypeUnitId: ['', Validators.required],
            hubId: ['', Validators.required],
            isTeamLead :[''],
            searchedName: [''],
        });
    }

    

    setTeamPosition(e){
        if(e){this.isTeamLead = true;}
        else {this.isTeamLead = false;}
    }

    submitForm(form) {
        let body = {
          jobTypeId: form.value.jobTypeId,
          staffId: form.value.staffId,
          jobTypeHubId: form.value.hubId,
          jobTypeUnitId: form.value.jobTypeUnitId,
          isTeamLead : this.isTeamLead,
          hubStaffId : this.hubStaffId
        };

        if(this.hubStaffId <= 0 || this.hubStaffId == undefined)
        {
            this.loadingService.show();
            this.requestJobTypeService.mapJobTypeHubStaff(body).subscribe((res) => {
                if (res.success == true) {
                    this.getJobTypeHubStaff();
                    swal('Fintrak Credit 360', res.message,'success');
                    this.clearForm();
                    this.loadingService.hide();
                } else {
                    swal('Fintrak Credit 360', res.message,'warning');
                    this.loadingService.hide();
                }
            }, (err: any) => {
                swal('Fintrak Credit 360', JSON.stringify(err),'error');
                this.loadingService.hide();
            });
        }
        else
        {
            if(this.hubStaffId <= 0) {swal('FIntrak Credit 360','No record has been selected'); return;}
            this.loadingService.show();
            this.requestJobTypeService.updateMappedJobTypeHubStaff(body).subscribe((res) => {
                if (res.success == true) {
                    this.getJobTypeHubStaff();
                    swal('Fintrak Credit 360', res.message,'success');
                    this.clearForm();
                    this.loadingService.hide();
                } else {
                    swal('Fintrak Credit 360', res.message,'warning');
                    this.loadingService.hide();
                }
            }, (err: any) => {
                swal('Fintrak Credit 360', JSON.stringify(err),'error');
                this.loadingService.hide();
            });
        }
    }

    clearForm(){
        this.displayJobHubStaffForm = false;
        this.clearControls();
    }

    deleteMappedJobTypeHubStaff(row){
         this.requestJobTypeService.deleteMappedJobTypeHubStaff(row.hubStaffId).subscribe((res) => {
            if (res.success == true) {
                swal('Fintrak Credit 360', res.message,'success');
                this.getJobTypeHubStaff();
                this.loadingService.hide();
            } else {
                swal('Fintrak Credit 360', res.message,'warning');
                this.loadingService.hide();
            }
        }, (err: any) => {
            swal('Fintrak Credit 360', JSON.stringify(err),'error');
            this.loadingService.hide();
        });
    }

    editJobTypeHubStaff(row) {
        this.getJobtypeUnitByJobTypeId(row.jobTypeId);
        this.entity = 'Edit Job Hub Staff';
        this.displayJobHubStaffForm = true;
        this.isUpdate = true;
        this.searchedName = null;
        //JSON.stringify(row);
        this.hubStaffId = row.hubStaffId;
        this.jobJobTypeHubStaffForm = this.fb.group({
            jobTypeId: [row.jobTypeId, Validators.required],
            staffId: [row.staffId, Validators.required],
            jobTypeUnitId: [row.jobTypeUnitId, Validators.required],
            hubId: [row.jobTypeHubId, Validators.required],
            searchedName: [row.staffName],
            isTeamLead :[row.isTeamLead],
        });
    }

    openSearchBox(): void {
        this.displaySearchModal = true;
    }

    pickSearchedData(data) {
        this.searchedName = data.fullName;
        this.jobJobTypeHubStaffForm.controls['staffId'].setValue(data.staffId);
        this.selectedStaffId = data.staffId;
        this.displaySearchModal = false;
    }

    searchDB(searchString) {
        searchString.preventDefault;
        this.searchTerm$.next(searchString);
    }

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }

    finishGood(message) {
        this.displayJobHubStaffForm = false;
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