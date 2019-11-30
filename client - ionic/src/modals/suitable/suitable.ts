import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';


@Component({
  selector: 'page-suitable',
  templateUrl: 'suitable.html',
})
export class SuitablePage {

  suitable = {
    relationShip: "Hẹn hò",
    sex:"Không rõ",
    minAge:"18",
    maxAge:"70",
  }

  structure:any ={lower: 18, upper: 70}

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SuitablePage');
    let data =  this.navParams.get('suitable')
    if(data){
      this.suitable = data
    }
  }
  dismiss() {
    this.viewCtrl.dismiss({
      close:true
    });
  }
  closeAndSave() {
    this.suitable.minAge = this.structure.lower
    this.suitable.maxAge = this.structure.upper
    this.viewCtrl.dismiss({
      close: false,
      suitable: this.suitable
    });
  }
}
