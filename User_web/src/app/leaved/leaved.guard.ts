/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UtilService } from '../services/util.service';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable()
export class LeaveGuard implements CanDeactivate<ComponentCanDeactivate> {
  constructor(
    public util: UtilService
  ) { }
  canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {
    console.log('ok closed this stufff');
    this.util.updatePaymentIssue();
    return true;
  }
};
