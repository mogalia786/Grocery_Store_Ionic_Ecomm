/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Grocery Delivery App Ionic7 Capacitor
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AngularFireAuth } from '@angular/fire/compat/auth/';
import * as firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl = environment.baseUrl + 'api/';
  imageUrl = environment.baseUrl + 'storage/images/';
  confirmationResult: firebase.default.auth.ConfirmationResult;
  constructor(
    private http: HttpClient,
    private fireAuth: AngularFireAuth
  ) {
    console.log("URL = ", this.baseUrl);
  }

  public signInWithPhoneNumber(recaptchaVerifier: any, phoneNumber: any) {
    return new Promise<any>((resolve, reject) => {
      console.log(phoneNumber);
      this.fireAuth.signInWithPhoneNumber(phoneNumber, recaptchaVerifier)
        .then((confirmationResult: any) => {
          this.confirmationResult = confirmationResult;
          resolve(confirmationResult);
        }).catch((error: any) => {
          console.log(error);
          reject('SMS not sent');
        });
    });
  }

  public async enterVerificationCode(code: any) {
    return new Promise<any>((resolve, reject) => {
      this.confirmationResult.confirm(code).then(async (result: any) => {
        console.log(result);
        const user = result.user;
        resolve(user);
      }).catch((error: any) => {
        reject(error.message);
      });

    });
  }

  uploadFile(files: File[]) {
    var formData = new FormData();
    Array.from(files).forEach(f => formData.append('image', f))
    return this.http.post(this.baseUrl + 'v1/' + 'uploadImage', formData)
  }

  uploaCSV(files: File[], url: any) {
    const header = {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
    };

    var formData = new FormData();
    Array.from(files).forEach(f => formData.append('csv_file', f))
    return this.http.post(this.baseUrl + url, formData, header)
  }

  uploadVideo(files: File[]) {
    var formData = new FormData();
    Array.from(files).forEach(f => formData.append('video', f));
    return this.http.post(this.baseUrl + 'v1/' + 'uploadVideo', formData)
  }

  public get_public(url: any) {
    return new Promise((resolve, reject) => {
      this.http.get(this.baseUrl + url).subscribe(res => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  public get_private(url: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
      };
      this.http.get(this.baseUrl + url, header).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  public post(url: any, body: any) {
    return new Promise((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      };
      const param = this.JSON_to_URLEncoded(body);
      this.http.post(this.baseUrl + url, param, header).subscribe((res) => {
        resolve(res);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  public post_private(url: any, body: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
      };
      const param = this.JSON_to_URLEncoded(body);
      console.log(param);
      this.http.post(this.baseUrl + url, param, header).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  public post_temp(url: any, body: any, temp: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Authorization', `Bearer ${temp}`)
      };
      const param = this.JSON_to_URLEncoded(body);
      console.log(param);
      this.http.post(this.baseUrl + url, param, header).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  JSON_to_URLEncoded(element: any, key?: any, list?: any) {
    let new_list = list || [];
    if (typeof element == "object") {
      for (let idx in element) {
        this.JSON_to_URLEncoded(
          element[idx],
          key ? key + "[" + idx + "]" : idx,
          new_list
        );
      }
    } else {
      new_list.push(key + "=" + encodeURIComponent(element));
    }
    return new_list.join("&");
  }

  public getLanguageJson(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.http.get('assets/i18n/untitle.json').subscribe(data => {
        resolve(data);
      }, error => {
        reject(error);
      })
    });
  }

  public getLocalAssets(name: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      };
      this.http.get('assets/jsons/' + name, header).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
}
