import { LoadingService } from '../../../shared/services/loading.service';
import { Component, OnInit, Output, Input, ViewChild, EventEmitter } from '@angular/core';
import { CollateralService } from '../../../setup/services/collateral.service';
import { CustomerService } from '../../../customer/services/customer.service';
import { Subject } from 'rxjs';
import swal from 'sweetalert2';
import { GlobalConfig, CollateralType, CollateralGuaranteeSubType, JobSource, LMSOperationEnum } from '../../../shared/constant/app.constant';
import { saveAs } from 'file-saver';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CasaService } from 'app/customer/services/casa.service';
import { CountryStateService, LedgerService, CurrencyService } from 'app/setup/services';
import { Router } from '@angular/router';

@Component({
  selector: 'collateral-release-awaiting-job-request',
  templateUrl: 'collateral-release-awaiting-job-request.component.html',
})
export class CollateralReleaseAwaitingJobRequestComponent implements OnInit {



    collateralReleaseData: any[];
    collaterals:any;
    constructor(
        private fb: FormBuilder,
        private loadingService: LoadingService,
        private collateralService: CollateralService,
        private router: Router,

    ) { }

    ngOnInit(){
        this.getReleaseRecord();
    }
    getReleaseRecord(){
    this.loadingService.show();
    this.collateralService.getCollateralReleaseAwaitingJobRequest().subscribe((response:any) => {
        this.collateralReleaseData = response.result;
        this.loadingService.hide(1000);
      }, (err) => {
          this.loadingService.hide(1000);
      });
    }

    onRowSelect(event) {
        this.router.navigate(['/credit/collateral/collateral-release-list', event.data.collateralCustomerId]);
    }

    viewRecord(d) {
        
    }
}