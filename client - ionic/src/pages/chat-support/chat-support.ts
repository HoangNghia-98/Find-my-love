import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import { MessageProvider } from '../../providers/message/message';
import { UserProvider } from '../../providers/user/user';
import { ProfileViewerPage } from '../profile-viewer/profile-viewer';
import * as moment from 'moment';
import { VideoCallService } from '../../providers/video-call/video-call.service';
import { Subscription } from 'rxjs';
import { SupportPage } from '../support/support';


@Component({
    selector: 'page-chat-support',
    templateUrl: 'chat-support.html',
})
export class ChatSupportPage {
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;
    support: any
    messages = [];
    message: string
    contents :any = []
    me:any
    user:any
    loadDone:boolean = false
    session;
    calleeId;
    subscription: Subscription
    toggleMenu: boolean = false
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController,
        public socket: Socket,
        public apiUser: UserProvider,
        public toast: MessageProvider,
        public platform: Platform,
    ) {
        this.support = this.navParams.data
        console.log(this.support)
   
    }
 
    async ionViewDidLoad() { 
        this.me = await this.apiUser.reloadUserInfo()
        console.log( "me", this.me)
        this.contents = this.support.contents
        this.support.users.forEach(user => {
          if( String(user._id) != String(this.me._id)){
            this.user = user
          }
        })
        console.log( 'content',this.contents, this.user)
        this.initChatUI()
        this.loadDone = true

       
        this.socket.emit('join-group', {
            conversationID: this.support._id
        });
        this.getMessages().subscribe(data => {
            console.log("message",data)
           this.getMessageWithCondition(data)
          
            this.addEventClickForLastElement()
            this.scrollToBottom()
        });

        this.getUsers().subscribe(data => {
            let user = data['user'];
            if (data['event'] === 'left') {
                console.log('User left: ' + user);
            } else {
                console.log('User joined: ' + user);
            } 
        });
        this.getError().subscribe(err =>{
            this.toast.errorToast("Lỗi kết nối đến server")
        })
    
  
    }
    getMessageWithCondition(data){
      if(this.me.type == "admin"){
        if(data['from']==this.me.email){
            this.renderMyMessage(data['message'],data['createAt'],data['isRead'],this.support.support.photoURL)
        }else{
          if(data['from']==this.support.users[0].email){
            this.renderOtherMessage(data['message'],data['createAt'],data['isRead'],this.support.users[0].photoURL)
          }else{
            this.renderSupportMessage(data['message'],data['createAt'],data['isRead'],this.support.users[1].photoURL)
          }
        }
      }else{
          if(data['from']==this.me.email){
            this.renderMyMessage(data['message'],data['createAt'],data['isRead'],this.me.photoURL)
        }else{
          if(data['from']==this.user.email){
            this.renderOtherMessage(data['message'],data['createAt'],data['isRead'],this.user.photoURL)
          }else{
            this.renderSupportMessage(data['message'],data['createAt'],data['isRead'],this.support.support.photoURL)
          }
        }
      }
    }
    calTime(time_message: Date) {
        let end = new Date(time_message)
        let cur = moment(new Date())
        let time = moment.duration(cur.diff(end))
        if (time.asSeconds() <= 60) {
          return Math.floor(time.asSeconds()) + " giây"
        } else if (time.asMinutes() <= 60) {
          return Math.floor(time.asMinutes()) + " phút"
        } else if (time.asHours() <= 60) {
          return moment(end).format("hh:mm A")
        } else {
          return moment(end).format('D MMM')
        }
    }
    initChatUI(){
        this.contents.forEach(message=>{
            this.getMessageWithCondition(message)
        })
        this.addEventClick()
        this.scrollToBottom()
    }
  addEventClickForLastElement() {
    console.log('click was call')
    let line = document.querySelectorAll('.line')
    line[line.length - 1].addEventListener("touchstart", function () {
      let parent = line[line.length - 1].parentElement;
      if (parent.firstElementChild.classList.contains('show-info')) {
        parent.firstElementChild.classList.remove('show-info')
        parent.firstElementChild.classList.add('hidden-info')
      } else {
        parent.firstElementChild.classList.add('show-info')
        parent.firstElementChild.classList.remove('hidden-info')
      }
      if (parent.lastElementChild.classList.contains('show-info')) {
        parent.lastElementChild.classList.remove('show-info')
        parent.lastElementChild.classList.add('hidden-info')
      } else {
        parent.lastElementChild.classList.add('show-info')
        parent.firstElementChild.classList.remove('hidden-info')
      }
    })
    
  }
  addEventClick() {
    let line = document.querySelectorAll('.line')
    for (let i = 0; i < line.length; i++) {
      line[i].addEventListener("touchstart", function () {
        console.log('click was call')
        let parent = line[i].parentElement;
        if (parent.firstElementChild.classList.contains('show-info')) {
          parent.firstElementChild.classList.remove('show-info')
          parent.lastElementChild.classList.add('hidden-info')
        } else {
          parent.firstElementChild.classList.add('show-info')
          parent.lastElementChild.classList.remove('hidden-info')
        }
        if (parent.lastElementChild.classList.contains('show-info')) {
          parent.lastElementChild.classList.remove('show-info')
          parent.lastElementChild.classList.add('hidden-info')
        } else {
          parent.lastElementChild.classList.add('show-info')
          parent.lastElementChild.classList.remove('hidden-info')
        }
      });
    }
  }
    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch(err) { }                 
    }
    async ionViewDidLeave(){
        console.log("leave")
        this.socket.removeAllListeners()
        // this.subscription.unsubscribe()
       // this.socket.disconnect()
    }
    getError(){
        let observable = new Observable(observer => {
            this.socket.on('error', (data) => {
                observer.next(data);
            });
        })
        return observable; 
    }
    getMessages() {
        let observable = new Observable(observer => {
            this.socket.on('message-group', (data) => {
                observer.next(data);
            });
        })
        return observable; 
    }
    getUsers() {
        let observable = new Observable(observer => {
            this.socket.on('users-changed-group', (data) => {
                observer.next(data);
            });
        });
        return observable;
    }
    sendMessage() {
        if(this.message){
            const chat = {
                from: this.me.email,
                message: this.message
            };
            this.message = ""
            this.socket.emit("add-message-group", chat);
        }
    }
    renderMyMessage(content:string,date:any,isRead:boolean, image:string){
        let time = this.calTime(date)
        let status 
        if(isRead){
          status = "Đã xem"
        }else{
          status = "Đã gửi"
        }
        let message = document.querySelectorAll('.message')
        let lastMessage = message[message.length - 1]
        if (message && lastMessage && lastMessage.classList.contains('me')) {
            let messages = Array.from(lastMessage.firstElementChild.children)
            if (messages && messages[0].children[1].classList.contains('one-line')) {
                messages[0].children[1].classList.remove("one-line")
                messages[0].children[1].classList.add("first-line")
            }
            if (messages && messages[messages.length - 1].children[1].classList.contains('last-line')) {
                messages[messages.length - 1].children[1].classList.remove('last-line')
            }
            let html = `
              <div class="line-box">
                    <div class="date-send">
                          ${time}
                    </div>
                    <div class="line last-line">
                        ${content}
                    </div>
                    <div class="status-message">
                        ${status}
                    </div>
              </div>
            `
            lastMessage.firstElementChild.insertAdjacentHTML('beforeend', html)
        } else {
            let html = `
            <div class="message me">
                <div class="message-box">
                  <div class="line-box">
                      <div class="date-send">
                            ${time}
                      </div>
                      <div class="line one-line">
                          ${content}
                      </div>
                      <div class="status-message">
                        ${status}
                      </div>
                  </div>
                </div>
                <div class="avatar-chat">
                <img src="${image}" >
              </div>
            </div>
            `
            document.querySelector(".container-message").insertAdjacentHTML('beforeend', html)
        }
    }
    renderOtherMessage(content:string,date:any,isRead:boolean, image:string){
      let time = this.calTime(date)
      let status 
      if(isRead){
        status = "Đã xem"
      }else{
        status = "Đã gửi"
      }
        let message = document.querySelectorAll('.message')
        let lastMessage = message[message.length - 1]
        if (message && lastMessage && lastMessage.classList.contains('other')) {
            let messages = Array.from(lastMessage.lastElementChild.children)
            if (messages && messages[0].children[1].classList.contains('one-line')) {
                messages[0].children[1].classList.remove("one-line")
                messages[0].children[1].classList.add("first-line")
            }
            if (messages && messages[messages.length - 1].children[1].classList.contains('last-line')) {
                messages[messages.length - 1].children[1].classList.remove('last-line')
            }
            let html = `
            <div class="line-box">
                <div class="date-send">
                      ${time}
                </div>
                <div class="line last-line">
                    ${content}
                </div>
                <div class="status-message">
                    ${status}
                </div>
            </div>
            `
            lastMessage.lastElementChild.insertAdjacentHTML('beforeend', html)
        } else {
            let html = `
            <div class="message other">
              <div class="avatar-chat">
                  <img src="${image}" >
                </div>
                <div class="message-box">
                  <div class="line-box">
                      <div class="date-send">
                            ${time}
                      </div>
                      <div class="line one-line">
                          ${content}
                      </div>
                      <div class="status-message">
                        ${status}
                      </div>
                  </div>
                </div>
            </div>
            `
            document.querySelector(".container-message").insertAdjacentHTML('beforeend', html)
        }
    }
    renderSupportMessage(content:string,date:any,isRead:boolean, image){
      let time = this.calTime(date)
      let status 
      if(isRead){
        status = "Đã xem"
      }else{
        status = "Đã gửi"
      }
        let message = document.querySelectorAll('.message')
        let lastMessage = message[message.length - 1]
        if (message && lastMessage && lastMessage.classList.contains('support')) {
            let messages = Array.from(lastMessage.lastElementChild.children)
            if (messages && messages[0].children[1].classList.contains('one-line')) {
                messages[0].children[1].classList.remove("one-line")
                messages[0].children[1].classList.add("first-line")
            }
            if (messages && messages[messages.length - 1].children[1].classList.contains('last-line')) {
                messages[messages.length - 1].children[1].classList.remove('last-line')
            }
            let html = `
            <div class="line-box">
                <div class="date-send">
                      ${time}
                </div>
                <div class="line last-line">
                    ${content}
                </div>
                <div class="status-message">
                    ${status}
                </div>
            </div>
            `
            lastMessage.lastElementChild.insertAdjacentHTML('beforeend', html)
        } else {
            let html = `
            <div class="message support">
                <div class="avatar-chat">
                <img src="${image}" >
              </div>
                <div class="message-box">
                  <div class="line-box">
                      <div class="date-send">
                            ${time}
                      </div>
                      <div class="line one-line">
                          ${content}
                      </div>
                      <div class="status-message">
                        ${status}
                      </div>
                  </div>
                </div>
            </div>
            `
            document.querySelector(".container-message").insertAdjacentHTML('beforeend', html)
        }
    }
    async dismiss() {
        this.viewCtrl.dismiss();
    }
    navProfile() {
        this.navCtrl.push(ProfileViewerPage, this.user)
    }
    navInviteSupport(){
      this.toggleMenu = false
      this.navCtrl.push(SupportPage)
    }
    navSupportProfile(){
      this.toggleMenu = false
      this.navCtrl.push(ProfileViewerPage, this.support.support)
    }
}
