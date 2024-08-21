/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectDriversPage } from './select-drivers.page';

describe('SelectDriversPage', () => {
  let component: SelectDriversPage;
  let fixture: ComponentFixture<SelectDriversPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SelectDriversPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
