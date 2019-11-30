import { Component } from '@angular/core';
import {  NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageProvider } from '../../providers/message/message';
import { UserProvider } from '../../providers/user/user';
import { WelcomePage } from '../welcome/welcome';
import { InfoProvider } from '../../providers/info/info';
import { TabsPage } from '../tabs/tabs';
import { VideoCallService } from '../../providers/video-call/video-call.service';

/**
 * Generated class for the SignUpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-sign-up',
    templateUrl: 'sign-up.html',
})
export class SignUpPage {
    signupError: string;
    form: FormGroup;
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public info:InfoProvider,
        fb: FormBuilder,
        public message: MessageProvider,
        public loadingCtrl: LoadingController,
        public user: UserProvider,
        public apirtc: VideoCallService,
    ) {
        this.form = fb.group({
            email: ['', Validators.compose([Validators.required, Validators.email])],
            password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SignUpPage');
    }
    async loginWithFacebook() {
        const user = await this.user.loginWithGoogle();
        this.loginInServer(user)
     }
     async loginWithGoogle() {
        const user = await this.user.loginWithGoogle();
        this.loginInServer(user)
     }
    async signup() {
        let data = this.form.value;
        let credentials = {
            email: data.email,
            password: data.password
        };
        const loader = this.loadingCtrl.create({
            content: "Please wait..."
          });
          loader.present();

        const user =  await this.user.signup(credentials)
        this.loginInServer(user)

        loader.dismiss();
    }
    loginInServer(user){
        if(user&&user['success']){
            this.message.successToast("Đăng nhập thành công", 1000)
            this.info.infos = user["user"]
            console.log("data from serve",user)
            this.navCtrl.push(TabsPage).then(()=>{
                const index = this.navCtrl.getActive().index;
            this.navCtrl.remove(0, index);
            })
            this.apirtc.updateCallId()
        }else{
            if(user&&!user['success']){
                this.message.errorToast(user['message'])
            }
        }
    }
    navWelcome() {
        this.navCtrl.push(WelcomePage)
    }
}
