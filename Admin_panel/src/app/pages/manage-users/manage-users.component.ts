/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Ionic7 Capacitor
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {
  uid: any = '';
  name: any = '';
  cover: any = '';
  email: any = '';
  phone: any = '';

  orders: any[] = [];
  address: any[] = [];
  ratings: any[] = [];
  constructor(
    public util: UtilService,
    public api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe((data: any) => {
      console.log(data);
      if (data && data.id) {
        this.uid = data.id;
        this.getUserInfo();
      }
    });
  }



  getUserInfo() {
    this.util.show();
    this.api.post_private('v1/users/userInfoAdmin', { id: this.uid }).then((data: any) => {
      console.log(data);
      this.util.hide();
      if (data && data.status && data.status == 200) {
        const info = data.data;
        console.log('info', info);
        this.name = info.user.first_name + ' ' + info.user.last_name;
        this.cover = info.user.cover;
        this.email = info.user.email;
        this.phone = info.user.country_code + info.user.mobile;
        info.orders.forEach((element: any) => {
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.orders)) {
            element.orders = JSON.parse(element.orders);
            element.date_time = moment(element.date_time).format('dddd, MMMM Do YYYY');
            element.orders.forEach((order: any) => {
              if (order.variations && order.variations != '' && typeof order.variations == 'string') {
                order.variations = JSON.parse(order.variations);
                if (order["variant"] == undefined) {
                  order['variant'] = 0;
                }
              }
            });
          }
        });

        this.orders = info.orders;
        this.address = info.address;
        this.ratings = info.rating;


      }
    }, error => {
      console.log(error);
      this.util.hide();
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.util.hide();
      this.util.apiErrorHandler(error);
    });
  }
  ngOnInit(): void {
  }

  getImage() {
    return this.api.imageUrl + this.cover;
  }

  goToOrder(item: any) {
    const param: NavigationExtras = {
      queryParams: {
        id: item.id
      }
    }
    this.router.navigate(['order-details'], param);
  }

  deleteAddress(item: any) {
    console.log(item);
    Swal.fire({
      title: this.util.translate('Are you sure?'),
      text: this.util.translate('To delete this item?'),
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

        this.util.show();
        this.api.post_private('v1/address/destroy', { id: item.id }).then((data: any) => {
          console.log(data);
          this.util.hide();
          if (data && data.status && data.status == 200) {
            // this.getList();
            this.address = this.address.filter(x => x.id! = item.id);
          }
        }).catch(error => {
          console.log(error);
          this.util.hide();
          this.util.apiErrorHandler(error);
        });
      }
    });
  }

  getDate(date: any) {
    return moment(date).format('lll');
  }
}
