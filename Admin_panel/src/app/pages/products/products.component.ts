/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Ionic7 Capacitor
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  @ViewChild('myModal3') public myModal3: ModalDirective;
  dummy: any[] = [];
  list: any[] = [];
  totalProducts: any = 0;
  page: number = 1;
  inputString: any = '';
  cities: any[] = [];
  selectedCities: any = '';
  constructor(
    public util: UtilService,
    public api: ApiService,
    private router: Router
  ) {
    this.getList();
  }

  getList() {
    this.dummy = Array(10);
    this.list = [];
    this.api.get_private('v1/products/getAll?page=' + (this.page - 1)).then((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status && data.status == 200 && data.data && data.data.length) {
        this.list = data.data;
        this.totalProducts = data.totalProducts;
        console.log(Object.keys(this.list[0]));
      }
    }, error => {
      console.log(error);
      this.dummy = [];
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.dummy = [];
      this.util.apiErrorHandler(error);
    });
  }

  pageChange(event: any) {
    console.log(event);
    this.page = event;
    console.log('page->', this.page)
    this.getList();
  }


  ngOnInit(): void {
  }


  changeStatus(item: any) {
    console.log(item);
    Swal.fire({
      title: this.util.translate('Are you sure?'),
      text: this.util.translate('To update this item?'),
      icon: 'question',
      showConfirmButton: true,
      confirmButtonText: this.util.translate('Yes'),
      showCancelButton: true,
      cancelButtonText: this.util.translate('Cancel'),
      backdrop: false,
      background: 'white'
    }).then((data) => {
      if (data && data.value) {
        console.log('update it');
        const body = {
          id: item.id,
          status: item.status == 0 ? 1 : 0
        };
        console.log("========", body);
        this.util.show();
        this.api.post_private('v1/products/updateStatus', body).then((data: any) => {
          this.util.hide();
          console.log("+++++++++++++++", data);
          if (data && data.status && data.status == 200 && data.success) {
            this.util.success(this.util.translate('Status Updated !'));
            this.getList();
          }
        }, error => {
          this.util.hide();
          console.log('Error', error);
          this.util.apiErrorHandler(error);
        }).catch(error => {
          this.util.hide();
          console.log('Err', error);
          this.util.apiErrorHandler(error);
        });
      }
    });
    //products/updateStatus
  }

  search() {
    if (this.inputString != '') {
      console.log('search data', this.inputString);
      this.totalProducts = 0;
      this.page = 0;
      this.dummy = Array(10);
      this.list = [];
      this.api.post_private('v1/products/searchAdminWithId', { id: this.inputString }).then((data: any) => {
        this.dummy = [];
        if (data && data.status && data.status == 200 && data.success) {
          console.log(">>>>>", data);
          if (data && data.data.length > 0) {
            this.list = data.data;
            console.log("---", this.list);
          }
        }
      }, error => {
        this.dummy = [];
        console.log('Error', error);
        this.util.apiErrorHandler(error);
      }).catch(error => {
        this.dummy = [];
        console.log('Err', error);
        this.util.apiErrorHandler(error);
      });
    }
  }

  clean() {
    this.inputString = '';
    this.page = 1;
    this.getList();
  }

  inHome(item: any) {
    const body = {
      id: item.id,
      in_home: item.in_home == 0 ? 1 : 0
    };
    console.log("========", body);
    this.util.show();
    this.api.post_private('v1/products/updateHome', body).then((data: any) => {
      this.util.hide();
      console.log("+++++++++++++++", data);
      if (data && data.status && data.status == 200 && data.success) {
        this.util.success(this.util.translate('Status Updated !'));
        this.getList();
      }
    }, error => {
      this.util.hide();
      console.log('Error', error);
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.util.hide();
      console.log('Err', error);
      this.util.apiErrorHandler(error);
    });
  }

  inOffers(item: any) {
    const body = {
      id: item.id,
      in_offer: item.in_offer == 0 ? 1 : 0
    };
    console.log("========", body);
    this.util.show();
    this.api.post_private('v1/products/updateOffers', body).then((data: any) => {
      this.util.hide();
      console.log("+++++++++++++++", data);
      if (data && data.status && data.status == 200 && data.success) {
        this.util.success(this.util.translate('Status Updated !'));
        this.getList();
      }
    }, error => {
      this.util.hide();
      console.log('Error', error);
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.util.hide();
      console.log('Err', error);
      this.util.apiErrorHandler(error);
    });
  }

  addNew() {
    this.router.navigate(['manage-store']);
  }

  exportCSV() {
    let data: any = [];
    this.list.forEach(element => {
      const info = {
        'id': this.util.replaceWithDot(element.id),
        'name': this.util.replaceWithDot(element.name),
        'cover': this.util.replaceWithDot(element.cover),
        'original_price': this.util.replaceWithDot(element.original_price),
        'sell_price': this.util.replaceWithDot(element.sell_price),
        'certificate_url': this.util.replaceWithDot(element.certificate_url),
        'in_stoke': this.util.replaceWithDot(element.in_stoke),
        'rating': this.util.replaceWithDot(element.rating),
        'total_rating': this.util.replaceWithDot(element.total_rating),
        'in_home': this.util.replaceWithDot(element.in_home),
        'in_offer': this.util.replaceWithDot(element.in_offer),
      }
      data.push(info);
    });
    const name = 'products';
    this.util.downloadFile(data, name, ['id', 'name', 'cover', 'original_price', 'sell_price', 'in_stoke', 'rating', 'total_rating', 'in_home', 'in_offer']);
  }

  saveType() {
    this.myModal3.hide();
  }

  uploadCSV(files: any) {
    console.log('fle', files);
    if (files.length == 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/text\/*/) == null) {
      return;
    }

    if (files) {
      console.log('ok');
      this.util.show();
      this.api.uploaCSV(files, 'v1/products/importData').subscribe((data: any) => {
        console.log('==>>>>>>', data.data);
        this.util.hide();
        this.myModal3.hide();
        this.util.success('Uploaded');
        this.getList();
      }, err => {
        console.log(err);
        this.util.hide();
        this.util.apiErrorHandler(err);
      });
    } else {
      console.log('no');
    }
  }

  importCSV() {
    this.myModal3.show();
  }

  downloadSample() {
    window.open('assets/sample/products.csv', '_blank');
  }

}
