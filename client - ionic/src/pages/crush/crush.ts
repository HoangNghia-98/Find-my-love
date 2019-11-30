import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { ProfileViewerPage } from '../profile-viewer/profile-viewer';
import { ChatPage } from '../chat/chat';
import { SearchPage } from '../../modals/search/search';
import { InfoProvider } from '../../providers/info/info';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-crush',
  templateUrl: 'crush.html',
})
export class CrushPage {
  users: any[]
  fullUsers:any[]
  loadDone: boolean = false
  loading: boolean = false
  defaultImage = 'assets/img/default-image.png'
  filter:{
    knowledge:string,
    looking:string,
    relationship:string,
    min_height:string,
    max_height:string,
    min_age:number,
    max_age:number,
    smoke:string,
    religion:string,
  }
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public user: UserProvider,
    public info: InfoProvider,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController
  ) {

  }
  async ionViewWillEnter() {
    await this.reload()
  }
  async reload() {
    this.loadDone = false
    this.users = this.info.infos.likes
    this.users.forEach(user => {
      if (!user.image) {
        if (user.sex == "Nam") {
          user.image = 'assets/img/default-male.png'
        } else {
          user.image = 'assets/img/default-female.png'
        }
      }
      this.info.infos.friends.forEach(el => {
        if (String(el.info) == String(user._id)) {
          user.isFriend = true
        }
      })
      let number = ""
      let date = user.date
      if (date) {
        for (let i = date.length - 1; i >= 0; i--) {
          if (date[i] !== "/" && date[i] !== "-") {
            number += date[i]
          } else {
            break;
          }
        }
        number = number.split("").reverse().join("");
        user.age =  new Date().getFullYear() - parseInt(number)
      }
    })
    this.fullUsers = this.users
    this.filter = JSON.parse(localStorage.getItem('filter-crush'))
    this.filterUser()
    this.loadDone = true
  }
  navProfile(user: any) {
    this.navCtrl.push(ProfileViewerPage, user)
  }
  async addFriend(user, data) {
    this.loading = true
    try {
      await this.user.addFriend(user._id, data)
      this.navCtrl.push(ProfileViewerPage, user)
    } catch (err) {

    }
    this.loading = false
  }
  async openMessage(event: Event, user) {
    if (user.isFriend) {
      let profileModal = this.modalCtrl.create(ChatPage, user);
      profileModal.onDidDismiss(data => {
        console.log(data);
      });
      profileModal.present();
    } else {
      const prompt = this.alertCtrl.create({
        title: 'Gửi lời mời kết bạn',
        message: "Nhận lời mời kết bạn. Gợi ý hãy viết thật hấp dẫn tạo ấn tượng tốt với đối tượng",
        inputs: [
          {
            name: 'message',
            placeholder: 'Xin chào!'
          },
        ],
        buttons: [
          {
            text: 'Gửi',
            handler: (data) => {
              this.addFriend(user, data.message)
            }
          }
        ]
      });
      prompt.present();
    }

    event.stopPropagation()
  }

  openSearch() {
    console.log("kkkkkkkkk")
    let SearchModal = this.modalCtrl.create(SearchPage, { mode: 'crush' });
    SearchModal.onDidDismiss(data => {
      console.log(data);
      if(data){
        this.filter = data
        this.filterUser()
      }
    });
    SearchModal.present();
  }


   
  filterUser(){
    console.log('filter',this.filter)
    console.log('before filter',this.fullUsers)
    //!    looking???
    if(this.filter){
     this.users =  this.fullUsers.filter(user=>{
        let check = true
        if(user.knowledge && this.filter.knowledge && this.filter.knowledge != user.knowledge){
          check = false
        }
        if(user.relationship && this.filter.relationship && this.filter.relationship != user.relationship){
          check = false
        }
        if(user.smoke && this.filter.smoke && this.filter.smoke != user.smoke){
          check = false
        }
        if(user.religion && this.filter.religion && this.filter.religion != user.religion){
          check = false
        }
        if(!user.age || (this.filter.min_age > user.age || this.filter.max_age < user.age)){
          check = false
        }
        if(user.height && (this.filter.min_height > user.height || this.filter.max_height < user.height)){
          check = false
        }
        return check
      })
    }
   
    console.log('after filter',this.users)
  }
  moveTabView(){
    this.navCtrl.parent.select(0)
  }
}
