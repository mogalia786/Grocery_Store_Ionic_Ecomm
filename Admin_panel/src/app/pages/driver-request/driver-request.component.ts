/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Ionic7 Capacitor
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-driver-request',
  templateUrl: './driver-request.component.html',
  styleUrls: ['./driver-request.component.scss']
})
export class DriverRequestComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  dummy: any[] = [];
  list: any[] = [];
  dummyList: any[] = [];
  page: number = 1;
  appId: any = '';
  message: any = '';

  ckeConfig: any;
  constructor(
    public util: UtilService,
    public api: ApiService,
  ) {
    this.ckeConfig = {
      height: 300,
      language: "en",
      allowedContent: true,
      toolbar: [
        { name: "editing", items: ["Scayt", "Find", "Replace", "SelectAll"] },
        { name: "clipboard", items: ["Cut", "Copy", "Paste", "PasteText", "PasteFromWord", "-", "Undo", "Redo"] },
        { name: "links", items: ["Link", "Unlink", "Anchor"] },
        { name: "tools", items: ["Maximize", "ShowBlocks", "Preview", "Print", "Templates"] },
        { name: "document", items: ["Source"] },
        { name: "insert", items: ["Image", "Table", "HorizontalRule", "SpecialChar", "Iframe", "imageExplorer"] },
        { name: "basicstyles", items: ["Bold", "Italic", "Underline", "Strike", "Subscript", "Superscript", "-", "RemoveFormat"] },
        { name: "paragraph", items: ["NumberedList", "BulletedList", "-", "Outdent", "Indent", "CreateDiv", "-", "Blockquote"] },
        { name: "justify", items: ["JustifyLeft", "JustifyCenter", "JustifyRight", "JustifyBlock"] },
        { name: "styles", items: ["Styles", "Format", "FontSize", "-", "TextColor", "BGColor"] }
      ]
    };
    this.getStores();
  }
  ngOnInit(): void {
  }

  getStores() {
    this.dummy = Array(5);
    this.list = [];
    this.dummyList = [];
    this.api.get_private('v1/driver_request/getNewRequest').then((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status && data.status == 200 && data.data && data.data.length) {
        this.list = data.data;
        this.dummyList = data.data;
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

  exportCSV() {
    let data: any = [];
    this.list.forEach(element => {
      const info = {
        'id': this.util.replaceWithDot(element.id),
        'name': this.util.replaceWithDot(element.first_name) + ' ' + this.util.replaceWithDot(element.last_name),
        'city_name': this.util.replaceWithDot(element.city_name),
        'address': this.util.replaceWithDot(element.address),
      }
      data.push(info);
    });
    const name = 'drivers';
    this.util.downloadFile(data, name, ['id', 'name', 'city_name', 'address']);
  }

  search(str: any) {
    this.resetChanges();
    console.log('string', str);
    this.list = this.filterItems(str);
  }

  protected resetChanges = () => {
    this.list = this.dummyList;
  }

  filterItems(searchTerm: any) {
    return this.list.filter((item) => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  setFilteredItems() {
    console.log('clear');
    this.list = [];
    this.list = this.dummyList;
  }

  getTime(time: any) {
    return moment('1997-07-15 ' + time).format('hh:mm A');
  }

  accept(item: any) {
    console.log(item);
    this.appId = item.id;
    const param = {
      id: this.appId,
      subject: this.util.translate('Your application is accepted'),
      status: 1,
    }
    console.log(param);
    this.util.show();
    this.api.post_private('v1/driver_request/acceptRequest', param).then((data: any) => {
      console.log(data);
      this.util.hide();
      if (data && data.status && data.status == 200 && data.data) {
        this.getStores();
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

  reject(item: any) {
    console.log(item);
    console.log('update it');
    this.appId = item.id;
    this.myModal.show();
  }

  onReject() {
    if (this.message == '' || this.message == null) {
      this.util.error('Please enter message');
      return false;
    }
    const param = {
      id: this.appId,
      subject: this.util.translate('Your application is rejected'),
      status: 1,
      message: this.message
    }
    console.log(param);
    this.util.show();
    this.api.post_private('v1/driver_request/rejectRequest', param).then((data: any) => {
      console.log(data);
      this.util.hide();
      if (data && data.status && data.status == 200 && data.data) {
        this.getStores();
        this.message = '';
        this.myModal.hide();
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
}
