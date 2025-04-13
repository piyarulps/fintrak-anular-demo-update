
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {switchMap, distinctUntilChanged, debounceTime, catchError, map} from 'rxjs/operators';
import { AuthHttp } from './token.service';
import { Injectable } from '@angular/core';


import { AppConfigService } from '../../shared/services/app.config.service';

let AppConstant: any = {};

@Injectable()
export class AdminService {

  
    constructor(private http: AuthHttp, appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }

    ///User Methods
    GetProfileConfiguration(): any {
        return this.http.get(`${AppConstant.API_BASE}admin/getprofileconfiguration`).pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getStaffADDetails(staffCode, password): any {
        return this.http.get(`${AppConstant.API_BASE}admin/getStaffactiveDirectoryDetails/${staffCode}/${password}`).pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getProfileSettings() {
        return this.http.get(`${AppConstant.API_BASE}admin/profilesettings`).pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAPILog(data) {
        return this.http.post(`${AppConstant.API_BASE}admin/api-log`,data).pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getErrorLog(data) {
        return this.http.post(`${AppConstant.API_BASE}admin/error-log`,data).pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    updateProfileSettings(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}admin/updateprofilesettings`, bodyObj).pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllUsers() {
        return this.http.get(`${AppConstant.API_BASE}admin/users`).pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getStaffRole() {
        return this.http.get(`${AppConstant.API_BASE}admin/dashboard`).pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getUsersByStaffId(staffId) {
        return this.http.get(`${AppConstant.API_BASE}admin/users-by-staffId?staffId=${staffId}`).pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllUsersAwaitingApproval() {
        return this.http.get(`${AppConstant.API_BASE}admin/user/approvals/temp`).pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllUserAccountStatusChangeAwaitingApproval() {
        return this.http.get(`${AppConstant.API_BASE}admin/user/account-status/approvals/temp`).pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    sendForUserAccountStatusApproval(formObj) {
        return this.http.post(`${AppConstant.API_BASE}admin/user-account-status-update/approval`, formObj).pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    sendForApproval(formObj) {
        return this.http.post(`${AppConstant.API_BASE}admin/user/approval`, formObj).pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveUser(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}admin/user`, bodyObj).pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateUser(id, body) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}admin/user/${id}`, bodyObj).pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    ///End User
    getAllGlobalSettings() {
        return this.http.get(`${AppConstant.API_BASE}admin/global-settings`).pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    //Group

    getAllGroups() {
        return this.http.get(`${AppConstant.API_BASE}admin/groups`).pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveGroup(body) {

        let bodyObj = JSON.stringify(body);

        return this.http.post(`${AppConstant.API_BASE}admin/group/add`, bodyObj).pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateGroup(id, body) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}admin/group/${id}`, bodyObj).pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteGroup(groupId) {
      return this.http.delete(`${AppConstant.API_BASE}admin/remove-group/${groupId}`).pipe(
        map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getGroupById(id) {
        return this.http.get(`${AppConstant.API_BASE}admin/group/${id}`).pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getActivityParentAndChild() {
        return this.http.get(`${AppConstant.API_BASE}admin/activities/parents`).pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getActivityDetailsByParent(parentId) {
        return this.http.get(`${AppConstant.API_BASE}admin/activities/parents/details/${parentId}`).pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    //group/activities/mapped

    getGroupsAndActivities() {
        return this.http.get(`${AppConstant.API_BASE}admin/group/activities/mapped`).pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    assignAccessRight(id, body) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}admin/group/activity/access/${id}`, bodyObj).pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    //group/activity/access/{id}

    //End Group

    getDeletedStaffLog() {
        return this.http.get(`${AppConstant.API_BASE}admin/audit/deleted-staff-log`).pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getDormantStaffLog() {
        return this.http.get(`${AppConstant.API_BASE}admin/audit/dormant-staff-log`).pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getAuditTrails(page: number, itemPerPage: number) {
        return this.http.get(`${AppConstant.API_BASE}admin/audit/log?page=${page}&itemsPerPage=${itemPerPage}`).pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    searchDeletedStaffLogLog(terms: Observable<any>) {
        return terms.pipe(debounceTime(400),
            distinctUntilChanged(),
            switchMap(term => this.searchDeletedStaffLogEntries(term)),);
    }

    searchDeletedStaffLogEntries(term) {
        return this.http
            .get(`${AppConstant.API_BASE}admin/audit/deleted-staff-log/search/${term}`).pipe(
            map((res: any) => res));
    }

    searchAuditLog(terms: Observable<any>) {
        return terms.pipe(debounceTime(400),
            distinctUntilChanged(),
            switchMap(term => this.searchEntries(term)),);
    }

    searchEntries(term) {
        return this.http
            .get(`${AppConstant.API_BASE}admin/audit/log/search/${term}`).pipe(
            map((res: any) => res));
    }

    manageUserAccountStatus(userId, lockStatus) {
        let bodyObj = {};
        return this.http.put(`${AppConstant.API_BASE}admin/manage-account-status/user/${userId}/lock-status/${lockStatus}`, bodyObj).pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getActiveUsers(page: number, itemPerPage: number) {
        return this.http.get(`${AppConstant.API_BASE}admin/accountmanagement?page=${page}&itemsPerPage=${itemPerPage}`).pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateActiveUsers(data) {
        return this.http.post(`${AppConstant.API_BASE}admin/accountmanagement`, data).pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    // downloadFile(): Observable<Blob> {
    //     let options = new RequestOptions({responseType: ResponseContentType.Blob });
    //     return this.http.get(`${AppConstant.API_BASE}media/staff-data-sample`)
    //         .map(res => res.blob())
    //         .catch((error: any) => Observable
    //             .throw(error.error || 'Server error'));
    // }
}