import { AdminService } from '../../services/admin.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { GlobalConfig } from 'app/shared/constant/app.constant';

@Component({
    templateUrl: 'group.component.html'
})

export class GroupComponent implements OnInit {
    display: boolean = false;
    show: boolean = false;
    message: any;
    title: any;
    cssClass: any;
    groups: any[];
    groupName: string;
    groupId: number;
    isUpdateAction: boolean = false;

    constructor(private loadingSrv: LoadingService,
        private adminService: AdminService,
        private loadingService: LoadingService,) {

    }

    ngOnInit() {
        this.getGroups();
    }

    getGroups() {
        this.loadingSrv.show();
        this.adminService.getAllGroups().subscribe((res) => {
            this.groups = res.result;
            this.loadingSrv.hide();
        }, (err) => {
            this.loadingSrv.hide();
        });
    }


    onSubmit() {
        this.loadingSrv.show();

        if (this.isUpdateAction == false) {

            let body = {
                groupId: 0,
                groupName: this.groupName,
                createdBy: 0
            }
            this.adminService.saveGroup(body)
                .subscribe((res) => {

                    this.loadingSrv.hide();
                    if (res.success == true) {
                        this.getGroups();
                        this.groupName = '';
                        this.display = false;
                        this.showMessage(res.message, "success", "Fintrak Banking");
                    } else {

                        this.showMessage(res.message, "error", "Fintrak Banking");
                    }
                }, (err) => {
                    this.loadingSrv.hide();
                    this.showMessage("An error has occured", "error", "Fintrak Banking");
                });


        } else {

            let body = {
                groupId: this.groupId,
                groupName: this.groupName,
                createdBy: 0
            }

            this.adminService.updateGroup(this.groupId, body)
                .subscribe((res) => {
                    if (res.success == true) {
                        this.getGroups();
                        this.groupName = '';
                        this.loadingSrv.hide();
                        this.display = false;
                        this.showMessage(res.message, "success", "Fintrak Banking");
                    } else {
                        this.loadingSrv.hide();
                        this.showMessage(res.message, "error", "Fintrak Banking");
                    }
                }, (err) => {
                    this.loadingSrv.hide();
                    this.showMessage("An error has occured", "error", "Fintrak Banking");
                });

        }



    }

    editGroup(index) {
        var grp = this.groups[index];
        this.groupId = grp.groupId;
        this.groupName = grp.groupName;
        this.isUpdateAction = true;
        this.display = true;
    }

    confirmDelete(row) { //NOTE: DELETING WORKFLOW GROUP IS NOT RECOMMENDED - AUSTIN
        const __this = this;
        var id = row.groupId; console.log(row.groupId);
        swal({
            title: 'Are you sure?',
            text: 'Are you sure You want to delete this group. You will not be able to undo once comitted.',
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
            __this.deleteGroup(id);
            __this.loadingService.hide(1000);
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    }


    deleteGroup(id) { //NOTE: DELETING WORKFLOW GROUP IS NOT RECOMMENDED - AUSTIN
        this.adminService.deleteGroup(id).subscribe((res: any) => {
            if (res.success == true) {
                swal('Fintrak Credit 360', res.message, 'success');
                this.getGroups();
                this.groups.slice;
            } else {
                swal('Fintrak Credit 360', res.message, 'error');
            }
        }, (error) => {
            this.loadingService.hide();
            swal('Fintrak Credit 360', JSON.stringify(error) ? JSON.stringify(error) : 'Error occured', 'error')
        });
    }

    showDialog() {
        this.isUpdateAction = false;
        this.groupName = null;
        this.display = true;
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