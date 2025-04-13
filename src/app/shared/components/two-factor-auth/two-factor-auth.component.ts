import { LoadingService } from '../../services/loading.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AuthorizationService } from '../../../admin/services';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, AuthorizationService } from '../../../admin/services';
import swal from 'sweetalert2';
import { GlobalConfig } from '../../constant/app.constant';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-two-factor-auth',
  templateUrl: './two-factor-auth.component.html',
})
export class TwoFactorAuthComponent implements OnInit {
  @Input('display') displayTwoFactorAuth: boolean = false;
  @Input('redirect') returnUrl: string;
  @Output() emitLogout: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitLogin: EventEmitter<any> = new EventEmitter<any>();
  twoFactorAuthStaffCode: string;
  twoFactorAuthForm: FormGroup;
  authenticating: boolean = false;
  show: boolean = false;
  message: string;
  title: string;
  cssClass: string;
  passWork: string;
  username: string;
  userSpecificTokenAccessEnabled: any;
  //userSpecific: boolean;
  //@Input() set staffCode(value: string) {
  @Input() set password(value: string) {
    if (value != null) {
      this.initializeControl();
      let staffP = value;
      this.twoFactorAuthForm.get('userPassword').setValue(staffP);
      // this.twoFactorAuthForm.get('twoFactorAuthStaffCode').setValue(value);
    }
  }

  @Input() set staffCode(value: string) {
    if (value != null) {
      this.initializeControl();
      let staffC = value;
       this.twoFactorAuthForm.get('twoFactorAuthStaffCode').setValue(staffC);
    }
  }
  constructor(private loadingService: LoadingService,
    private fb: FormBuilder,
    private router: Router,
    private authorizationService: AuthorizationService,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    //private authorizationService: AuthorizationService
    ) { }
    

  ngOnInit() {
    this.initializeControl();
  }
  initializeControl() {
    this.twoFactorAuthForm = this.fb.group({
      twoFactorAuthStaffCode: ['', Validators.required],
      //twoFactorAuthPassCode: ['', Validators.required]
      twoFactorAuthPassCode: ['', Validators.required],
      userPassword:['']
    })
  }

//   submitForAuthentication(formObj) {
//     //this.emitLogin.emit();
// let body = formObj.value;
//   this.loadingService.show();
//   var key = CryptoJS.enc.Utf8.parse('7061737323313233');
//           var iv = CryptoJS.enc.Utf8.parse('7061737323313233');
//           var ciphertext = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse('testing'), key,
//               {
//                   keySize: 128 / 8,
//                   iv: iv,
//                   mode: CryptoJS.mode.CBC,
//                   padding: CryptoJS.pad.Pkcs7
//               });
//   let password = ciphertext.toString(); 
//   //let password = btoa('testing1234$'); //testing1234$
//   this.authService.authenticateUser2(body.twoFactorAuthStaffCode, body.twoFactorAuthPassCode).subscribe((response:any) => {
//     debugger
//     this.loadingService.hide();
    
//     if (response.success == true) {
//       this.authService.getAuthToken(body.twoFactorAuthStaffCode, password).subscribe((res) => {
//         this.authService.setDateNow();
//         //this.username = this.staffCode;
//         //let token = res && res.access_token;
//         var tokenaccess = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(res.access_token), key,
//                                 {
//                                     keySize: 128 / 8,
//                                     iv: iv,
//                                     mode: CryptoJS.mode.CBC,
//                                     padding: CryptoJS.pad.Pkcs7
//                                 });
//                             var expirydate = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(res.expiry_date), key,
//                                 {
//                                     keySize: 128 / 8,
//                                     iv: iv,
//                                     mode: CryptoJS.mode.CBC,
//                                     padding: CryptoJS.pad.Pkcs7
//                                 });
        
//                         this.username = body.twoFactorAuthStaffCode;
//                         this.password = 'testing';
//                         let token = res && res.access_token;
//         if (token) {
//           let accesstoken = tokenaccess.toString();
//           let expiry = expirydate.toString();
//           let password = ciphertext.toString();

//           let  body2 = {
//                 username: body.twoFactorAuthStaffCode,
//                 password: password,
//                 encodedToken: accesstoken,
//                 validTo: expiry,
//             };
//            this.authService.setRefreshToken(res.refresh_token);
//            this.authService.setTokenDuration(res.expires_in);
//            this.authService.signIn(body2).subscribe((encrptedResponse:any) => {
//             const decryptedResp = this.decryptCrypto(encrptedResponse);
//             const response: any = JSON.parse(decryptedResp);
            
//                 //this.loadingService.hide();
//                 this.authenticating = false;
//                 this.authService.UserProfile.isLoggedIn = true;

//                     if (response.success === true) {
//                       const lastLoggedInUser = this.authService.getLastLoggedInUser();
//                           if (lastLoggedInUser !== response.userInfo.userName) {
//                               this.returnUrl = '/';
//                           }

//                        this.authService.setUserInfo(response.userInfo);
//                         this.authService.setLoggedInUser(response.access_token);
//                         this.authService.setTokenExpirationTime(response.expiration);
//                         this.authService.setLastUsername(response.userInfo.userName);
//                         this.authService.setLoggedInUserActivities(response.userInfo.activities);
//                         this.authService.setLoginCode(response.userInfo.loginCode)
                        
//                         this.router.navigate([this.returnUrl]);
//                         swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'info');  
                       

//                         this.authenticating = false;
//                         this.loadingService.hide();
//                       } else {
                       
//                         this.showMessage('Wrong username or password!', 'error', 'Authentication Error');
//                     }
                
//             }, (err) => {
               
//                this.authenticating = false;
//                 this.loadingService.hide();
//                 this.showMessage(err, 'error', 'Authentication Error');
//             });
//         } else {
//             this.authenticating = false;
//             this.loadingService.hide();
//             this.showMessage('Wrong username or password!!', 'error', 'Authentication Error');
//         }

//     }, 
//     (err) => {
        
//          this.authenticating = false;
         
//         this.loadingService.hide();
//         this.showMessage(err, 'error', 'Authentication Error');
//     });
//         // this.router.navigate([this.returnUrl]);
//         // swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'info');   
//     } else {
//       if (response.success == true) {
//               this.router.navigate([this.returnUrl]);
//               swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'info');   
//               } else {
//                 swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
//               }
//     }
//   });
// }
    
  submitForAuthentication(formObj) {
    this.loadingService.show();
  let body = formObj.value;

  this.authorizationService.authenticateUser(body.twoFactorAuthStaffCode, body.twoFactorAuthPassCode).subscribe((response: any) => {
    this.loadingService.hide();
    debugger
    console.log("StaffCode: ", body.twoFactorAuthStaffCode);
  if(response.isTwoFAEnabled == true){
    if (response.success == true && response.message == 'Authentication Successful!') {
      this.router.navigate([this.returnUrl]);
      swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'info');   
  } else {
    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
    }
  }
  else{
    if (response.success == true) {
      this.router.navigate([this.returnUrl]);
      swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'info');   
      } else {
        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
      }
    }
  });

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
approveEvent: any;
  closeModal() {
    debugger
    this.displayTwoFactorAuth = false
    //this.emitLogout.emit(null);
    this.emitLogout.emit(true);
  }
  hideMessage(event) {
    this.show = false;
  }

  showMessage(message: string, cssClass: string, title: string) {
    this.message = message;
    this.title = title;
    this.cssClass = cssClass;
    this.show = true;
}
}
