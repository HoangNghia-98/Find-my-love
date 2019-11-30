import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { InfoProvider } from '../../providers/info/info';
import { MessageProvider } from '../../providers/message/message';
import { ChatPage } from '../chat/chat';


@Component({
    selector: 'page-profile-viewer',
    templateUrl: 'profile-viewer.html',
})
export class ProfileViewerPage {
    user: any
    isLiked: Boolean
    loading: boolean = false
    isFriend: boolean = false
    loadingFriend: boolean = false
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public userApi: UserProvider,
        public info: InfoProvider,
        public message: MessageProvider,
        public modalCtrl: ModalController,
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController
    ) {
        this.user = this.navParams.data
        this.info.infos.friends.forEach(el => {

            if (String(el.info) == String(this.user._id)) {
                this.isFriend = true
            }
        })
    }
    reload(){
      this.isFriend = false
      this.info.infos.friends.forEach(el => {

        if (String(el.info) == String(this.user._id)) {
            this.isFriend = true
        }
     })
    }
    async ionViewDidLoad() {
        console.log('ionViewDidLoad ProfileViewerPage', this.user);
        let listLike = this.info.infos.likes
        this.isLiked = false
        listLike.forEach(like => {
            if (like._id == this.user._id) {
                this.isLiked = true
            }
        })
    }
    async changeLikeStatus() {
        this.loading = true;
        try {
            if (this.isLiked) {
                //->unlike
                let data = await this.userApi.unlikeUser(this.user._id)
                console.log("data", data)
                if (data) {
                    this.isLiked = !this.isLiked
                }
            } else {
                //->like
                let data = await this.userApi.likeUser(this.user._id)
                console.log("data", data)
                if (data) {
                    this.isLiked = !this.isLiked
                }
            }
        } catch (err) {
            console.log(err)
            this.message.errorToast("Có lỗi xảy ra khi thích")
        }
        this.loading = false;

    }
    async addFriend(user,data){
      this.loadingFriend = true
      try{
        await this.userApi.addFriend(user._id,data) 
        this.reload()
      }catch(err){

      }    
      this.loadingFriend = false
    }
    buttonAction() {
        if (this.isFriend) {
            let profileModal = this.modalCtrl.create(ChatPage, this.user);
            profileModal.onDidDismiss(data => {
                console.log(data);
            });
            profileModal.present();
        }else{
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
                    handler: data => {
                      this.addFriend(this.user,data.message)      
                    }
                  }
                ]
              });
              prompt.present();
        }
    }
    async deleteFriend(){
      let loading = this.loadingCtrl.create({
        spinner:'dots',
        content: 'Please wait...'
      });
    
      loading.present();
      try{
        await this.userApi.deleteFriend(this.user._id)
        this.reload()
      }catch(err){
        console.log(err)
      }
      loading.dismiss();
    }
}
