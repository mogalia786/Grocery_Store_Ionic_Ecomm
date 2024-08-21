
/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Ionic7 Capacitor
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  dummy: any[] = [];
  orders: any[] = [];
  totalOrders: any = 0;
  page: number = 1;
  constructor(
    public api: ApiService,
    public util: UtilService,
    private router: Router
  ) {
    this.getOrders();
  }

  getOrders() {
    const param = {
      id: localStorage.getItem('uid'),
      page: (this.page - 1)
    };
    this.dummy = Array(5);
    this.orders = [];
    this.api.post_private('v1/orders/getByStoreForWeb', param).then((data: any) => {
      console.log('by store id', data);
      this.dummy = [];

      if (data && data.status && data.status == 200 && data.data.length > 0) {
        data.data.forEach(async (element: any, index: any) => {
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.orders)) {
            element.orders = JSON.parse(element.orders);
            element.date_time = moment(element.date_time).format('dddd, MMMM Do YYYY');
            element.orders = await element.orders.filter((x: any) => x.store_id == localStorage.getItem('uid'));
            if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.status)) {
              const info = JSON.parse(element.status);
              const selected = info.filter((x: any) => x.id == localStorage.getItem('uid'));
              if (selected && selected.length) {
                element.orders.forEach((order: any) => {
                  if (order.variations && order.variations != '' && typeof order.variations == 'string') {
                    console.log('strings', element.id);
                    order.variations = JSON.parse(order.variations);
                    console.log(order['variant']);
                    if (order["variant"] == undefined) {
                      order['variant'] = 0;
                    }
                  }
                });

                const status = selected[0].status;
                element['storeStatus'] = status;
              }
            }
          }
        });
        this.orders = data.data;
        this.totalOrders = data.totalOrders;
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

  ngOnInit() {

  }

  goToOrder(item: any) {
    console.log(item);
    const navData: NavigationExtras = {
      queryParams: {
        id: item.id
      }
    };
    this.router.navigate(['/order-detail'], navData);
  }

  pageChange(event: any) {
    console.log(event);
    this.page = event;
    console.log('page->', this.page)
    this.getOrders();
  }
}
