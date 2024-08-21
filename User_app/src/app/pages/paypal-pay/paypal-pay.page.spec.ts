/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaypalPayPage } from './paypal-pay.page';

describe('PaypalPayPage', () => {
  let component: PaypalPayPage;
  let fixture: ComponentFixture<PaypalPayPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PaypalPayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
