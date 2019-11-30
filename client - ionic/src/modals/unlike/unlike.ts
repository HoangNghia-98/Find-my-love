import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { ProfileViewerPage } from '../../pages/profile-viewer/profile-viewer';
@Component({
  selector: 'page-unlike',
  templateUrl: 'unlike.html',
})
export class UnlikePage {
  unlikes: any
  loadDone:boolean = false
  constructor(
      public navCtrl: NavController, 
      public navParams: NavParams,
      public user: UserProvider,
      public modalCtrl: ModalController,
      public viewCtrl: ViewController,
    ) {
  }

  async ionViewWillEnter() {
    this.reload()
  }
  async reload(){
    this.loadDone = false
    this.unlikes = JSON.parse(localStorage.getItem('disLike')) 
    console.log( this.unlikes)
    this.loadDone = true;
  }
  openChat(user){
    this.navCtrl.push(ProfileViewerPage, user)
  }
  deleteUnlike(index:number,event:Event){
    this.unlikes.splice(index,1)
    localStorage.setItem('disLike',JSON.stringify(this.unlikes))
    event.stopPropagation()
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
}
