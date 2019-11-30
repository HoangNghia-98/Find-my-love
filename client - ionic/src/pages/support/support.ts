import { Component } from '@angular/core';
import { UserProvider } from '../../providers/user/user';
import { NavController } from 'ionic-angular';
import { MessageProvider } from '../../providers/message/message';
import { SettingsPage } from '../settings/settings';
import { TabsPage } from '../tabs/tabs';
import { ListSupportPage } from '../list-support/list-support';


@Component({
  selector: 'support',
  templateUrl: 'support.html'
})
export class SupportPage {
  step:string = '1'
  admins:any[] =[]
  friends: any[]=[]
  defaultImage = 'assets/img/default-image.png'
  selectedAmin:any = undefined
  selectedFriend:any = undefined
  loadingSupport:boolean = false
  constructor(
    public user: UserProvider,
    public navCtrl: NavController,
    public message: MessageProvider,
  ) {
    
  }
  async ionViewWillEnter() {
    this.reload()
  }
  async reload() {
    this.admins = await this.user.getUser();
    this.admins = this.admins.filter(user => {
      return user.type == 'admin'
    })
    
    this.friends = await this.user.getListFriend();
    console.log( 'admins',this.admins,this.friends)
  }
  goBack(){
    this.navCtrl.pop();
  }
  async getSupport(){
    this.loadingSupport = true
    let support = this.user.info.infos.support
    let check = true
    if(support){
      support.forEach(el=>{
        if(el.support.email == this.selectedAmin.email){
          el.users.forEach(user=>{
            if(user.email == this.selectedFriend.info.email){
              check = false
            }
          })
        }
      })
    }
    if(!check){
      this.message.errorToast("Người hỗ trợ và người dùng đã tồn tại. Vui lòng chọn dữ liệu khác")
      return
    }
    try{
      await this.user.getSupport(this.selectedFriend.info.email, this.selectedAmin.email)
      this.message.successToast("Thuê người hỗ trợ thành công")
     
      this.navCtrl.setRoot(SettingsPage).then((event)=>{
        this.navCtrl.push(ListSupportPage)
      })

    }catch(err){

    }
    this.loadingSupport  = false
  }
  moveTabView(){
    this.navCtrl.setRoot(TabsPage).then((e)=>{
      this.navCtrl.parent.select(0)
    });
  }
}
