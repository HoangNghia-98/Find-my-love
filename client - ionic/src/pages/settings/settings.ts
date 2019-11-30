import { Component } from '@angular/core';
import { NavController, NavParams, App, ModalController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { InfoProvider } from '../../providers/info/info';
import { LoginPage } from '../login/login';
import { ProfilePage } from '../profile/profile';
import { HelpPage } from '../help/help';
import { Socket } from 'ng-socket-io';
import { FilterPage } from '../../modals/filter/filter';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { SupportPage } from '../support/support';
import { ListSupportPage } from '../list-support/list-support';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(
      public navCtrl: NavController, 
      public navParams: NavParams,
      public user: UserProvider,
        public info: InfoProvider,
        private app:App,
        public socket: Socket,
        public modalCtrl: ModalController,
        private http: HttpClient,
      ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
    console.log(this.info.infos)
  }
  logout() {
    console.log('logout!')
    this.socket.emit('logout',{email: this.info.infos.email})
    this.user.logout();
    this.app.getRootNav().push(LoginPage)
  }
  navProfile() {
    this.navCtrl.push(ProfilePage)
  }
  navHelpPage() {
    this.navCtrl.push(HelpPage) 
  }
  navSetting(){
    let FilterModal = this.modalCtrl.create(FilterPage);
    FilterModal.onDidDismiss(data => {
      console.log(data);
    });
    FilterModal.present();
  }
  navSupport(){
    this.navCtrl.push(SupportPage) 
  }
  navListSupport(){
    this.navCtrl.push(ListSupportPage) 
  }
  async updateInfo(info:any){
    try{
      await this.user.updateInfo(info)
    }catch(err){
      console.log(err)
    }
   }
   
  loadImageDone: boolean = true;
  async uploadImage(event){
    if(!event){
      return
    }
    this.loadImageDone = false
    let clientId = "4f3c3547ebbfe10"
    const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Client-ID '+clientId
        })
      };
    let image :File =<File> event.target.files[0]
    const fd = new FormData();
    fd.append('image',image,image.name)
    this.http.post('https://api.imgur.com/3/image',fd,httpOptions).subscribe(async res =>{
       //res.data.link
       console.log( 'res',res)
       await this.updateInfo({
        photoURL: res['data'].link
       })
       this.loadImageDone = true 
    })
  }
}
