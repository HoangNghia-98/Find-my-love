import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { resolveDefinition } from '@angular/core/src/view/util';

/*
  Generated class for the MessageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MessageProvider {

  constructor(public http: HttpClient,public toastCtrl: ToastController) {
    console.log('Hello MessageProvider Provider');
  }
  errorToast(message){
    let toast = this.toastCtrl.create({
        message: message,
        showCloseButton: true,
        closeButtonText: 'Ok',
        cssClass: "error-toast"
    })
    toast.present();
  }
  async errorToastCustom(message){
    return new Promise( (resolve, reject) => {
      let toast = this.toastCtrl.create({
        message: message,
        showCloseButton: true,
        closeButtonText: 'Ok',
        cssClass: "error-toast"
      })
      toast.present();
      toast.onDidDismiss(() => {
        resolve(true)
      });
    })
    
  }
  successToast(message,time = 500){
    let toast = this.toastCtrl.create({
        message: message,
        duration:time,
        cssClass: "success-toast"
    })
    toast.present();
  }
}
