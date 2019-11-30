import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import firebase from 'firebase'
import { SignUpPage } from '../sign-up/sign-up';
import { InfoProvider } from '../../providers/info/info';
import { ApiProvider } from '../../providers/api/api';
import { TabsPage } from '../tabs/tabs';
import { MessageProvider } from '../../providers/message/message';
import { UserProvider } from '../../providers/user/user';
import { Socket } from 'ng-socket-io';
import { VideoCallService } from '../../providers/video-call/video-call.service';
import { Subscription } from 'rxjs';
import { VideoCallPage } from '../../modals/video-call/video-call';
/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {
  subscrition: Subscription
  videoModal
  constructor(
      public info: InfoProvider,
      public api:ApiProvider,
      public message: MessageProvider,
      public navCtrl: NavController, 
      public navParams: NavParams,
      public user: UserProvider,
      public socket: Socket,
      public apirtc: VideoCallService,
      public modalCtrl: ModalController,
      ) {
  }
  
  ionViewDidLoad() {

   const unsubscribe = firebase.auth().onAuthStateChanged( async  (res)=> {
        if (res) {
            try{
                this.info.token = await res.getIdToken()
                const data =await this.api.post(this.api.link+"/api/accounts/login",{})
                this.info.infos = data["user"]
               
                console.log("init login",data)
                if(data["success"]){
                    this.navCtrl.push(TabsPage).then(()=>{
                        const index = this.navCtrl.getActive().index;
                    this.navCtrl.remove(0, index);
                    })
                    this.socket.emit('login', {
                      email:this.info.infos.email
                    });
                    this.apirtc.updateCallId()
                }else{
                  await this.message.errorToastCustom("Lỗi khi kết nối đến server")
                  navigator['app'].exitApp()
                }
                
                
            }catch(err){
                await this.message.errorToastCustom("Lỗi khi kết nối đến server")
                navigator['app'].exitApp()
            }
        } else {
            console.log("no user login")
        }
        unsubscribe();
    });

    this.subscrition = this.apirtc.openVideoModal.subscribe(data=>{
      if(data){
        this.openModalVideo()
      }
    })
    let subs = this.apirtc.closeVideoModal.subscribe(data=>{
      if(data){
        this.closeModalVideo()
      }
    })
  }
  login(){
      this.navCtrl.push(LoginPage)
  }
  signup(){
      this.navCtrl.push(SignUpPage)
  }
  openModalVideo(){
    this.videoModal = this.modalCtrl.create(VideoCallPage); 
    this.videoModal.onDidDismiss(data => {
      console.log( data)
    });
    this.videoModal.present();
  }
  closeModalVideo(){
    this.videoModal.dismiss(this.apirtc.isUserOnline) 
    // if(!this.apirtc.isUserOnline){
    //   this.message.errorToast("Người dùng không online")
    // }
  }
 
}
