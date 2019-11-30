import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { WelcomePage } from '../pages/welcome/welcome';
import { UserProvider } from '../providers/user/user';
import { HttpClientModule } from '@angular/common/http';
import { MessageProvider } from '../providers/message/message';
import { ProfilePage } from '../pages/profile/profile';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import { SignUpPage } from '../pages/sign-up/sign-up';
import { GooglePlus } from '@ionic-native/google-plus'
import { Facebook } from "@ionic-native/facebook"
import { ApiProvider } from '../providers/api/api';
import { InfoProvider } from '../providers/info/info';
import { TabsPageModule } from '../pages/tabs/tabs.module';
import { ViewsPage } from '../pages/views/views';
import { CalYearPipe } from '../pipes/date.pipe';
import { AddressPipe } from '../pipes/address.pipe';
import { PlacePredictionService } from '../providers/google-service/place-prediction.service';
import { SettingsPage } from '../pages/settings/settings';
import { ProfileViewerPage } from '../pages/profile-viewer/profile-viewer';
import { CrushPage } from '../pages/crush/crush';
import { SuitablePage } from '../modals/suitable/suitable';
import { ChatPage } from '../pages/chat/chat';

import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { CalTimeOnlinePipe } from '../pipes/timeOnline.pipe';
import { MessagePage } from '../pages/message/message';
import { AddressPage } from '../modals/address/address';
import { SearchPage } from '../modals/search/search';
import { AgmCoreModule } from '@agm/core';
import { FilterPage } from '../modals/filter/filter';
import { UnlikePage } from '../modals/unlike/unlike';
import { HelpPage } from '../pages/help/help';
import { Network } from '@ionic-native/network';
import { ScriptHackComponent } from '../shared/script-hack/scripthack.component';
import { VideoCallService } from '../providers/video-call/video-call.service';
import { SupportPage } from '../pages/support/support';
import { ListSupportPage } from '../pages/list-support/list-support';
import { ChatSupportPage } from '../pages/chat-support/chat-support';
import { VideoCallPage } from '../modals/video-call/video-call';
// const configSocket: SocketIoConfig = { url: 'http://localhost:3030', options: {} };
const configSocket: SocketIoConfig = { url: 'https://auth-find-my-love.herokuapp.com', options: {} };
var config = {
    apiKey: "AIzaSyCWm2_8fggfbaVe4bdHrJiIRu2HR4Ff6QI",
    authDomain: "find-my-love.firebaseapp.com",
    databaseURL: "https://find-my-love.firebaseio.com",
    projectId: "find-my-love",
    storageBucket: "find-my-love.appspot.com",
    messagingSenderId: "980107505961"
}

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        LoginPage,
        WelcomePage,
        ProfilePage,
        SignUpPage,
        ViewsPage,
        SettingsPage,
        ProfileViewerPage,
        CrushPage,
        CalYearPipe,
        AddressPipe,
        CalTimeOnlinePipe,
        SuitablePage,
        ChatPage,
        MessagePage,
        AddressPage,
        SearchPage,
        FilterPage,
        UnlikePage,
        HelpPage,
        ScriptHackComponent,
        SupportPage,
        ListSupportPage,
        ChatSupportPage,
        VideoCallPage,
    ],
    imports: [
        TabsPageModule,
        BrowserModule,
        HttpClientModule,
        IonicModule.forRoot(MyApp, {
            scrollPadding: false,
            scrollAssist: false
        }),
        SocketIoModule.forRoot(configSocket),
        AngularFireModule.initializeApp(config),
        AngularFireAuthModule,
        NgxErrorsModule,
        AgmCoreModule.forRoot({
          apiKey: 'AIzaSyD8A704eZF3d4cYOCrjEyO5P-6jvArar0s',
          libraries: ["places"],
          language: 'vi'
        }) 
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        LoginPage,
        WelcomePage,
        ProfilePage,
        SignUpPage,
        ViewsPage,
        SettingsPage,
        ProfileViewerPage,
        CrushPage,
        SuitablePage,
        ChatPage,
        MessagePage,
        AddressPage,
        SearchPage,
        FilterPage,
        UnlikePage,
        HelpPage,
        SupportPage,
        ListSupportPage,
        ChatSupportPage,
        VideoCallPage,
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        UserProvider,
        MessageProvider,
        GooglePlus,
        Facebook,
        ApiProvider,
        InfoProvider,
        PlacePredictionService,
        VideoCallService,
        Network 
    ]
})
export class AppModule { }
