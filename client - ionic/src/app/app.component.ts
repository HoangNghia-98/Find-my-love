import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { WelcomePage } from '../pages/welcome/welcome';
import { UserProvider } from '../providers/user/user';
import { timer } from "rxjs/observable/timer"
import { Socket } from 'ng-socket-io';
import { InfoProvider } from '../providers/info/info';
import { Network } from '@ionic-native/network';
import { MessageProvider } from '../providers/message/message';



@Component({
    templateUrl: 'app.html'
})

export class MyApp {
    rootPage: any = WelcomePage;

    @ViewChild(Nav) nav: Nav;

    showSplash = true
    pages: any[] = [{
        title: 'Login', component: LoginPage
    },
    {
        title: 'Home', component: HomePage
    }]

    constructor(
        platform: Platform,
        statusBar: StatusBar,
        splashScreen: SplashScreen,
        public user: UserProvider,
        public socket: Socket,
        public info: InfoProvider,
        private network: Network,
        public message: MessageProvider,
    ) {
      this.socket.connect()
        platform.ready().then(() => {
            statusBar.styleDefault();
            splashScreen.hide();

            timer(3000).subscribe(() => this.showSplash = false)
        });
          console.log('isOnline', )
         
        let disconnectSubscription = this.network.onDisconnect().subscribe(async () => {
          this.message.errorToast("Mất kết nối Internet")
        });

    
    }
    async ionViewDidLoad() {
      if(!navigator.onLine){
        await this.message.errorToastCustom("Không có kết nối Internet")
        navigator['app'].exitApp()
      }
    }
    openPage(page) {
        this.nav.setRoot(page.component)
    }
   
}

