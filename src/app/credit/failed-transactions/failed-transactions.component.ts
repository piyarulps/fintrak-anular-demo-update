import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'app/shared/services/loading.service';
import { CreditAppraisalService } from '../services/credit-appraisal.service';

@Component({
  selector: 'app-failed-transactions',
  templateUrl: './failed-transactions.component.html',
  styleUrls: ['./failed-transactions.component.scss']
})
export class FailedTransactionsComponent implements OnInit {

  failedTransactions: any[] = []

  constructor(
    private loadingService: LoadingService,
    private camService: CreditAppraisalService,
  ) { }

  ngOnInit() {
    this.getFailedTransactions();
  }

  getFailedTransactions() {
    this.loadingService.show();
    this.camService.getGroupOfficeFailedTransactions().subscribe((response:any) => {
        this.failedTransactions = response.result;
        this.loadingService.hide(2000);
    });
}

  retry(){
    
  }
}
