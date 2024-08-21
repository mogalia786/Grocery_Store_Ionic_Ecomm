/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Ionic7 Capacitor
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppSettingsRoutingModule } from './app-settings-routing.module';
import { AppSettingsComponent } from './app-settings.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    AppSettingsComponent
  ],
  imports: [
    CommonModule,
    AppSettingsRoutingModule,
    FormsModule,
    NgxSpinnerModule,
    ModalModule.forRoot(),
    NgxSkeletonLoaderModule.forRoot({ animation: 'progress-dark' }),
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class AppSettingsModule { }
