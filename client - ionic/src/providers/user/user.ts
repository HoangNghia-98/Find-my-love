import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageProvider } from '../message/message';
import firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { GooglePlus } from '@ionic-native/google-plus'
import { Facebook } from "@ionic-native/facebook"
import { ApiProvider } from '../api/api';
import { InfoProvider } from '../info/info';
import { LoadingController } from 'ionic-angular';
/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {
  user: any
  constructor(
    public http: HttpClient,
    public loadingCtrl: LoadingController,
    public message: MessageProvider,
    public api: ApiProvider,
    public info: InfoProvider,
    public fire: AngularFireAuth,
    public googleplus: GooglePlus,
    public facebook: Facebook

  ) {
    console.log('Hello UserProvider Provider');

  }

  async loginWithFacebook() {
    let check = false;
    let res
    let loader
    try {
      // let provider = new firebase.auth.FacebookAuthProvider();
      // let res = await this.fire.auth.signInWithPopup(provider)
      res = await this.facebook.login(['email'])
      loader = this.loadingCtrl.create({
        content: "Please wait..."
      });
      loader.present();
      const fc = await firebase.auth.FacebookAuthProvider.credential(res["authResponse"].accessToken)
      await firebase.auth().signInWithCredential(fc)
      check = true;
    } catch (err) {
      console.log('err', err)
      check = false
      if (err.code === "auth/account-exists-with-different-credential") {
        this.message.errorToast(`Email: ${err.email} đã được đăng kí ở phương thức khác. Xin vui lòng kiểm tra lại`)
      }
    }
    if (check) {
      await this.getUserToken()
      let tmp = await this.loginInServerWithSocial()
      loader.dismiss()
      return tmp
    }
    if (loader) {
      loader.dismiss()
    }
  }
  async loginWithGoogle() {
    let check = false;
    let loader
    try {
      const res = await this.googleplus.login({
        'webClientId': '980107505961-8ure62aiirnenihe63sn6jnq8a3p0bi3.apps.googleusercontent.com',
        'offline': true
      })
      loader = this.loadingCtrl.create({
        content: "Please wait..."
      });
      loader.present();
      await firebase.auth().signInWithCredential(
        firebase.auth.GoogleAuthProvider.credential(res.idToken)
      )
      check = true
    } catch (err) {
      check = false
      alert(err)
    }
    if (check) {
      await this.getUserToken()
      let tmp = await this.loginInServerWithSocial()
      loader.dismiss()
      return tmp
    }
    if (loader) {
      loader.dismiss()
    }

  }
  async login(credentials) {
    let check = false;
    try {
      let res = await this.fire.auth.signInWithEmailAndPassword(credentials.email, credentials.password)
      console.log('logging', res)
      check = true
    } catch (err) {
      check = false
      console.log("err google", err)
      if (err.code === "auth/user-not-found") {
        this.message.errorToast("Tài khoản không tồn tại.")
      }
    }
    if (check) {
      await this.getUserToken()
      return await this.loginInServer()
    }

  }
  async signup(credentials) {

    let check = false;
    try {
      let res = await this.fire.auth.createUserWithEmailAndPassword(credentials.email, credentials.password)
      console.log('logging', res)
      check = true
    } catch (err) {
      check = false
      console.log("err ", err)
    }
    if (check) {
      await this.getUserToken()
      return await this.signupInServer()
    }
  }
  logout() {
    this.fire.auth.signOut();
    this.info.token = ""
    this.info.infos = {
    }
  }
  async getUserToken() {
    this.info.token = await firebase.auth().currentUser.getIdToken(true)
    console.log("token from getUser", this.info.token)
  }
  async loginInServer() {
    const data = await this.api.post(this.api.link + "/api/accounts/login", {})
    return data
  }
  async loginInServerWithSocial() {

    const data = await this.api.post(this.api.link + "/api/accounts/login", { type: "social" })
    return data
  }
  async signupInServer() {
    const data = await this.api.post(this.api.link + "/api/accounts/signup", {})
    return data
  }
  async reloadUserInfo() {
    const data = await this.api.get(this.api.link + "/api/accounts/info")
    console.log( data)
    if (data['success']) {
      this.info.infos = data['user']
      return data['user']
    } else {
      this.message.errorToast("Lỗi khi lấy dữ liệu của user")
    }
  }
  async getUser() {
    const data = await this.api.get(this.api.link + "/api/accounts/profile")
    if (data['success']) {
      return data['users']
    } else {
      this.message.errorToast("Lỗi khi lấy dữ liệu của user")
    }
  }
  async likeUser(_id: any) {
    const data = await this.api.post(this.api.link + "/api/accounts/like", { _id })
    if (data['success']) {
      this.reloadUserInfo()
      return true
    } else {
      this.message.errorToast("Lỗi khi like user")
      return false
    }
  }
  async unlikeUser(_id: any) {
    const data = await this.api.delete(this.api.link + "/api/accounts/like", _id)
    if (data['success']) {
      this.reloadUserInfo()
      return true
    } else {
      this.message.errorToast("Lỗi khi unlike user")
      return false
    }
  }
  async getUserById(_id: any) {
    const data = await this.api.post(this.api.link + "/api/accounts/profile/id", { _id })
    if (data['success']) {
      return data['user']
    } else {
      this.message.errorToast("Lỗi khi lấy dữ liệu của user")
    }
  }
  async getListFriend() {
    try {
      const data = await this.api.get(this.api.link + "/api/accounts/friend/list")
      if (data['success']) {
        return data['user']
      } else {
        this.message.errorToast("Lỗi khi lấy dữ liệu của user")
      }
    } catch (err) {

    }

  }
  async addFriend(_id, hiMessage:String) {
      const data = await this.api.post(this.api.link + "/api/accounts/friend/add", {
        _id,
        hiMessage
      })
      if (data['success']) {
        await this.reloadUserInfo()
        this.message.successToast('Thêm bạn thành công')
      } else {
        this.message.errorToast("Lỗi khi thêm bạn")
        console.log('err', data['message'])
      }
  }
  async deleteFriend(_id){
      const data = await this.api.post(this.api.link + "/api/accounts/friend/delete", {
        _id
      })
      if (data['success']) {
        await this.reloadUserInfo()
        this.message.successToast('Xóa bạn thành công')
      } else {
        this.message.errorToast("Lỗi khi xóa bạn")
        console.log('err', data['message'])
      }
  }
  async updateInfo(info:any){
    console.log(info)
    const data = await this.api.post(this.api.link + "/api/accounts/update", info)
    if (data['success']) {
      this.message.successToast('Cập nhật thành công')
      await this.reloadUserInfo()
    } else {
      this.message.errorToast("Lỗi khi cập nhật")
      console.log('err', data['message'])
    }
  }
  async updateInfoNoToast(info:any){
    const data = await this.api.post(this.api.link + "/api/accounts/update", info)
    if (data['success']) {
      await this.reloadUserInfo()
    } else {
      this.message.errorToast("Lỗi khi cập nhật ")
      console.log('err', data['message'])
    }
  }
  async getSupport(friend:string,support:string){
    const data = await this.api.post(this.api.link + "/api/accounts/support/add", {friend,support})
    if (data['success']) {
      this.message.successToast('Thuê người hỗ trợ thành công')
      console.log( 'res',data['data'])
      await this.reloadUserInfo()
    } else {
      this.message.errorToast("Lỗi khi thuê người hỗ trợ")
      console.log('err', data['message'])
    }
  }
}
