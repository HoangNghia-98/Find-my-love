import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController,ViewController } from 'ionic-angular';
import { InfoProvider } from '../../providers/info/info';
import { SearchPage } from '../search/search';
import { UnlikePage } from '../unlike/unlike';

@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html',
})
export class FilterPage {
  data: any
  constructor(
      public info: InfoProvider,
      public navCtrl: NavController,
      public navParams: NavParams,
      public alertCtrl: AlertController,
      public modalCtrl: ModalController,
      public viewCtrl: ViewController
  ) {}

  // constructor(public navCtrl: NavController, public navParams: NavParams) {
  // }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
    console.log(this.info.infos)
  }
  openSearch(){
    let SearchModal = this.modalCtrl.create(SearchPage);
    SearchModal.onDidDismiss(data => {
      console.log(data);
    });
    SearchModal.present();
  }
  openUnlike(){
    let UnlikeModal = this.modalCtrl.create(UnlikePage);
    UnlikeModal.onDidDismiss(data => {
      console.log(data);
    });
    UnlikeModal.present();
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
}
