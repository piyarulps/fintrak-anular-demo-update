import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'app/customer/services/customer.service';
import { GlobalConfig } from 'app/shared/constant/app.constant';
import { LoadingService } from 'app/shared/services/loading.service';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';

@Component({
  selector: 'app-global-customer-verification',
  templateUrl: './global-customer-verification.component.html',
  styles: []
})
export class GlobalCustomerVerificationComponent implements OnInit {

  activeIndex = 0;
  nameSearch: string;
  loanInfoIndex = 0;
  kycDocumentUploadList
  binaryFile: any;
  selectedDocument: any;
  displayUpload: boolean;
  customerSearchResult: any[];
  private subscriptions = new Subscription();
  firstNameSearch: string;
  lastNameSearch: string;
  birthDateSearch: Date;
  birthPlaceSearch: string;
  phoneSearch: string;
  emailSearch: string;
  searchTotal: any
  showLoadIcon: any;

  constructor(private loadingService: LoadingService,private customerService: CustomerService,

    ) {}

  ngOnInit() {
  }

  getCustomerSearchResults(event) {
    this.getSearchResult(this.firstNameSearch, this.lastNameSearch, this.emailSearch, this.phoneSearch, this.birthDateSearch, this.birthPlaceSearch);
    event.preventDefault();
}

getSearchResult(firstNameSearch: string, lastNameSearch: string, phoneSearch:string, emailSearch:string, birthDateSearch:Date, birthPlaceSearch:string) {
  const data =  {firstNameSearch, lastNameSearch, phoneSearch, emailSearch, birthDateSearch, birthPlaceSearch};
  this.loadingService.show();
  //this.subscriptions.add(
    this.customerService.getIntlCustomerSearch(data).subscribe((res) => {
         
          this.customerSearchResult = res.result;
          this.searchTotal = res.count;
          this.loadingService.hide();
  }, (err) => {
      this.loadingService.hide();
      swal(`${GlobalConfig.APPLICATION_NAME}`, err.message, 'error');
  });
}


  getKYCDocumentUploads(customerId) {
    this.loadingService.show();
    this.subscriptions.add(
      this.customerService
        .getKYCDocumentUploads(customerId)
        .subscribe((response: any) => {
          this.kycDocumentUploadList = response.result;
          this.loadingService.hide();
        })
    );
  }
  viewImage(id: number) {
    let doc = this.kycDocumentUploadList.find(x => x.documentId == id);
    if (doc != null) {
      this.binaryFile = doc.fileData;
      this.selectedDocument = doc.documentTitle;
      this.displayUpload = true;
    }
  }
  pushSelectedLoans(event){

  }

  searchBiometric(){

  }

  popSelectedLoans(event){

  }
}
