
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import { AuthenticationService } from '../../admin/services/authentication.service';
import { Injectable } from '@angular/core';
import { AppConfigService } from './app.config.service';
import { AuthHttp } from '../../admin/services/token.service';
import languages from '../models/languages';






let AppConstant: any = {};


@Injectable()
export class MenuVisibiltyService {

    // constructor() { }

    constructor(private http: AuthHttp,private authService: AuthenticationService, 
         private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }
    translate(word){
        word = word.trim();
      const translated_word =  typeof languages[AppConstant.LANG][word] !== 'undefined'
                             ? languages[AppConstant.LANG][word] : word;
      return translated_word;
    }
    hideOrShow(activities: any[]): boolean {
        let userActivities = this.authService.getLoggedInUserActivities();
        return this.checkActivities(activities, userActivities);
    }

    checkActivities(acceptedArr, incomingArr: string[]): boolean {
        if (acceptedArr.length == 0) return true;
        return incomingArr.some(v => acceptedArr.indexOf(v) >= 0) || incomingArr.indexOf('super admin') > -1;
    }
    
        // test(body) {
        //     return this.http.get(`${AppConstant.API_BASE}setups/tax`)
        //         .map((res: any) => res).catch((error: any) => Observable.throw(error.error || 'Server error'));
        // }

    test(id) {

        if (id == 1) {
            return this.http.get(`${AppConstant.API_BASE}test/company/turnover`).pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')),);
        }
        
        if (id == 2) {
            return this.http.get(`${AppConstant.API_BASE}test/company/interest-turnover`).pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')),);
        }

        if (id == 3) {
            const id = 18077;
            return this.http.get(`${AppConstant.API_BASE}credit/loan-application-details-product/${id}`).pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
        }
        
        if (id == 4) {
            return this.http.get(`${AppConstant.API_BASE}test/unauthorized`).pipe(
                map((response: Response) => response.json()),
                catchError((error: any) => observableThrowError(error.error || 'Server error')),);
        }

    }


}