import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import * as moment from 'moment';
import { ChatSupportPage } from '../chat-support/chat-support';
@Component({
  selector: 'page-list-support',
  templateUrl: 'list-support.html',
})
export class ListSupportPage {
  supportes: any
  loadDone:boolean = false
  fullSupportes: any[] = []
  info:any
  constructor(
      public navCtrl: NavController, 
      public navParams: NavParams,
      public user: UserProvider,
      public modalCtrl: ModalController
    ) {
  }

  async ionViewWillEnter() {
    this.loadDone = false
    await this.reload()
    this.loadDone = true;
  }
  async reload(){
    this.info = await this.user.reloadUserInfo();
    console.log('res',this.info)
    this.supportes = this.info.support
    if(!this.supportes) return
    this.supportes.forEach(support=>{
        if(support.contents.length > 0){
            let last = support.contents[support.contents.length -1]
            support.lastMessage = last.message
            let end = new Date(last.createAt)
            let cur = moment(new Date())
            let time = moment.duration(cur.diff(end))
            if (time.asSeconds() <= 60) {
                support.lastTime =  Math.floor(time.asSeconds()) + " giây"
            } else if (time.asMinutes() <= 60) {
                support.lastTime = Math.floor(time.asMinutes()) + " phút"
            } else if (time.asHours() <= 60) {
                support.lastTime =  moment(end).format("hh:mm A")
            } else {
                support.lastTime = moment(end).format('D MMM')
            }
        }
        if(this.info.type!='admin'){
          support.users.forEach(user =>{
            if(user._id != this.info._id){
              support.otherName = user.displayName
            }
          })
        }
    })
    console.log( this.supportes)
    this.fullSupportes = this.supportes
  
  }
  openChat(support){
    
    let profileModal = this.modalCtrl.create(ChatSupportPage,support);
    profileModal.onDidDismiss(data => {
      this.reload()
    });
    profileModal.present();
  }
  getItems(ev:any){
    const val = ev.target.value;
    if (val && val.trim() != '') {
      this.supportes = this.fullSupportes.filter((item) => {
        let str
        if(this.info.type == "admin"){
          str = item.users[0].displayName + ', '+ item.users[1].displayName
        }else{
          str = item.support.displayName + ', '+ item.otherName
        }
         
        return (str.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    } else{
      this.supportes = this.fullSupportes
    }
  }
  goBack(){
    this.navCtrl.pop();
  }
}
