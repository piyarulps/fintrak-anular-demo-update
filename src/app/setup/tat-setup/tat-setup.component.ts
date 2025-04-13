import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { GlobalConfig } from 'app/shared/constant/app.constant';
import { LoadingService } from 'app/shared/services/loading.service';
import swal from 'sweetalert2';
import { CustomerFSCaptionService, CompanyService, ProductService } from '../services';

@Component({
  selector: 'app-tat-setup',
  templateUrl: './tat-setup.component.html',
  styleUrls: ['./tat-setup.component.scss']
})
export class TatSetupComponent implements OnInit {
  displayCreateEditModal: boolean;
  tatData: any;
  createEditFormGroup: any;
  productProcess: any[];

  constructor(private fb: FormBuilder, private loadingService: LoadingService,
    private custFSCaptionService: CustomerFSCaptionService, private productService: ProductService,) { }

  ngOnInit() {
    this.loadingService.show();
    this.getAllTATSetup();
    this.loadForms(); 
    this.getProductProcess();
    this.loadingService.hide();
  }

  showModalForm() {
    this.loadForms();
    this.displayCreateEditModal = true;
  }

  getAllTATSetup() {
    this.custFSCaptionService.getAllTATSetup().subscribe((data) => {
      this.tatData = data.result;
    }, (err) => {
    });
  }

 

  

  loadForms() {
    this.createEditFormGroup = this.fb.group({
      tatId:[''],
      productClassProcessId: ['', Validators.required],
      turnAroundTime: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      excludePublicHolidays: [false],
      
    });
  }



  editTATSetup(index) {
    this.displayCreateEditModal = true;

    let row = this.tatData[index];
    this.createEditFormGroup = this.fb.group({
      tatId: [row.tatId],
      productClassProcessId: [row.productClassProcessId, Validators.required],
      turnAroundTime: [row.turnAroundTime, Validators.required],
      excludePublicHolidays: [row.excludePublicHolidays],
     
    });
  }

  deleteTATSetup(index) {
    let row = this.tatData[index];

    this.custFSCaptionService.deleteTATSetup(row.tatId).subscribe((res) => {
      this.loadingService.hide();
      this.displayCreateEditModal = false;
      if (res.success === true) {
        swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
      } else {
        swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
      }
      this.getAllTATSetup();
     
    }, (err) => {
      swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
      this.loadingService.hide();
    });
  }
  getProductProcess() {
    this.productService.getAllProductProcess().subscribe((response:any) => {
        this.productProcess = response.result;
        
    })
}

  submitTATSetupForm(form) {
    this.loadingService.show();
    let bodyObj = {
      tatId: form.value.tatId,
      productClassProcessId: form.value.productClassProcessId,
      turnAroundTime: form.value.turnAroundTime,
      excludePublicHolidays: form.value.excludePublicHolidays,
      
    };

    let selectedId = form.value.tatId;
    if (selectedId === '') { // creating a new group
      this.custFSCaptionService.addTATSetup(bodyObj).subscribe((res) => {
        this.loadingService.hide();
        if (res.success === true) {
          swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
          this.displayCreateEditModal = false;
        } else {
          swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
        }
        this.getAllTATSetup();
      }, (err) => {
        swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
        this.loadingService.hide();
      });
    } else { // updating an existing group
      this.custFSCaptionService.updateTATSetup(bodyObj, selectedId).subscribe((res) => {
        this.loadingService.hide();
        this.displayCreateEditModal = false;
        if (res.success === true) {
          swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
        } else {
          swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
        }
        this.getAllTATSetup();
      }, (err) => {
        swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
        this.loadingService.hide();
      });
    }
    this.loadForms();
    // this.displayCreateEditModal = false;
  }
}


