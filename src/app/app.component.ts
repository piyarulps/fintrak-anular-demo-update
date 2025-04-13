import { OnInit, HostListener, OnDestroy } from '@angular/core';
import { NotificationService } from './shared/services/notification.service';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import swal from 'sweetalert2';

import { Router, Event, NavigationStart, NavigationEnd, NavigationError, NavigationCancel, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { GlobalConfig } from './shared/constant/app.constant';
// import { Observable } from 'rxjs/Observable';
// import { Subscription } from 'rxjs/Subscription';
import { Observable, Subscription, interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoadingService } from './shared/services/loading.service';
import { AuthenticationService } from './admin/services/authentication.service';
// import { DialogService } from 'app/shared/services/dialog.service';


@Component({
    selector: 'app-root',
    template: `<router-outlet></router-outlet><div *ngIf="loading" id="page-preloader" style="display:block"><span class="spinner"></span></div>`,
       //    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

    notificationList: any[] = [];
    loading: boolean;
    domIsReady: boolean = false;
 
    constructor(
        private noticeService: NotificationService,
        private router: Router,private changeRef: ChangeDetectorRef,
        private titleService: Title,
        private authService: AuthenticationService,
        private loadingService: LoadingService,

    ) {
        router.events.subscribe((routerEvent: Event) => { this.checkRouterEvent(routerEvent); });
        this.validateLogin();
    }

    invalidLogin: boolean = false;

    validateLogin() {
    let currentUser = this.authService.getUserInfo();
    if (this.invalidLogin == false && currentUser != null){
        setInterval(() => {
        this.validateLoginSession();
        }, (1000 * 180))
        }
    }
    validateLoginSession(){
        this.authService.validateLoginSession().subscribe((res: any) => {
        if (res.result == true){
            const lastLoggedInUser = this.authService.getLastLoggedInUser();
            this.authService.removealliteminlocalStore();
            this.authService.setLastUsername(lastLoggedInUser);
            this.invalidLogin = true;
            this.router.navigate(['/auth/login']);
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Unauthorized Access! Invalid login session detected', 'info');
            }}
        )}


    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
       
    }


    checkRouterEvent(routerEvent: Event): void {

        if (routerEvent instanceof RouteConfigLoadStart && this.domIsReady) { 
            // 

            this.loading = true;
            
        }
        
        if (routerEvent instanceof RouteConfigLoadEnd && this.domIsReady) { 
            // 

            this.loading = false;
            
        }
        if (routerEvent instanceof NavigationStart && this.domIsReady) { 
            // 

            this.loading = true;
            
        }

        if (routerEvent instanceof NavigationEnd
            || routerEvent instanceof NavigationCancel
            || routerEvent instanceof NavigationError
        ) {
            this.loading = false;
        }
    }

    ngAfterViewInit() {
        //this.getNotifications();
        // if (this.notificationList.length > 0) {
        //     this.showNotificationPopUp();
        // }
        // setTimeout(() => { this.startLoader(); }, 10000);
        // this.setTitle(`${GlobalConfig.TITLE_HEADER}`);


        //   var modalPromise =   this.dialogSvc.open("Session Expiring!", "Your session is about to expire. Do you need more time?", true, "Yes", "No");
        //   var newObservable = Observable.fromPromise(modalPromise);
        //   newObservable.subscribe(
        //       (res) => {
        //           if (res === true) {
        //               
        //               this._status = "Session was extended.";
        //               this.idleTimeoutSvc.resetTimer();
        //               this.startCounter();
        //               this.changeRef.markForCheck();
                      
        //           } else {
        //               
        //               this._status = "Session was not extended.";
        //               this.changeRef.markForCheck();
        //           }
        //       },
        //       (reason) => {
        //           
        //           this._status = "Session was not extended.";
        //           this.changeRef.markForCheck();
        //       }
        //   );
     
    }

    startLoader() {
        this.domIsReady = true;
    }

    showNotificationPopUp() {
        setInterval(() => {
            swal('Notification', `You have ${this.notificationList.length} approvals waiting for you`, 'info');
        }, (1000 * 20))
    }

    // getNotifications(): {
    //     this.noticeService.getNotificationList()
    //         .subscribe((res) => { 
    //             //this.notificationList = res; 
    //         });
    // }

    public setTitle(newTitle: string) {
        this.titleService.setTitle(newTitle);
    }

}


// <div *ngIf="loading" id="page-preloader" style="display:block"><span class="spinner"></span></div>