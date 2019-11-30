import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewsPage } from '../views/views';
import { SettingsPage } from '../settings/settings';
import { CrushPage } from '../crush/crush';
import { MessagePage } from '../message/message';
import { UserProvider } from '../../providers/user/user';
import { ListSupportPage } from '../list-support/list-support';

/**
 * Generated class for the TabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-tabs',
    templateUrl: 'tabs.html',
})
export class TabsPage {
  
      tab1Root:any = ViewsPage
    // tab1Root:any = AddressPage
    tab2Root:any = CrushPage
    tab3Root:any = MessagePage
    tab4Root:any =  SettingsPage
    constructor(public navCtrl: NavController, public navParams: NavParams, public user: UserProvider) {
    
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad TabsPage');
        
        this.user.reloadUserInfo().then(res=>{
          if(res.type == "admin"){
            this.tab3Root = ListSupportPage
          }
        });
    }

}
