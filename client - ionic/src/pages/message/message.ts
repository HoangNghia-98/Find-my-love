import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { ChatPage } from '../chat/chat';
import * as moment from 'moment';
declare var cordova
@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})
export class MessagePage {
  friends: any
  loadDone:boolean = false
  fullFriend: any[] = []
  constructor(
      public navCtrl: NavController, 
      public navParams: NavParams,
      public user: UserProvider,
      public modalCtrl: ModalController
    ) {
      this.requirePermistion()
  }

  async ionViewWillEnter() {
    this.loadDone = false
    await this.reload()
    this.loadDone = true;
  }
  async reload(){
    this.friends = await this.user.getListFriend();
    this.friends.forEach(friend=>{
        if(friend.contents.length > 0){
            let last = friend.contents[friend.contents.length -1]
            friend.lastMessage = last.message
            let end = new Date(last.createAt)
            let cur = moment(new Date())
            let time = moment.duration(cur.diff(end))
            if (time.asSeconds() <= 60) {
                friend.lastTime =  Math.floor(time.asSeconds()) + " giây"
            } else if (time.asMinutes() <= 60) {
                friend.lastTime = Math.floor(time.asMinutes()) + " phút"
            } else if (time.asHours() <= 60) {
                friend.lastTime =  moment(end).format("hh:mm A")
            } else {
                friend.lastTime = moment(end).format('D MMM')
            }
        }
        
    })
    console.log( this.friends)
    this.fullFriend = this.friends
  
  }
  openChat(user){
    
    let profileModal = this.modalCtrl.create(ChatPage,user);
    profileModal.onDidDismiss(data => {
      this.reload()
    });
    profileModal.present();
  }
  getItems(ev:any){
    const val = ev.target.value;
    if (val && val.trim() != '') {
      this.friends = this.fullFriend.filter((item) => {
        return (item.info.displayName.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    } else{
      this.friends = this.fullFriend
    }
  }
  requirePermistion(){
    var permissions = cordova.plugins.permissions;
    console.log( 'permisstion',permissions)
      permissions.hasPermission(permissions.CAMERA, checkVideoPermissionCallback, null);
      permissions.hasPermission(permissions.RECORD_AUDIO, checkAudioPermissionCallback, null);

      function checkVideoPermissionCallback(status) {
        if(!status.hasPermission) {
            var errorCallback = function() {
                alert('Camera permission is not turned on');
            }
            permissions.requestPermission(
                    permissions.CAMERA,
                    function(status) {
                        if(!status.hasPermission) {
                            errorCallback();
                        }
                    },
                    errorCallback);
        }
    }

    function checkAudioPermissionCallback(status) {
        if(!status.hasPermission) {
            var errorCallback = function() {
                alert('Audio permission is not turned on');
            }
            permissions.requestPermission(
                    permissions.RECORD_AUDIO,
                    function(status) {
                        if(!status.hasPermission) {
                            errorCallback();
                        }
                    },
                    errorCallback);
        }
    }
}
}
