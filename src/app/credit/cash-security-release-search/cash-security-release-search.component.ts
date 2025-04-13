import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder} from '@angular/forms';
import { CollateralService } from 'app/setup/services';
import { LoadingService } from 'app/shared/services/loading.service';

@Component({
  selector: 'app-cash-security-release-search',
  templateUrl: './cash-security-release-search.component.html'
})
export class CashSecurityReleaseSearchComponent implements OnInit {

  displaySearchForm: boolean = false;
  searchString: any;
  securityRelease: any[] = [];
  displaySearchTable: boolean;
  reload: any;
  selectedValuation: any;
  searchForm: FormGroup;

  constructor(private collateralService: CollateralService,
              private loadingService: LoadingService,
              private fb: FormBuilder,) { }

  ngOnInit() {
    this.clearControls();
  }

  showSearchForm() { this.displaySearchForm = true; }

  submitForm(form) {
    this.searchString = form.value.searchString;

    this.loadingService.show();
    this.collateralService.getCashSecurityReleaseSearch(this.searchString).subscribe((response:any) => {
      this.securityRelease = response.result;
      this.loadingService.hide();
      this.displaySearchForm = false;
      this.displaySearchTable = true;
    }, (err: any) => {
      this.loadingService.hide(1000);
    });
  }

  view(row) {
    ++this.reload;
    this.selectedValuation = row;
  }

  clearControls() {
    this.searchForm = this.fb.group({
      searchString: ['', Validators.required],
    });
  }

  show: boolean = false; message: any; title: any; cssClass: any;

	finishGood(message) {
		this.showMessage(message, 'success', "FintrakBanking");
		this.loadingService.hide();
	}

	hideMessage(event) { this.show = false; }

	finishBad(message) {
		this.showMessage(message, 'error', "FintrakBanking");
		this.loadingService.hide();
	}

	showMessage(message: string, cssClass: string, title: string) {
		this.message = message;
		this.title = title;
		this.cssClass = cssClass;
		this.show = true;
	}


}


