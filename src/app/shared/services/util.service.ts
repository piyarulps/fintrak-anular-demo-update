
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';



@Injectable()
export class UtilityService {
    constructor(private http: HttpClient) { }

    getSystemIpAddress() {
        return this.http.get("http://net.ipcalf.com").pipe(map((res) => res));
    }

    getMyIP(){
        
    }
}