import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../../shared/services/loading.service';
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { ProductService, GeneralSetupService } from '../../services';
import { CustomerService } from '../../../customer/services/customer.service';
import { GlobalConfig } from '../../../shared/constant/app.constant';
import swal from 'sweetalert2';
import { ValidationService } from 'app/shared/services/validation.service';

@Component({
  selector: 'app-product-ude',
  templateUrl: './product-ude.component.html',
  //styleUrls: ['./product-ude.component.scss']
})
export class ProductUdeComponent implements OnInit {
  panelHeader: string;
  customerTypes: any[];
  productClassData: any[];
  productData: any[];
  udeData: any[];
  productClassProcess: any[];
  productClassTypes: any[];
  udeTypes: any [];
  productId: any;
  displayAddUpdateModal: boolean = false;
  productClassForm: FormGroup;
  productUdeForm: FormGroup;
  businessUnit: any;
  disableUdeInfoTab = true;
  isAddNew: boolean = false;
  currentProductId: any;
  currentProductName: any;
  currentUdeId: any;
  constructor(private loadingService: LoadingService,
    private fb: FormBuilder,
    private productService: ProductService,
    private customerService: CustomerService, 
    private genSetupServ: GeneralSetupService,
    ) { }

  ngOnInit() {
    this.loadDropDown();
    this.clearControls();
    this.productList();
  }

  activeTabindex: number = 0;

  onTabChange(e) {  
    this.activeTabindex = e.index;
    if (e.index == 0) {this.reset(); this.isAddNew = false; }
}

reset() {
  this.loadingService.reset();
  this.activeTabindex = 0;
  this.disableUdeInfoTab = true;
  this.productList();
}

refreshTabs() {
  this.disableUdeInfoTab = false;
}

  productList() {
    this.loadingService.show()
    this.productData = [];
    this.productService.getAllProductByTermLoan().subscribe((data) => {
      this.productData = data.result;
      this.loadingService.hide()
    });
  }

  udeByProductId(productId) {
    this.loadingService.show()
    this.productData = [];
    this.productService.getUdeByProductId(productId).subscribe((data) => {
      this.productData = data.result;
      this.loadingService.hide()
    });
  }

  loadDropDown() {
    this.productService.getAllUdeTypes().subscribe((data) => {
      this.udeTypes = data.result;
    })
  }

  clearControls() {
    this.productUdeForm = this.fb.group({
      productUdeId: [''],
      udeId: ['', Validators.required],
      udeValue: ['', Validators.compose([ValidationService.isNumber, Validators.required])],
      resolvedValue: ['', Validators.compose([ValidationService.isNumber, Validators.required])],
      productId: [''],
    });
    this.productUdeForm.controls['productId'].setValue(this.currentProductId)
  }

  showModalForm() {
    this.clearControls();
    this.panelHeader = "Add Product UDE ID";
    this.productUdeForm.controls['productId'].setValue(this.currentProductName)
    this.displayAddUpdateModal = true;
  }

  editProductUde(index, event) {
    event.preventDefault();
    this.panelHeader = "Edit Product UDE ID";
    const row = index;
    this.productUdeForm = this.fb.group({
      productUdeId: [row.productUdeId],
      udeId: [row.udeId, Validators.required],
      udeValue: [row.udeValue, Validators.compose([ValidationService.isNumber, Validators.required])],
      resolvedValue: [row.resolvedValue, Validators.compose([ValidationService.isNumber, Validators.required])],
      productId: [this.currentProductName],
    });

    this.displayAddUpdateModal = true;
  }

  deleteProductUde(d) {
    let __this = this;
    swal({
        title: 'Are you sure?',
        text: "This cannot be reversed. Are you sure you want to proceed?",
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No, cancel!',
        confirmButtonClass: 'btn btn-success btn-move',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: true,
    }).then(function () {


        __this.productService.deleteProductUde(d.productUdeId).subscribe((response) => {
            if (response.success == true) {
                __this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                __this.activeTabindex = 1;
                __this.refreshTabs(); 
                __this.udeByProductId(__this.currentProductId);
                this.displayAddUpdateModal = false;        
            }
        });

    }, function (dismiss) {
        if (dismiss === 'cancel') {
          __this.loadingService.hide();
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
        }
    });
}

  viewProductUde(d) {
    this.refreshTabs(); // Enable the "UDE IDS" tab
    this.activeTabindex = 1; // Switch to the "UDE IDS" tab
    this.isAddNew = true;
    this.udeByProductId(d.productId);
    this.currentProductId = d.productId;
    this.currentProductName = d.productName; // Set the current product name
  }

  submitForm(formObj) {
    this.loadingService.show();
    formObj.value.productId = this.currentProductId;
    let body = formObj.value;
    this.productService.addUpdateProductUde(body).subscribe((res) => {
      if (res.success == true) {
        this.loadingService.hide();
        swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
        this.activeTabindex = 1;
        this.refreshTabs(); 
        this.udeByProductId(this.currentProductId);
        formObj.value = [];
        this.displayAddUpdateModal = false;
      } else {
        this.loadingService.hide();
        swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
      }
    }, (err: any) => {
      this.loadingService.hide();
      swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
    });
  }
}
