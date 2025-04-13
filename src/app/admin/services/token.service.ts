import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingService } from '../../shared/services/loading.service';
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import swal from 'sweetalert2';
 


@Injectable()
export class AuthHttp {
    private logger: string;
    private user: string;

    constructor(
        private http: HttpClient,
        private authService: AuthenticationService,
        private router: Router,
        private loadingService: LoadingService,
        private sanitizer: DomSanitizer

    ) { }




    get(url) {
        this.logger = window.sessionStorage.getItem('logger') != null ? window.sessionStorage.getItem('logger') : "";
        this.user = window.sessionStorage.getItem('lastLoggedInUser') != null ? window.sessionStorage.getItem('lastLoggedInUser') : "";
  
        const token = this.authService.getToken();
        return this.http.get(url, {
                headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
                .set('logger', this.logger)
                .set('user', this.user)
            })
            .pipe(
                map((res: any) => res),
              catchError((error: any) => observableThrowError(error.error || 'Server error')),);
          }

   post(url, data) {
         data = this.addMedium(data);
         this.logger = window.sessionStorage.getItem('logger') != null ? window.sessionStorage.getItem('logger') : "";
         this.user = window.sessionStorage.getItem('lastLoggedInUser') != null ? window.sessionStorage.getItem('lastLoggedInUser') : ""; 
            const token = this.authService.getToken();
        
            return this.http.post(url, data, {
                headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
                                        .set('Content-Type', 'application/json')
                                        .set('logger', this.logger)
                                        .set('user', this.user)                        
            })
            .pipe(
                map((res: any) => res),
              catchError((error: any) => observableThrowError(error.error || 'Server error')),);
          }



  put(url, data) {
            data = this.addMedium(data);
            this.logger = window.sessionStorage.getItem('logger') != null ? window.sessionStorage.getItem('logger') : "";
            this.user = window.sessionStorage.getItem('lastLoggedInUser') != null ? window.sessionStorage.getItem('lastLoggedInUser') : "";    
            const token = this.authService.getToken();
            return this.http.put(url, data,  {
                headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
                                        .set('Content-Type', 'application/json')
                                        .set('logger', this.logger)
                                        .set('user', this.user)  
            })
            .pipe(
                map((res: any) => res),
              catchError((error: any) => observableThrowError(error.error || 'Server error')),);
          }
    addMedium (data) {
        try{
            if(typeof data === 'string') {
                data = JSON.parse(data);
                data.medium = 'mobile';
                data = JSON.stringify(data);
            }
            else {
                data.medium = 'mobile';
            }
            
           }
           catch(error) {
               console.log(error);
           }
           return data;
        
    }
   delete(url) {
    this.logger = window.sessionStorage.getItem('logger') != null ? window.sessionStorage.getItem('logger') : "";
    this.user = window.sessionStorage.getItem('lastLoggedInUser') != null ? window.sessionStorage.getItem('lastLoggedInUser') : "";
    const token = this.authService.getToken();
    return this.http.delete(url,  {
                headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
                                        .set('Content-Type', 'application/json')
            })
                .catch(res => this.handleError(res));
    }

    refreshExpiredToken(): Observable<any> {
        const userInfo = this.authService.getUserInfo();
        const username = userInfo.username != null ? userInfo.username : userInfo.userName;
        const refreshToken = this.authService.getRefreshToken();
        const obs =  new Observable((observer) => {
          this.authService.getAuthRefreshToken(username, refreshToken).subscribe((response: any) => {
            this.authService.logOut();
            this.authService.setLoggedInUser(response.access_token);
            this.authService.setTokenExpirationTime(response.expiry_date);
            this.authService.setRefreshToken(response.refresh_token);

            observer.next(response.access_token);
            observer.complete();
            this.authService.setLastTokenRefreshTime();
        }, (error) => {
          observer.error(error);
          observer.complete();
        });
    });

        return obs;
    }

    getAuthorizationHeader() {
        if (this.isTokenExpired()) {
            try {
                const userInfo = this.authService.getUserInfo();
                const refreshToken = this.authService.getRefreshToken();
                this.authService.getAuthRefreshToken(userInfo.username, refreshToken).subscribe((response: any) => {
                    this.authService.logOut();
                    this.authService.setLoggedInUser(response.access_token);
                    this.authService.setTokenExpirationTime(response.expiry_date);
                    this.authService.setRefreshToken(response.refresh_token);
                    this.authService.setLastTokenRefreshTime();
                    return response.access_token;
                });
            } catch (err) {
                this.handleRefreshTokenError(err);
            }
            // this.authService.logOut();
        }
        return this.authService.getToken();
    }

    createAuthorizationHeader(headers: HttpHeaders, includect: boolean) {
        if (this.isTokenExpired()) {
            //     this.authService.logOut();
        }
        const token = this.authService.getToken();
        if (includect === true) {
             headers.append('Content-Type', 'application/json');
        }
        if (this.authService.isUserLoggedIn() && token ) {
             headers.append('Authorization', `Bearer ${token}`);
        }

    }

    private isTokenExpired(): boolean {
        const currDate = new Date(Date.now());
        const tokenExpiration = new Date(this.authService.getTokenExpirationTime());
        return currDate >= tokenExpiration;
    }

    // handleError(error: Response) {
    //     if (error.status == 401) {
    //         this.authService.logOut();
    //         return this.router.navigate(['/auth/login']);
    //     }
    // }

    handleError(error: Response) {
        if (error.status === 403) {
            this.authService.logOut();
            this.loadingService.hide(1000);
            swal(`Access denied!`,
            'You have been locked out temporarily. EOD process or other admin background process is running!',
            'error');
            return this.router.navigate(['/auth/login']);
        }

        if (error.status === 401) {
            try {
                const userInfo = this.authService.getUserInfo();
                const refreshToken = this.authService.getRefreshToken();
                const username = userInfo.username ? userInfo.username : userInfo.userName;
                this.authService.getAuthRefreshToken(username, refreshToken).subscribe((response: any) => {
                    this.authService.logOut();
                    this.authService.setLoggedInUser(response.access_token);
                    this.authService.setTokenExpirationTime(response.expiry_date);
                    this.authService.setRefreshToken(response.refresh_token);
                    this.authService.setLastTokenRefreshTime();
                });
            } catch (err) {
                this.handleRefreshTokenError(err);
            }
            return null;
        }
    }

    handleRefreshTokenError(error: Response) {
        if (error.status === 401) {
            this.authService.logOut();
            return this.router.navigate(['/auth/login']);
        }
    }

    refreshToken() {


        return new Observable((observer) => {
            const userInfo = this.authService.getUserInfo();
            const refreshToken = this.authService.getRefreshToken();
            const username = userInfo.username ? userInfo.username : userInfo.userName;
            this.authService.getAuthRefreshToken(username, refreshToken).subscribe((response: any) => {
                this.authService.logOut();
                this.authService.setLoggedInUser(response.access_token);
                this.authService.setTokenExpirationTime(response.expiry_date);
                this.authService.setRefreshToken(response.refresh_token);
                this.authService.setNextRefreshTime();
                observer.next(response.access_token);
                this.authService.setLastTokenRefreshTime();
            }, () => {
                console.log('token refresh failed');
                this.authService.bounceUserOut();
            });
          });
    }

}
