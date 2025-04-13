import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CollateralService } from 'app/setup/services/collateral.service';
import { LoanService } from 'app/credit/services';
import { LoadingService } from 'app/shared/services/loading.service';

@Component({
  selector: 'app-collaterals-proposed',
  templateUrl: './collaterals-proposed.component.html',
})
export class CollateralsProposedComponent implements OnInit {

    proposedCollateral:any[] = [];
	@Input() loanApplicationId = 0;
	@Input() currencyId = 0;
	@Input() isForSwap = false;
	@Output() figures: EventEmitter<any> = new EventEmitter<any>();
    @Output() sum: EventEmitter<number> = new EventEmitter<number>();
	@Output() emitProposedCollateralDetail: EventEmitter<number> = new EventEmitter();
	collateral: any;
	displayCollateralDetails: boolean;
	displayCollateralHistory = false;
	showSearchCollateralForSwap = false;
    @Output() emitCollateral: EventEmitter<any> = new EventEmitter<any>();
	@Input() set reload(value: number) {
        if (value > 0) {
		this.getProposedCollateral(this.loanApplicationId, this.currencyId);
        } else {
            this.refresh();
        }
    }
	
	constructor(
		private collateralService: CollateralService,
        private loanService: LoanService,
		// private creditAppraisalService: CreditAppraisalService,
		private loadingService:LoadingService,
	) { }

	ngOnInit() {
		// this.getProposedCollateral(this.loanApplicationId, this.currencyId);
	}

	getProposedCollateral(loanApplId, currencyId): void {
        this.loadingService.show();
        this.collateralService.getProposedCustomerCollateral(loanApplId, currencyId).subscribe((response:any) => {
            this.loadingService.hide();
            this.proposedCollateral = response.result;
        }, (err) => {
            this.loadingService.hide(1000);
		});
	}
	
	viewCollateralDetail(row) {
		//console.log("test: ", row);
        this.collateral = row;
        this.displayCollateralDetails = true;
	}

	viewCollateralHistory(row) {
        this.collateral = row;
        this.displayCollateralHistory = true;
	}
	
	showSearchCollateral(row) {
        this.collateral = row;
		this.showSearchCollateralForSwap = true;
	}

	emitCollateralDetail(event) {
		event.oldCollateral = this.collateral;
		this.emitCollateral.emit(event);
		this.showSearchCollateralForSwap = false;
    }

	refresh() {
        
    }
}
