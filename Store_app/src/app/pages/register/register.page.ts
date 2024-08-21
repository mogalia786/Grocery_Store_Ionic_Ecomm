/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { VerifyPage } from '../verify/verify.page';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { mobileLogin } from 'src/app/interfaces/mobileLogin';
import { SelectCountryPage } from '../select-country/select-country.page';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { register } from 'swiper/element/bundle';
import Swiper from 'swiper';

register();
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  @ViewChild("swiper") swiper?: ElementRef<{ swiper: Swiper }>
  slideID = 0;
  email: any = '';
  loginWithPhoneOTP: mobileLogin = {
    country_code: '',
    mobile: ''
  };

  first_name: any = '';
  last_name: any = '';
  password: any = '';
  confirm_password: any = '';
  store_name: any = '';
  store_cover: any = '';
  store_address: any = '';
  store_lat: any = '';
  store_lng: any = '';
  zipcode: any = '';
  city_id: any = '';
  open_time: any = '';
  close_time: any = '';
  constructor(
    public util: UtilService,
    public api: ApiService,
    private modalCtrl: ModalController,
    private iab: InAppBrowser,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController
  ) {
    setTimeout(() => {
      this.loginWithPhoneOTP.country_code = '+' + this.util.default_country_code;
    }, 1000);
  }

  saveBasic() {
    if (this.first_name == '' || this.first_name == null || this.last_name == '' || this.last_name == null || this.password == '' || this.password == null || this.confirm_password == '' || this.confirm_password == null) {
      this.util.errorToast('All fields are required');
      return false;
    }
    if (this.password != this.confirm_password) {
      this.util.errorToast('Password mismatched');
      return false;
    }
    this.next();
  }

  saveStoreInfo() {
    if (this.store_cover == '' || this.store_cover == null || this.store_name == '' || this.store_name == null || this.store_address == '' || this.store_address == null ||
      this.store_lat == '' || this.store_lat == null || this.store_lng == '' || this.store_lng == null || this.zipcode == null || this.zipcode == '' || this.city_id == '' || this.city_id == null ||
      this.open_time == '' || this.open_time == null || this.close_time == '' || this.close_time == null) {
      this.util.errorToast('All fields are required');
      return false;
    }
    console.log('save store info');
    const param = {
      email: this.email,
      first_name: this.first_name,
      last_name: this.last_name,
      mobile: this.loginWithPhoneOTP.mobile,
      cover: this.store_cover,
      country_code: this.loginWithPhoneOTP.country_code,
      password: this.password,
      name: this.store_name,
      lat: this.store_lat,
      lng: this.store_lng,
      address: this.store_address,
      open_time: this.open_time,
      close_time: this.close_time,
      cid: this.city_id,
      zipcode: this.zipcode
    };
    this.util.show();
    this.api.post_public('v1/join_store/saveStore', param).then((data: any) => {
      console.log(data);
      this.util.hide();
      if (data && data.status && data.status == 200 && data.data) {
        this.util.showToast('Request Saved', 'success', 'bottom');
        this.sendMail();
        this.util.onBack();
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

  openWeb() {
    this.iab.create('https://www.mapcoordinates.net/en', '_system');
  }

  async openFirebaseAuthModal() {
    const options: InAppBrowserOptions = {
      location: 'no',
      clearcache: 'yes',
      zoom: 'yes',
      toolbar: 'yes',
      closebuttoncaption: 'close'
    };
    const param = {
      mobile: this.loginWithPhoneOTP.country_code + this.loginWithPhoneOTP.mobile
    }
    const browser = this.iab.create(this.api.baseUrl + 'v1/auth/firebaseauth?' + this.api.JSON_to_URLEncoded(param), '_blank', options);
    console.log('opended');
    console.log('browser=>');
    browser.on('loadstop').subscribe(event => {
      console.log('event?;>11', event);
      const navUrl = event.url;
      if (navUrl.includes('success_verified')) {
        const urlItems = new URL(event.url);
        console.log(urlItems);
        this.next();
        browser.close();
      }
    });
    console.log('browser=> end');
  }

  ngOnInit() {
  }

  goBack() {
    if (this.slideID <= 0) {
      this.util.onBack();
    } else {
      this.slideID = this.slideID - 1;
      this.swiper?.nativeElement.swiper.slidePrev();
    }
  }

  async openCountry() {
    if (this.util.countrys && this.util.countrys.length && this.util.countrys.length > 1) {
      console.log('open ccode');
      const modal = await this.modalCtrl.create({
        component: SelectCountryPage,
        backdropDismiss: false,
        showBackdrop: true,
      });
      modal.onDidDismiss().then((data) => {
        console.log(data);
        if (data && data.role == 'selected') {
          console.log('ok');
          this.loginWithPhoneOTP.country_code = '+' + data.data;
        }
      });
      await modal.present();
    }

  }

  verifyPhone() {
    console.log(this.loginWithPhoneOTP);
    if (this.loginWithPhoneOTP.mobile == '' || this.loginWithPhoneOTP.mobile == null) {
      this.util.errorToast('Please Enter Phone');
      return false;
    }
    if (this.util.smsGateway == '2') { // Firebase OTP ON PHONE
      console.log('firebase');
      this.api.post_public('v1/auth/verifyPhoneForFirebaseNew', this.loginWithPhoneOTP).then((data: any) => {
        console.log(data);
        this.util.hide();
        if (data && data.status && data.status == 200 && data.data) {
          console.log('open firebase web version');
          this.openFirebaseAuthModal();

        }
      }, error => {
        this.util.hide();
        this.util.apiErrorHandler(error);
      }).catch((error) => {
        this.util.hide();
        console.log(error);
        this.util.apiErrorHandler(error);
      });
    } else {
      this.api.post_public('v1/otp/verifyPhoneNew', this.loginWithPhoneOTP).then((data: any) => {
        console.log(data);
        this.util.hide();
        if (data && data.status && data.status == 200 && data.data == true && data.otp_id) {
          this.openVerificationModal(data.otp_id, this.loginWithPhoneOTP.country_code + this.loginWithPhoneOTP.mobile);
        } else if (data && data.status && data.status == 500 && data.data == false) {
          this.util.errorToast(this.util.translate('Something went wrong'));
        }
      }, error => {
        this.util.hide();
        this.util.apiErrorHandler(error);
      }).catch((error) => {
        this.util.hide();
        console.log(error);
        this.util.apiErrorHandler(error);
      });
    }
  }

  async openVerificationModal(id: any, to: any) {
    const modal = await this.modalCtrl.create({
      component: VerifyPage,
      backdropDismiss: false,
      cssClass: 'custom-modal',
      componentProps: {
        'id': id,
        'to': to
      }
    });
    modal.onDidDismiss().then((data) => {
      console.log(data.data, data.role);
      if (data && data.data && data.role && data.role == 'ok') {
        this.next();
      }
    })
    return await modal.present();
  }

  next() {
    this.swiper?.nativeElement.swiper.slideNext();
    this.slideID = this.slideID + 1;
  }

  verifyEmail() {
    if (this.email == null || this.email == '') {
      this.util.errorToast('Please Enter Email ID');
      return false;
    }
    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailfilter.test(this.email)) {
      this.util.errorToast('Please enter valid email');
      return false;
    }
    const param = {
      email: this.email,
      subject: this.util.translate('Verification'),
    }
    this.util.show();
    this.api.post_public('v1/join_store/checkEmail', param).then((data: any) => {
      this.util.hide();
      console.log(data);
      if (data && data.status && data.status == 200 && data.data == true && data.otp_id) {
        // send otp from api
        this.openVerificationModal(data.otp_id, this.email);
      } else if (data && data.status && data.status == 500 && data.data == false) {
        this.util.errorToast(data.message);
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

  async updateProfile() {
    const actionSheet = await this.actionSheetController.create({
      header: this.util.translate('Choose from'),
      buttons: [{
        text: this.util.translate('Camera'),
        icon: 'camera',
        handler: () => {
          console.log('camera clicked');
          this.upload(CameraSource.Camera);
        }
      }, {
        text: this.util.translate('Gallery'),
        icon: 'images',
        handler: () => {
          console.log('gallery clicked');
          this.upload(CameraSource.Photos);
        }
      }, {
        text: this.util.translate('Cancel'),
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });

    await actionSheet.present();
  }

  async upload(source: CameraSource) {
    try {
      const image = await Camera.getPhoto({
        source,
        quality: 50,
        resultType: CameraResultType.Base64
      });
      console.log('image output', image);
      if (image && image.base64String) {
        const blobData = this.b64toBlob(image.base64String, `image/${image.format}`);
        this.util.show(this.util.translate('Uploading..'));
        this.api.uploadImage('v1/uploadImage', blobData, image.format).then((data) => {
          console.log('image upload', data);
          this.util.hide();
          if (data && data.status == 200 && data.success == true && data.data.image_name) {
            this.store_cover = data.data.image_name;
            console.log('this cover', this.store_cover);
          } else {
            console.log('NO image selected');
          }
        }, error => {
          console.log(error);
          this.util.hide();
          this.util.apiErrorHandler(error);
        }).catch(error => {
          console.log('error', error);
          this.util.hide();
          this.util.apiErrorHandler(error);
        });
      }
    } catch (error) {
      console.log(error);
      this.util.apiErrorHandler(error);
    }
  }

  b64toBlob(b64Data: any, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  sendMail() {
    const param = {
      email: this.email,
      subject: this.util.translate('Thanks for your interest in the') + ' ' + this.util.appName
    }
    this.api.post_public('v1/join_store/thankyouReply', param).then((data: any) => {
      console.log(data);
    }, error => {
      console.log(error);
    }).catch(error => {
      console.log(error);
    });
  }
}
