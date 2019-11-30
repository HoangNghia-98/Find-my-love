import { Component } from '@angular/core';
import {  NavController, NavParams, ViewController } from 'ionic-angular';
import { VideoCallService } from '../../providers/video-call/video-call.service';



@Component({
  selector: 'page-video-call',
  templateUrl: 'video-call.html',
})
export class VideoCallPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public apirtc: VideoCallService,
  ) {
  }

  ngOnInit() {
    let el:any = document.getElementById("mini");
      console.log( el)
    el.addEventListener("touchmove", (e) => {
      //console.log({x:e.targetTouches[0].pageX, y:e.targetTouches[0].pageY})
      el.style.left = (e.targetTouches[0].pageX - el.offsetWidth/2) + "px";
      el.style.top = (e.targetTouches[0].pageY - el.offsetHeight/2) + "px";
    })
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
 
}
