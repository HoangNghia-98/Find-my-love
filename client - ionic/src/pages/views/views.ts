import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides, ModalController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { ProfileViewerPage } from '../profile-viewer/profile-viewer';
import { InfoProvider } from '../../providers/info/info';
import { MessageProvider } from '../../providers/message/message';
import { FilterPage } from '../../modals/filter/filter';
import { SearchPage } from '../../modals/search/search';

/**
 * Generated class for the ViewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-views',
  templateUrl: 'views.html',
})
export class ViewsPage {
  users: any[]
  fullUsers: any[]
  disLikeUser: any[] = JSON.parse(localStorage.getItem('disLike')) || []
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
  @ViewChild(Slides) slides: Slides;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public user: UserProvider,
    public info: InfoProvider,
    public message: MessageProvider,
    public modalCtrl: ModalController,
  ) {
  }

  async ionViewWillEnter() {
    this.reload()
  }
  async reload() {
    console.log('ionViewDidLoad ViewsPage');
    this.users = await this.user.getUser();
    this.users = this.users.filter(user => {
      let check = true
      this.info.infos.likes.forEach(crush => {
        if (String(crush._id) == String(user._id)) {
          check = false
        }
      })
      if (!check) {
        return check
      }
      check = true
      this.disLikeUser.forEach(dis => {
        if (String(dis._id) == String(user._id)) {
          console.log("dis,user", dis._id, user._id)
          check = false
        }
      })
      return check
    })
    this.users.forEach(user => {
      if (!user.image) {
        if (user.sex == "Nam") {
          user.image = 'https://i.imgur.com/cW7t8WV.png'
        } else {
          user.image = 'https://i.imgur.com/7Gvjz4h.png'
        }
      }
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
        user.age = new Date().getFullYear() - parseInt(number)
      }
    })
    this.fullUsers = this.users
    this.filter = JSON.parse(localStorage.getItem('filter-view'))
    this.filterUser()
    console.log(this.users)
  }
  navProfile(user: any) {
    this.navCtrl.push(ProfileViewerPage, user)
  }
  removeUserById(id) {
    let index = this.users.findIndex(el => String(el._id) == String(id))
    if (index > -1) {
      this.users.splice(index, 1)
    }
    console.log('index', index)
  }
  async likeUser(user: any, event: Event, id) {
    this.slides.slideNext(800)

    setTimeout(() => {
      this.slides.slidePrev(0);
      try {
        this.user.likeUser(user._id)
        this.removeUserById(user._id)
      } catch (err) {
        console.log(err)
        this.message.errorToast("Có lỗi xảy ra khi thích")
      }

    }, 800)

    event.stopPropagation()
  }
  disLike(user: any, event: Event, index) {
    if(index == this.users.length -1){
      this.slides.slidePrev(800)
    }else{
      this.slides.slideNext(800)
    }
    

    setTimeout(() => {
      if(index != this.users.length -1)  this.slides.slidePrev(0);
     
      this.disLikeUser.push(user)
      localStorage.setItem('disLike', JSON.stringify(this.disLikeUser))
      this.removeUserById(user._id)
      console.log('disLike', this.disLikeUser)
    }, 800)
    event.stopPropagation()
  }
  openFilter() {
    let FilterModal = this.modalCtrl.create(FilterPage);
    FilterModal.onDidDismiss(data => {
      console.log(data);
    });
    FilterModal.present();
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
  openFilterPage(){
    let SearchModal = this.modalCtrl.create(SearchPage);
    SearchModal.onDidDismiss(data => {
      if(data){
        this.filter = data
        this.filterUser()
      }
    });
    SearchModal.present();
  }
}
