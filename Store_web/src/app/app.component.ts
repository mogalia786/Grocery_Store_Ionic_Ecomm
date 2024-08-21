/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Ionic7 Capacitor
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { IconSetService } from '@coreui/icons-angular';
import { brandSet, flagSet, freeSet } from '@coreui/icons';
import { Title } from '@angular/platform-browser';
import { ApiService } from './services/api.service';
import { UtilService } from './services/util.service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'body',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  title = 'Ultimate Grocery Vendor Panel';

  constructor(
    private router: Router,
    private titleService: Title,
    private iconSetService: IconSetService,
    private api: ApiService,
    public util: UtilService,
  ) {
    titleService.setTitle(this.title);

    // iconSet singleton
    iconSetService.icons = { ...brandSet, ...flagSet, ...freeSet };

    const language = localStorage.getItem('translateKey');
    if (language && language != null && language != 'null') {
      this.api.post('v1/settings/getByLanguageIdWeb', { id: language }).then((data: any) => {
        console.log('by language', data);
        if (data && data.status && data.status == 200) {
          this.saveSettings(data);

        }
      }, error => {
        console.log(error);
        this.util.apiErrorHandler(error);
      }).catch(error => {
        console.log(error);
        this.util.apiErrorHandler(error);
      });
    } else {
      this.api.get_public('v1/settings/getDefaultWeb').then((data: any) => {
        console.log('by default', data);
        if (data && data.status && data.status == 200) {
          this.saveSettings(data);

        }
      }, error => {
        console.log(error);
        this.util.apiErrorHandler(error);
      }).catch(error => {
        console.log(error);
        this.util.apiErrorHandler(error);
      });
    }
    if (localStorage.getItem('uid') != null && localStorage.getItem('uid') && localStorage.getItem('uid') != '' && localStorage.getItem('uid') != 'null') {
      this.getUserByID();
    }
  }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });
  }

  getUserByID() {
    const body = {
      id: localStorage.getItem('uid')
    }
    this.api.post_private('v1/profile/getStoreFromId', body).then((data: any) => {
      console.log(">>>>><<<<<", data);
      if (data && data.success && data.status == 200) {
        this.util.userInfo = data.data;
        this.util.store = data.store;

      } else {
        localStorage.removeItem('uid');
        localStorage.removeItem('token');
      }
    }, err => {
      localStorage.removeItem('uid');
      localStorage.removeItem('token');
      this.util.userInfo = null;
      console.log(err);
    }).catch((err) => {
      localStorage.removeItem('uid');
      localStorage.removeItem('token');
      this.util.userInfo = null;
      console.log(err);
    });
  }

  saveSettings(data: any) {
    const lang = data && data.data && data.data.language ? data.data.language : null;
    if (lang && lang != null) {
      this.util.translations = JSON.parse(lang.content);
      localStorage.setItem('translateKey', lang.id);
    }
    const settings = data && data.data && data.data.settings ? data.data.settings : null;
    if (settings) {
      this.util.appLogo = settings.logo;
      this.util.direction = settings.appDirection;
      this.util.app_status = settings.app_status == 1 ? true : false;
      this.util.app_color = settings.app_color;
      this.util.findType = settings.findType;
      this.util.login_style = settings.login_style;
      this.util.register_style = settings.register_style;
      this.util.currecny = settings.currencySymbol;
      this.util.cside = settings.currencySide;
      this.util.makeOrders = settings.makeOrders;
      this.util.smsGateway = settings.sms_name;
      this.util.user_login_with = settings.store_login;
      this.util.user_verification = settings.user_verify_with;
      this.util.reset_pwd = settings.reset_pwd;
      this.util.driver_assign = settings.driver_assign;

      localStorage.setItem('theme', 'primary');
      if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(settings.country_modal)) {
        this.util.countrys = JSON.parse(settings.country_modal);
      }
      this.util.default_country_code = settings && settings.default_country_code ? settings.default_country_code : '91';
      document.documentElement.dir = this.util.direction;
    }

    const general = data && data.data && data.data.general ? data.data.general : null;
    if (general) {
      this.util.appName = general.name;
      this.util.general = general;
    }

    this.util.allLanguages = data.data.allLanguages;

    const served = data && data.data && data.data.we_served ? data.data.we_served : null;
    if (served) {
      this.util.servingCities = served;
    }

    const adminInfo = data && data.data && data.data.support ? data.data.support : null;
    if (adminInfo) {
      this.util.adminInfo = adminInfo;
    }
    console.log(this.util);
    // this.util.navigateRoot('');
  }
}
