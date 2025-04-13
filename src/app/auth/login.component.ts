import { AuthenticationService } from '../admin/services/authentication.service';
import { AppConstant, GlobalConfig } from '../shared/constant/app.constant';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingService } from '../shared/services/loading.service';
import swal from 'sweetalert2';
import { PushNotificationsService } from 'ng-push';
import { UserNotification } from '../shared/models/notification';
import { NotificationService } from '../shared/services/notification.service';
import { MainLayoutComponent } from '../shared/layout/mainlayout.component';
import { Message } from 'primeng/primeng';
import { FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser'
import * as CryptoJS from 'crypto-js';



@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['./css/style.scss']
})

export class LoginComponent implements OnInit {
    displayTwoFactorAuth: boolean = false;
    allowSignoutPage: boolean = false;
    data: any = {};
    show: boolean = false;
    authenticating: boolean = false;
    message: any;
    title: any;
    cssClass: any;
    returnUrl: any;
    displayPasswordchange: boolean = false;
    msgs: Message[] = [];
    notificationList: UserNotification[];
    username: string;
    password: string;
    passwordForm: FormGroup;
    otherActiveSessions: boolean = false;
    userSpecificTokenAccessEnabled: any;

    evt: any;
    detailMessage: string = "You have an active session running on another browser or device. You are required to sign out from the active browser or device to end the session";

    firstcheck() {
        if (this.authenticating == true)
            if (this.authenticating == true) return;
        this.authenticating = true;
        this.loadingService.show();
        let body = {};
        debugger
        if (AppConstant.API_VERSION === true) {
            
            let password = btoa(this.data.password);
            this.username = this.data.username;
            this.password = this.data.password;;
            body = {
                username: this.data.username,
                password: password
            };
            this.authService.signIn2(body).subscribe((response: any) => {
                this.otherActiveSessions = response.userInfo.authId;
                debugger
                if (this.otherActiveSessions == false) {
                    this.showMessage(response.message, 'error', 'Authentication Error');
                }
                this.loadingService.hide();
                this.authenticating = false;
                debugger
                this.authService.UserProfile.isLoggedIn = true;
                if (response.success === true) {
                    if (response.userInfo.activities != undefined) {
                        let twoFactorAuthEnabled = response.userInfo.activities.indexOf("2FA")
                        if (twoFactorAuthEnabled > -1) {
                            this.displayTwoFactorAuth = true;
                           //this.signIn();    
                           
                        } else {
                            this.router.navigate([this.returnUrl]);
                        }
                    }
                    
                } else {
                    this.showMessage('Wrong username or password!', 'error', 'Authentication Error');
                }
                
            });
        }
        else {
            body = {
                username: this.data.username,
                password: this.data.password
            };
        }
    }
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private loadingService: LoadingService,
        private authService: AuthenticationService,
        private noticeService: NotificationService,
        private _pushNotifications: PushNotificationsService,
        private fb: FormBuilder,
        private sanitized: DomSanitizer
    ) {
    }


    ngOnInit() {

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.passwordChangeForm();
        if (!('Notification' in window)) {
         
        }

        if (this._pushNotifications.permission !== 'denied') {
            this._pushNotifications.requestPermission();

           
        }

    }

    decryptCrypto(encryptedText: string): string {
        const encrptyKey = 'SSljsdkkdlo4454M';
        const encrptySalt = 'kljsdkkdlo4454GG';

        var key = CryptoJS.enc.Utf8.parse(encrptyKey);
        var iv = CryptoJS.enc.Utf8.parse(encrptySalt);

        var decrypted = CryptoJS.AES.decrypt(encryptedText, key,
            {
                keySize: 128 / 8,
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });

        return decrypted.toString(CryptoJS.enc.Utf8);
    }

    onPasswordChange() {
        let body = this.passwordForm.value;
        if (body.newPassword != body.confirmPassword) {
            swal(`${GlobalConfig.APPLICATION_NAME}`, "New password and confirm password does not match.", 'info');
            return;
        }
      

        this.authService.passwordChange(body).subscribe((res) => {
           
            if (res.success) {
                this.displayPasswordchange = false;
                swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
            }
            else {
                this.displayPasswordchange = true;
                swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
            }
        });
    }

    passwordInfo: string;

    passwordChangeForm() {
        this.passwordForm = this.fb.group({
            username: ['', Validators.required],
            currentPassword: ['', Validators.required],
            newPassword: ['', Validators.compose([Validators.required, Validators.minLength(7)])],
            confirmPassword: ['', Validators.compose([Validators.required, Validators.minLength(7)])]
        },
            { validator: this.equalValueValidator('newPassword', 'confirmPassword') }
        );
    }

    equalValueValidator(targetKey: string, toMatchKey: string): ValidatorFn {
        return (group: FormGroup): { [key: string]: any } => {
            const target = group.controls[targetKey];
            const toMatch = group.controls[toMatchKey];
            if (target.touched || toMatch.touched) {
                const isMatch = target.value === toMatch.value;
               
                if (!isMatch && target.valid && toMatch.valid) {
                    toMatch.setErrors({ equalValue: targetKey });
                    const message = targetKey + ' != ' + toMatchKey;
                    return { 'equalValue': message };
                }
                if (isMatch && toMatch.hasError('equalValue')) {
                    toMatch.setErrors(null);
                }
            }

            return null;
        };
    }

    hideModal() {
        this.displayPasswordchange = false;
    }
    onNotificationClick(event) {
        event.preventDefault();
       
    }

    signIn() {

        var key = CryptoJS.enc.Utf8.parse('7061737323313233');
        var iv = CryptoJS.enc.Utf8.parse('7061737323313233');
        var ciphertext = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(this.data.password), key,
            {
                keySize: 128 / 8,
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });


        if (this.authenticating == true)
        if (this.authenticating == true) return;
        this.authenticating = true;
        this.loadingService.show();
        let body = {};
        if (AppConstant.API_VERSION === true) {
            debugger
            //let password = btoa(this.data.password);
            let password = ciphertext.toString();
            this.authService.getAuthToken(this.data.username, password).subscribe((res) => {
                this.authService.setDateNow();

                var tokenaccess = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(res.access_token), key,
                        {
                            keySize: 128 / 8,
                            iv: iv,
                            mode: CryptoJS.mode.CBC,
                            padding: CryptoJS.pad.Pkcs7
                        });
                    var expirydate = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(res.expiry_date), key,
                        {
                            keySize: 128 / 8,
                            iv: iv,
                            mode: CryptoJS.mode.CBC,
                            padding: CryptoJS.pad.Pkcs7
                        });

                this.username = this.data.username;
                this.password = this.data.password;
                let token = res && res.access_token;
                if (token) {
                // let accesstoken = btoa(res.access_token);
                // let expiry = btoa(res.expiry_date);
                // let password = btoa(this.data.password);

                let accesstoken = tokenaccess.toString();
                let expiry = expirydate.toString();
                let password = ciphertext.toString();

                    body = {
                        username: this.data.username,
                        password: password,
                        encodedToken: accesstoken,
                        validTo: expiry,
                    };
                   this.authService.setRefreshToken(res.refresh_token);
                   this.authService.setTokenDuration(res.expires_in);
                   //this.authService.signIn(body, token).subscribe((encrptedResponse:any) => {
                   this.authService.signIn(body).subscribe((encrptedResponse:any) => {
                    const decryptedResp = this.decryptCrypto(encrptedResponse);
                    const response: any = JSON.parse(decryptedResp);

                        this.loadingService.hide();
                        this.authenticating = false;
                        this.authService.UserProfile.isLoggedIn = true;
                        if (response.userInfo.sessionStatusInfo.state == 0){
                            if (response.userInfo.sessionStatusInfo.isFirstLogin) {
                                this.passwordInfo = `This is the first time you are login to the Credit360, you are required to change your password.`
                                 this.passwordChangeForm();
                                this.passwordForm.controls['username'].setValue(this.username);
                                this.displayPasswordchange = true;
                                return;
                            }

                            if (response.userInfo.sessionStatusInfo.isPasswordExpired) {
                                this.passwordInfo = `Your current password has expired. You have need to change your password.`
                                this.passwordChangeForm();
                                this.passwordForm.controls['username'].setValue(this.username);
                                this.displayPasswordchange = true;
                                return;
                            }

                            if (response.success === true) {
                                const lastLoggedInUser = this.authService.getLastLoggedInUser();
                                if (lastLoggedInUser !== response.userInfo.userName) {
                                    this.returnUrl = '/';
                                }
                               this.authService.setUserInfo(response.userInfo);
                                this.authService.setLoggedInUser(response.access_token);
                                this.authService.setTokenExpirationTime(response.expiration);
                                this.authService.setLastUsername(response.userInfo.userName);
                                this.authService.setLoggedInUserActivities(response.userInfo.activities);
                                this.authService.setLoginCode(response.userInfo.loginCode)
                                if (response.userInfo.activities != undefined) {
                                    let twoFactorAuthEnabled = response.userInfo.activities.indexOf("2FA")
                                    if (twoFactorAuthEnabled > -1) {
                                        this.userSpecificTokenAccessEnabled = response.userSpecificTokenAccessEnabled;
                                        this.displayTwoFactorAuth = true;
                                    } else {
                                        this.router.navigate([this.returnUrl]);
                                    }
                                }
                               } else {
                               
                                this.showMessage('Wrong username or password!', 'error', 'Authentication Error');
                            }
                        }else{
                            const __this = this;
                            swal({
                              title: __this.detailMessage,
                              text: "Do you want to clear out your existing session and Login afresh? Unsaved changes may be lost!",
                              type: "question",
                              showCancelButton: true,
                              confirmButtonColor: "#3085d6",
                              cancelButtonColor: "#d33",
                              confirmButtonText: "Yes, Clear It",
                              cancelButtonText: "No, Don't Clear!",
                              confirmButtonClass: "btn btn-success btn-move",
                              cancelButtonClass: "btn btn-danger",
                              buttonsStyling: true,
                            }).then(
                              function () {
                                __this.ClearSession();
                              },
                              function (dismiss) {
                                if (dismiss === "cancel") {
                                  swal(
                                    `${GlobalConfig.APPLICATION_NAME}`,
                                    "Operation cancelled",
                                    "error"
                                  );
                                }
                              })
                        }
                    }, (err) => {
                       
                       this.authenticating = false;
                        this.loadingService.hide();
                        this.showMessage(err, 'error', 'Authentication Error');
                    });
                } else {
                    this.authenticating = false;
                    this.loadingService.hide();
                    this.showMessage('Wrong username or password!!', 'error', 'Authentication Error');
                }

            }, (err) => {
                 this.authenticating = false;

                this.loadingService.hide();
                this.showMessage(err, 'error', 'Authentication Error');
            });

        } else {
            body = {
                username: this.data.username,
                password: this.data.password
            };
        }

    }

    showWarn() {
        this.msgs = [];
        this.msgs.push({ severity: 'warn', summary: '', detail: this.detailMessage });
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
    signOut(evt) {
        evt.preventDefault();
        let body = {};
        if (AppConstant.API_VERSION === true) {

            this.authService.getAuthToken(this.data.username, this.data.password).subscribe((res) => {
               let token = res && res.access_token;

                if (token) {

                    body = {
                        username: this.data.username,
                        password: this.data.password,
                        encodedToken: res.access_token,
                        validTo: res.expiry_date
                    };

                    this.authService.UserProfile.isLoggedIn = true;

                    this.authService.endActiveSession(body).subscribe((response:any) => {
                        if (response.success === true) {
                            this.allowSignoutPage = false;
                            swal(GlobalConfig.APPLICATION_NAME, response.message, "success")
                            this.router.navigate(['/auth/login']);
                        } else {
                            this.data.username = "";
                            this.data.password = "";
                        }
                    });
                }
            });
        }
    }
    getNotificationForFinalState() {
        this.noticeService.getNotificationForFinalState().subscribe((res) => {
            this.notificationList = res;
            let tempNotification = this.notificationList;
            tempNotification.forEach((el) => {
                this.spawnNotification('Alert', 'assets/images/notification_logo.png', el.message);
                this._pushNotifications.create(
                    'Alert', {
                        body: el.message,
                        icon: 'assets/images/notification_logo.png',
                        data: el.actionUrl,
                        renotify: true,
                    }).subscribe((res) => {
                       setTimeout(res['notification'].close.bind(res['notification']), 4000);
                    }, (err) => {
                       });

            });
        }, (err) => {
           
        });
    }



    spawnNotification(theBody, theIcon, theTitle) {
        let options = {
            body: theBody,
            icon: theIcon
        }
        let n = new Notification(theTitle, options);
        setTimeout(n.close.bind(n), 5000);
    }
    login(){
        this.signIn();
    }
    logOut() {
        this.authService.UserProfile.isLoggedIn = false;
        this.authService.logOffSystem().subscribe((res) => {
     }, (err) => {
           
        });
        sessionStorage.removeItem('auth');

        if (AppConstant.REMEMBER_LAST_WORKAREA) {
            this.router.navigate(['/auth/login'], {
                queryParams: { returnUrl: this.authService.redirectUrl }
            });
            return;
        }
        this.router.navigate(['/auth/login']);
    }

    clearSession: boolean = false;
    ClearSession() {
        this.clearSession = true;
        var key = CryptoJS.enc.Utf8.parse('7061737323313233');
        var iv = CryptoJS.enc.Utf8.parse('7061737323313233');
        var ciphertext = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(this.data.password), key,
          {
              keySize: 128 / 8,
              iv: iv,
              mode: CryptoJS.mode.CBC,
              padding: CryptoJS.pad.Pkcs7
          });
        if (this.authenticating == true)
        if (this.authenticating == true) return;
        this.authenticating = true;
        this.loadingService.show();
        let body = {};
        if (AppConstant.API_VERSION === true) {  
            //let password = btoa(this.data.password);
            let password = ciphertext.toString();
            this.authService.getClearSessionAuthToken(this.data.username, password).subscribe((res) => {
                    this.authService.setDateNow();

                    var tokenaccess = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(res.access_token), key,
                        {
                            keySize: 128 / 8,
                            iv: iv,
                            mode: CryptoJS.mode.CBC,
                            padding: CryptoJS.pad.Pkcs7
                        });
                    var expirydate = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(res.expiry_date), key,
                        {
                            keySize: 128 / 8,
                            iv: iv,
                            mode: CryptoJS.mode.CBC,
                            padding: CryptoJS.pad.Pkcs7
                        });
                    this.username = this.data.username;
                    let token = res && res.access_token;
                    if (token) {
                    // let accesstoken = btoa(res.access_token);
                    // let expiry = btoa(res.expiry_date);
                    // let password = btoa(this.data.password);

                    let accesstoken = tokenaccess.toString();
                    let expiry = expirydate.toString();
                    let password = ciphertext.toString();
                
                        body = {
                            username: this.data.username,
                            password: password,
                            encodedToken: accesstoken,
                            validTo: expiry,
                            clearSession: true
                        };
                        this.authService.setRefreshToken(res.refresh_token);
  
                        //this.authService.signIn(body, token).subscribe((encrptedResponse: any) => {
                        this.authService.signIn(body).subscribe((encrptedResponse: any) => {
                            const decryptedResp = this.decryptCrypto(encrptedResponse);
                            const response: any = JSON.parse(decryptedResp);
                            this.loadingService.hide();
                            this.authenticating = false;
                            this.authService.UserProfile.isLoggedIn = true;
                            if (response.userInfo.sessionStatusInfo.state == 0) {
                                if (response && response.userInfo && response.userInfo.sessionStatusInfo.isFirstLogin) {
                                    this.passwordInfo = `This is the first time you have logged into Credit360, you are required to change your password.`
                                    this.passwordChangeForm();
                                    this.passwordForm.controls['username'].setValue(this.username);
                                    this.displayPasswordchange = true;
                                    return;
                                }
  
                                if (response && response.userInfo && response.userInfo.sessionStatusInfo.isPasswordExpired) {
                                    this.passwordInfo = `Your current password has expired. You have need to change your password.`
                                    this.passwordChangeForm();
                                    this.passwordForm.controls['username'].setValue(this.username);
                                    this.displayPasswordchange = true;
                                    return;
                                }
  
                                if (response.success === true) {
                                    const lastLoggedInUser = this.authService.getLastLoggedInUser();
                                    if (lastLoggedInUser !== response.userInfo.userName) {
                                        this.returnUrl = '/';
                                    }
                                    this.authService.setUserInfo(response.userInfo);
                                    this.authService.setNextRefreshTime();
                                    this.authService.setLoggedInUser(response.access_token);
                                    this.authService.setTokenExpirationTime(response.expiration);
                                    this.authService.setLastUsername(response.userInfo.userName);
                                    this.authService.setLoggedInUserActivities(response.userInfo.activities);
                                    this.authService.setLoginCode(response.userInfo.loginCode)
                                    
                                    if (response.userInfo.activities != undefined) {
                                        let twoFactorAuthEnabled = response.userInfo.activities.indexOf("2FA")
                                        if (twoFactorAuthEnabled > -1) {
                                            this.displayTwoFactorAuth = true;
                                        }
                                    }
                                    // if (response.userInfo.activities != undefined) {
                                    //     let twoFactorAuthEnabled = response.userInfo.activities.indexOf("2FA")
                                    //     if (twoFactorAuthEnabled > -1) {
                                    //         this.userSpecificTokenAccessEnabled = response.userSpecificTokenAccessEnabled;
                                    //         this.displayTwoFactorAuth = true;
                                    //     } else {
                                    //         this.router.navigate([this.returnUrl]);
                                    //     }
                                    // }
                                } else {
                                    // swal('Authentication Error', 'Wrong username or password!', 'error');
                                    this.showMessage('Wrong username or password!', 'error', 'Authentication Error');
                                }
                            } else {
                                this.showMessage(this.detailMessage, 'error', 'Authentication Error');
                                this.data.username = "";
                                this.data.password = "";
                            }
  
  
  
                        }, (err) => {
                            ////// console.log(err.response);
                            // swal('Authentication Error', err, 'error');
                            this.authenticating = false;
                            this.loadingService.hide();
                            this.showMessage(err, 'error', 'Authentication Error');
                        });
                    } else {
                        this.authenticating = false;
                        this.loadingService.hide();
                        this.showMessage('Login failed!!', 'error', 'Authentication Error');
                    }
  
                }, (err) => {
                    // console.log(err);
                    this.authenticating = false;
  
                    this.loadingService.hide();
                    this.showMessage(err.error.error_description, 'error', 'Authentication Error');
                });
  
        } else {
            body = {
                username: this.data.username,
                password: this.data.password
            };
        }
  
    }
  
}

