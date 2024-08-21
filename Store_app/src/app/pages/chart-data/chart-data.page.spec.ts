/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartDataPage } from './chart-data.page';

describe('ChartDataPage', () => {
  let component: ChartDataPage;
  let fixture: ComponentFixture<ChartDataPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ChartDataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
