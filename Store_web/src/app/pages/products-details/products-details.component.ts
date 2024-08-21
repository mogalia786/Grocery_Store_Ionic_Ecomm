/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Ionic7 Capacitor
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-products-details',
  templateUrl: './products-details.component.html',
  styleUrls: ['./products-details.component.scss']
})
export class ProductsDetailsComponent implements OnInit {
  @ViewChild('content') public content: ModalDirective;
  @ViewChild('contentSub') public contentSub: ModalDirective;
  @ViewChild('contentVarient') public contentVarient: ModalDirective;

  isNew: boolean;
  cateId: any = '';
  cateName: any = '';

  subId: any = '';
  subName: any = '';

  name: any = '';
  realPrice: any;
  sellPrice: any;
  discount: any;
  description: any;
  is_single: any = 0;
  status: any = 1;
  coverImage: any = '';
  veg: any = 0;

  image1: any;
  image2: any;
  image3: any;
  image4: any;
  image5: any;
  image6: any;

  have_gram: any = 0;
  gram: any = 0;
  have_kg: any = 0;
  kg: any = 0;
  have_pcs: any = 0;
  pcs: any = 0;
  have_liter: any = 0;
  liter: any = 0;
  have_ml: any = 0;
  ml: any = 0;
  exp_date: any;

  in_stoke: any = 1;
  in_offer: any = 0;
  key_features: any = '';
  disclaimer: any = '';

  id: any;

  variations: any[] = [];
  size: any = 0;
  category: any[] = [];
  dummyCates: any[] = [];
  cateString: any = '';
  subCates: any = [] = [];
  dummySubCates: any[] = [];
  subString: any = '';

  variant_title: any = '';
  variant_price: any;
  variant_discount: any;
  variatIndex: any;
  subIndex: any;

  sub: boolean;
  constructor(
    public util: UtilService,
    public api: ApiService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.route.queryParams.subscribe((data: any) => {
      console.log(data);
      if (data && data.id) {
        this.id = data.id;
        this.isNew = false;
        this.getProduct();
      } else {
        this.isNew = true;
        this.getCates();
      }
    });
  }

  getCates() {
    this.api.get_private('v1/categories/getActiveItem').then((cates: any) => {
      console.log(cates);
      if (cates && cates.status == 200 && cates.data && cates.data.length) {
        console.log(cates.data);
        this.category = cates.data;
        this.dummyCates = cates.data;
      } else {
        this.util.error(this.util.translate('No category found'));
      }
    }, error => {
      this.util.error(this.util.translate('Something went wrong'));
      console.log(error);
    });
  }

  getProduct() {
    const param = {
      id: this.id
    };
    this.util.show();
    this.api.post_private('v1/products/getByIdStore', param).then((data: any) => {
      console.log(data);
      this.util.hide();
      if (data && data.status && data.status == 200 && data.data) {
        const info = data.data;
        console.log('product ->', info);
        this.cateId = info.cate_id;
        this.subId = info.sub_cate_id;
        this.name = info.name;
        this.description = info.descriptions;
        this.coverImage = info.cover;
        this.key_features = info.key_features;
        this.disclaimer = info.disclaimer;
        this.discount = info.discount;
        this.exp_date = info.exp_date;
        this.gram = info.gram;
        this.have_gram = info.have_gram;
        this.kg = info.kg;
        this.have_kg = info.have_kg;
        this.liter = info.liter;
        this.have_liter = info.have_liter;
        this.ml = info.ml;
        this.have_ml = info.have_ml;
        this.pcs = info.pcs;
        this.have_pcs = info.have_pcs;
        this.in_offer = info.in_offer;
        this.in_stoke = info.in_stoke;
        this.is_single = info.is_single;
        this.veg = info.kind;
        this.realPrice = parseFloat(info.original_price);
        this.sellPrice = parseFloat(info.sell_price);
        this.status = info.status;
        this.size = info && info.size && info.size == 1 ? 1 : 0;
        if (info && info.variations && info.variations != '') {
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(info.variations)) {
            this.variations = JSON.parse(info.variations);
          }
        }
        if (info.images) {
          const images = JSON.parse(info.images);
          console.log('images===>>>', images);
          if (images[0]) {
            this.image1 = images[0];
          }
          if (images[1]) {
            this.image2 = images[1];
          }
          if (images[2]) {
            this.image3 = images[2];
          }
          if (images[3]) {
            this.image4 = images[3];
          }
          if (images[4]) {
            this.image5 = images[4];
          }
          if (images[5]) {
            this.image6 = images[5];
          }
        }
        this.api.get_private('v1/categories/getActiveItem').then((cates: any) => {
          console.log(cates);
          if (cates && cates.status == 200 && cates.data && cates.data.length) {
            console.log(cates.data);
            this.category = cates.data;
            this.dummyCates = cates.data;
            const name = cates.data.filter((x: any) => x.id == this.cateId);
            console.log('cate name=-===>>>', name);
            this.cateName = name[0].name;
          } else {
            this.util.error(this.util.translate('No category found'));
          }
        }, error => {
          this.util.error(this.util.translate('Something went wrong'));
          console.log(error);
        });

        const subCate = {
          id: info.cate_id
        };
        this.api.post_private('v1/subcate/getByCId', subCate).then((sub: any) => {
          console.log(sub);
          if (sub && sub.status == 200 && sub.data && sub.data.length) {
            // this.category = sub.data;
            console.log(sub);
            const name = sub.data.filter((x: any) => x.id == this.subId);
            console.log('cate name=-===>>>', name);
            this.subName = name[0].name;
          } else {
            this.util.error(this.util.translate('No category found'));
          }
        }, error => {
          this.util.error(this.util.translate('Something went wrong'));
        });

      }
    }, error => {
      this.util.hide();
      this.util.error(this.util.translate('Something went wrong'));
      console.log(error);
    }).catch(error => {
      this.util.hide();
      console.log(error);
      this.util.error(this.util.translate('Something went wrong'));
    });
  }

  ngOnInit(): void {
  }

  onDicount(value: any) {
    value = parseFloat(value);
    console.log(value);
    if (this.realPrice && value <= 99) {
      this.percentage(this.discount, this.realPrice);
    } else {
      this.discount = 0;
      this.percentage(this.discount, this.realPrice);
    }
  }

  onRealPrice(value: any) {
    value = parseFloat(value);
    console.log(value);
    if (this.sellPrice && value > 1) {
      this.percentage(this.discount, this.realPrice);
    }
  }

  percentage(percent: any, total: any) {
    this.sellPrice = 0;
    const price = ((percent / 100) * total);
    this.sellPrice = this.realPrice - price;
  }
  openCate() {

    try {
      this.content.show();

    } catch (error) {
      console.log(error);
    }
  }

  openSub() {
    if (this.cateId && this.cateName) {
      console.log(status);
      const param = {
        id: this.cateId
      };
      this.util.show();
      this.api.post_private('v1/subcate/getByCId', param).then((data: any) => {
        this.util.hide();
        console.log(data);
        if (data && data.status == 200 && data.data && data.data.length) {
          this.subCates = data.data;
          this.dummySubCates = data.data;
        } else {
          this.util.error(this.util.translate('No category found'));
        }
      }, error => {
        this.util.hide();
        this.util.error(this.util.translate('Something went wrong'));
        console.log(error);
      });
      try {
        this.contentSub.show();
      } catch (error) {
        console.log(error);
      }
    } else {
      this.util.error('Please select category first');
    }

  }

  close() {
    console.log('category');
    if (this.cateId) {
      const name = this.category.filter(x => x.id == this.cateId);
      console.log('name', name[0].name);
      this.cateName = name[0].name;
      this.subId = '';
      this.subName = '';
      this.subCates = [];
      this.dummySubCates = [];
    }
    this.content.hide();
    // this.modalService.dismissAll();
  }

  close2() {
    console.log('sub categoryt');
    if (this.subId) {
      const name = this.subCates.filter((x: any) => x.id == this.subId);
      console.log('name', name[0].name);
      this.subName = name[0].name;
    }
    this.contentSub.hide();
    // this.modalService.dismissAll();
  }

  searchCates(str: any) {
    console.log(str);
    this.category = this.dummyCates.filter((ele: any) => {
      return ele.name.toLowerCase().includes(str.toLowerCase());
    });
  }

  searchSubCate(str: any) {
    console.log(str);
    this.subCates = this.dummySubCates.filter((ele: any) => {
      return ele.name.toLowerCase().includes(str.toLowerCase());
    });
  }

  changeSize(event: any) {
    console.log(event);
    this.size = event;
    console.log(this.size);
    if (this.size == 1) {
      const items = this.variations.filter(x => x.title == 'size');
      console.log('length', items);
      if (!items.length) {
        const item = {
          title: 'size',
          type: 'radio',
          items: []
        };
        this.variations.push(item);
        console.log(this.variations);
      }
    } else {
      this.variations = this.variations.filter(x => x.title != 'size');
      console.log(this.variations);
    }
  }


  async addItem(index: any) {
    console.log(this.variations[index]);
    this.sub = false;
    this.variatIndex = index;
    try {

      this.contentVarient.show();
    } catch (error) {
      console.log(error);
    }
  }

  delete(item: any) {
    console.log(item);
    if (item.title == 'size') {
      this.size = false;
    }
    this.variations = this.variations.filter(x => x.title != item.title);
  }

  close3() {
    if (this.sub == false) {
      if (this.variant_title && this.variant_price && this.variant_price != 0 && this.variant_price > 0) {
        const item = {
          title: this.variant_title,
          price: parseFloat(this.variant_price),
          discount: this.variant_discount && this.variant_discount ? parseFloat(this.variant_discount) : 0
        };
        this.variations[this.variatIndex].items.push(item);
        this.contentVarient.hide();
        this.variant_title = '';
        this.variant_price = 0;
        this.variant_discount = 0;
        this.variatIndex = '';
      } else {
        this.util.error(this.util.translate('Please add title and price'));
      }
    } else {
      if (this.variant_title && this.variant_price && this.variant_price != 0 && this.variant_price > 0) {
        this.variations[this.variatIndex].items[this.subIndex].title = this.variant_title;
        this.variations[this.variatIndex].items[this.subIndex].price = parseFloat(this.variant_price),
          this.variations[this.variatIndex].items[this.subIndex].discount =
          this.variant_discount && this.variant_discount ? parseFloat(this.variant_discount) : 0;
        this.contentVarient.hide();
      } else {
        this.util.error(this.util.translate('Please add title and price'));
      }
    }

  }

  deleteSub(index: any, item: any) {
    console.log(index);
    console.log(item);
    const selected = this.variations[index].items;
    console.log('selected', selected);
    const data = selected.filter((x: any) => x.title != item.title);
    console.log(data);
    this.variations[index].items = data;
    console.log('done', this.variations);
  }

  async editSub(index: any, items: any, subIndex: any) {
    this.sub = true;
    this.variatIndex = index;
    this.subIndex = subIndex;
    this.variant_title = this.variations[index].title;
    this.variant_price = this.variations[index].items[subIndex].price;
    this.variant_discount = this.variations[index].items[subIndex].discount;
    try {

      this.contentVarient.show();
    } catch (error) {
      console.log(error);
    }
  }

  others(files: any, num: any) {
    if (files.length == 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    if (files) {
      console.log('ok');
      this.util.show();
      this.api.uploadFile(files).subscribe((data: any) => {
        console.log('==>>', data);
        this.util.hide();
        if (data && data.status == 200 && data.data) {
          if (num == 1 || num == 1) {
            this.image1 = data.data.image_name;
          }
          if (num == 2 || num == '2') {
            this.image2 = data.data.image_name;
          }
          if (num == 3 || num == '3') {
            this.image3 = data.data.image_name;
          }
          if (num == 4 || num == '4') {
            this.image4 = data.data.image_name;
          }
          if (num == 5 || num == '5') {
            this.image5 = data.data.image_name;
          }
          if (num == 6 || num == '6') {
            this.image6 = data.data.image_name;
          }
        }
      }, err => {
        console.log(err);
        this.util.hide();
      });
    } else {
      console.log('no');
    }
  }
  preview_banner(files: any) {

    console.log('fle', files);

    if (files.length == 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    if (files) {
      console.log('ok');
      this.util.show();
      this.api.uploadFile(files).subscribe((data: any) => {
        console.log('==>>', data);
        this.util.hide();
        if (data && data.status == 200 && data.data) {
          this.coverImage = data.data.image_name;
        }
      }, err => {
        console.log(err);
        this.util.hide();
      });
    } else {
      console.log('no');
    }
  }

  submit() {
    console.log('size-->>', this.size);
    console.log('submited', this.veg);
    if (!this.cateId || this.cateId == '') {
      this.util.error(this.util.translate('Please select category'));
      return false;
    }
    if (!this.subId || this.subId == '') {
      this.util.error(this.util.translate('Please select sub category'));
      return false;
    }
    if (!this.realPrice || this.realPrice == '') {
      this.util.error(this.util.translate('Please enter product price'));
      return false;
    }
    if (!this.description || this.description == '') {
      this.util.error(this.util.translate('Please enter product description'));
      return false;
    }
    if (!this.name || this.name == '') {
      this.util.error(this.util.translate('Please enter product name'));
      return false;
    }
    if (!this.coverImage || this.coverImage == '') {
      this.util.error(this.util.translate('Please add product image'));
      return false;
    }
    if (!this.exp_date || this.exp_date == '') {
      this.util.error(this.util.translate('Please product expire date'));
      return false;
    }
    if (this.isNew) {
      console.log('new');
      this.create();
    } else {
      console.log('update');
      this.update();
    }
  }

  update() {

    const image = [
      this.image1 ? this.image1 : '',
      this.image2 ? this.image2 : '',
      this.image3 ? this.image3 : '',
      this.image4 ? this.image4 : '',
      this.image5 ? this.image5 : '',
      this.image6 ? this.image6 : ''
    ];
    const param = {
      id: this.id,
      store_id: localStorage.getItem('uid'),
      cover: this.coverImage,
      name: this.name,
      images: JSON.stringify(image),
      original_price: this.realPrice,
      sell_price: this.sellPrice ? this.sellPrice : 0,
      discount: this.discount ? this.discount : 0,
      kind: this.veg,
      cate_id: this.cateId,
      sub_cate_id: this.subId,
      have_gram: this.have_gram,
      gram: this.have_gram == 1 ? this.gram : 0,
      have_kg: this.have_kg,
      kg: this.have_kg == 1 ? this.kg : 0,
      have_pcs: this.have_pcs,
      pcs: this.have_pcs == 1 ? this.pcs : 0,
      have_liter: this.have_liter,
      liter: this.have_liter == 1 ? this.liter : 0,
      have_ml: this.have_ml,
      ml: this.have_ml == 1 ? this.ml : 0,
      descriptions: this.description,
      exp_date: moment(this.exp_date).format('YYYY-MM-DD'),
      type_of: 1,
      in_stoke: this.in_stoke,
      status: this.status,
      in_offer: this.in_offer,
      key_features: this.key_features,
      disclaimer: this.disclaimer,
      is_single: this.is_single,
      size: this.size,
      variations: JSON.stringify(this.variations)
    };

    console.log('*****', param);

    this.util.show();
    this.api.post_private('v1/products/updateProducts', param).then((data: any) => {
      console.log(data);
      this.util.hide();
      if (data && data.status == 200) {
        this.location.back();
      } else {
        this.util.error(this.util.translate('Something went wrong'));
      }
    }, error => {
      this.util.hide();
      this.util.error(this.util.translate('Something went wrong'));
      console.log('error', error);
    });
  }

  create() {

    const image = [
      this.image1 ? this.image1 : '',
      this.image2 ? this.image2 : '',
      this.image3 ? this.image3 : '',
      this.image4 ? this.image4 : '',
      this.image5 ? this.image5 : '',
      this.image6 ? this.image6 : ''
    ];
    const param = {
      store_id: localStorage.getItem('uid'),
      cover: this.coverImage,
      name: this.name,
      images: JSON.stringify(image),
      original_price: this.realPrice,
      sell_price: this.sellPrice ? this.sellPrice : 0,
      discount: this.discount ? this.discount : 0,
      kind: this.veg,
      cate_id: this.cateId,
      sub_cate_id: this.subId,
      have_gram: this.have_gram,
      gram: this.have_gram == 1 ? this.gram : 0,
      have_kg: this.have_kg,
      kg: this.have_kg == 1 ? this.kg : 0,
      have_pcs: this.have_pcs,
      pcs: this.have_pcs == 1 ? this.pcs : 0,
      have_liter: this.have_liter,
      liter: this.have_liter == 1 ? this.liter : 0,
      have_ml: this.have_ml,
      ml: this.have_ml == 1 ? this.ml : 0,
      descriptions: this.description,
      exp_date: moment(this.exp_date).format('YYYY-MM-DD'),
      type_of: 1,
      in_stoke: this.in_stoke,
      status: this.status,
      in_offer: this.in_offer,
      key_features: this.key_features,
      disclaimer: this.disclaimer,
      is_single: this.is_single,
      in_home: 0,
      rating: 0,
      total_rating: 0,
      size: this.size,
      variations: JSON.stringify(this.variations)
    };

    console.log('*****', param);

    this.util.show();
    this.api.post_private('v1/products/saveProduct', param).then((data: any) => {
      console.log(data);
      this.util.hide();
      if (data && data.status == 200) {
        this.location.back();
      } else {
        this.util.error(this.util.translate('Something went wrong'));
      }
    }, error => {
      this.util.hide();
      this.util.error(this.util.translate('Something went wrong'));
      console.log('error', error);
    });
  }
}
