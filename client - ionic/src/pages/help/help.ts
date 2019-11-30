import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { InfoProvider } from '../../providers/info/info';
import * as text from './text'
/**
 * Generated class for the HelpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-help',
  templateUrl: 'help.html',
})
export class HelpPage {

  constructor (
     public navCtrl: NavController,
     public navParams: NavParams,  
     public info: InfoProvider,
     public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HelpPage');
  }

  openDialogHelp_1() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Tại sao không ai trả lời tôi');
    alert.setMessage(text.text1);
    alert.addButton('OK');
    alert.present();
  }

  openDialogHelp_2() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Tôi có thể làm gì với những thành viên không mong đợi?');
    alert.setMessage(text.text2);
    alert.addButton('OK');
    alert.present();
  }

  openDialogHelp_3() {
    let alert = this.alertCtrl.create();
    alert.setTitle('FindMyLove có thực sự miễn phí?');
    alert.setMessage(text.text3);
    alert.addButton('OK');
    alert.present();
  }

  openDialogHelp_4() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Làm thế nào để xóa tài khoản của tôi?');
    alert.setMessage(text.text4);
    alert.addButton('OK');
    alert.present();
  }

}
