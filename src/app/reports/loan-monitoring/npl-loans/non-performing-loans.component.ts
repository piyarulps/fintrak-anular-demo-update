import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { LoadingService } from '../../../shared/services/loading.service';
import { ReportService } from '../../service/report.service';
import { GlobalConfig } from '../../../shared/constant/app.constant';
import swal from 'sweetalert2';

@Component({
    templateUrl: 'non-performing-loans.component.html'
})

export class NonPerformingLoansComponent implements OnInit {

    displayTestReport: boolean;
    startDate?: Date; endDate?: Date;
    displayReport = false; reportSrc: SafeResourceUrl;

    constructor(private loadingService: LoadingService, private reportServ: ReportService,
        private sanitizer: DomSanitizer
    ) {
        let tempSrc = '/';
        this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(tempSrc);
    }

    ngOnInit() {
        this.endDate = new Date();
        this.startDate = new Date();
    }

    
    popoverSeeMore() {
        this.loadingService.show();

        if (this.startDate != null && this.endDate != null) {
           this.displayTestReport = false;
            this.displayReport = false;
            let path = '';
           const data = {
                startDate: this.startDate,
                endDate: this.endDate,
                
            }
            
            this.reportServ.getNonPerformingLoansReport(data)
                .subscribe((response:any) => {
                    path = response.result;
                    this.reportSrc = this.sanitizer.bypassSecurityTrustResourceUrl(path);
                    this.displayTestReport = true;
                });
                this.loadingService.hide(10000);
            this.displayReport = true;
            return;
        }
    }
}