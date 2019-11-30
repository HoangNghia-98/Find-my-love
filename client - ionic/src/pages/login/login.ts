import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { MessageProvider } from '../../providers/message/message';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignUpPage } from '../sign-up/sign-up';
import { WelcomePage } from '../welcome/welcome';
import { InfoProvider } from '../../providers/info/info';
import { TabsPage } from '../tabs/tabs';
import { Socket } from 'ng-socket-io';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-login',
    templateUrl: 'login.html',

})
export class LoginPage {
    account: { email: string, password: string } = {
        email: 'test@example.com',
        password: 'test'
    };
    loginForm: FormGroup;
	loginError: string;
    constructor(
        public user: UserProvider, 
        public info:InfoProvider,
        public navCtrl: NavController, 
        public navParams: NavParams, 
        public toastCtrl: ToastController,
        public message: MessageProvider,
        public loadingCtrl: LoadingController,
        public socket: Socket,
        fb: FormBuilder
        ) {
            this.loginForm = fb.group({
                email: ['', Validators.compose([Validators.required, Validators.email])],
                password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
            });
            console.log("login init")
          
    }

    ionViewDidLoad() {
        if(this.info.token){
            console.log('token',this.info.token)
            const loader = this.loadingCtrl.create({
                content: "Please wait..."
              });
              loader.present();
              this.navCtrl.push(TabsPage)
              loader.dismiss();
              console.log("login init with token")
        }
        console.log("login init") 
    }
    async login(){
        let data = this.loginForm.value;
        if (!data.email) {
			return;
		}

		let credentials = {
			email: data.email,
			password: data.password
        };
        const loader = this.loadingCtrl.create({
            content: "Please wait..."
          });
          loader.present();
        const user = await this.user.login(credentials)
        this.loginInServer(user)
        loader.dismiss();
    }

    async loginWithFacebook() {
       const user =  await this.user.loginWithFacebook();
       this.loginInServer(user)
    }
    async loginWithGoogle() {
        const user = await this.user.loginWithGoogle();
        this.loginInServer(user)
    }
    navSignUp(){
        this.navCtrl.push(SignUpPage)
    }
    navWelcome(){
        this.navCtrl.push(WelcomePage)
    }

    loginInServer(user){
        if(user&&user['success']){
            this.message.successToast("Đăng nhập thành công", 1000)
            this.info.infos = user["user"]
            console.log("data from serve",user)
            this.socket.emit('login', {
              email:this.info.infos.email
            });
            this.navCtrl.push(TabsPage).then(()=>{
                const index = this.navCtrl.getActive().index;
            this.navCtrl.remove(0, index);
            })
        }else{
            if(user&&!user['success']){
                this.message.errorToast(user['message'])
            }
        }
    }
}
