import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController, ViewController } from 'ionic-angular';
import { InfoProvider } from '../../providers/info/info';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  [x: string]: any;
  data: {
    knowledge:string,
    looking:string,
    relationship:string,
    min_height:string,
    max_height:string,
    min_age:number,
    max_age:number,
    smoke:string,
    religion:string,
  }
  age: any = { lower: 18, upper: 30 }
  constructor(
    public info: InfoProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
  ) { }

  ionViewDidLoad() {
    if(this.navParams.get('mode') == 'crush'){
      this.data = JSON.parse(localStorage.getItem('filter-crush'))
    }else{
      this.data = JSON.parse(localStorage.getItem('filter-view'))
    }
    
  
    if(!this.data){
      this.data = {
        knowledge : "Không bằng cấp",
        looking : "Hẹn hò",
        relationship :  "Độc thân",
        min_height : "100",
        max_height : "200",
        smoke : "Không sao",
        religion :  "Không",
        min_age :  this.age.lower,
        max_age :  this.age.upper
      }
    }else{
      this.age.lower = this.data.min_age
      this.age.upper = this.data.max_age
    }

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  saveFilter(){
    this.data.min_age = this.age.lower
    this.data.max_age = this.age.upper
    if(this.navParams.get('mode') == 'crush'){
      localStorage.setItem('filter-crush',JSON.stringify(this.data))
    }else{
      localStorage.setItem('filter-view',JSON.stringify(this.data))
    }
    console.log( this.data)
    this.viewCtrl.dismiss(this.data);
  }
  openDialogKnowledge() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Trình độ học vấn');
    let values = [
      'Không bằng cấp','Trường đặc biệt','Một số trường trung học','Mức độ liên kết',
      'Tốt nghiệp trung học','Một số trường cao đẳng', 'Đang là Học viên','Cử nhân','Bằng thạc sĩ','Tiến sĩ/Nghiên cứu sinh','Khác',
    ]
    values.forEach(value =>{
      alert.addInput({
        type: 'radio',
        label:  value,
        value: value,
        checked: value == this.data.knowledge
      });
    })
   

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        console.log( 'trình độ học vấn',data)
        if(data){
          this.data.knowledge = data
        }
        // this.testcheckboxOpen = false;
        // this.testcheckboxResult = data;
      }
    });
    alert.present();
  }

  openDialogSearching() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Đang tìm kiếm');
    let values = [
      'Quan hệ nghiêm túc', 'Hẹn hò','Tình bạn',
    ]
    values.forEach(value =>{
      alert.addInput({
        type: 'radio',
        label:  value,
        value: value,
        checked: value == this.data.looking
      });
    })

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        console.log( 'đang tìm kiếm',data)
        if(data){
          this.data.looking = data
        }
      }
    });
    alert.present();
  }

  openDialogRelate_status() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Trạng thái quan hệ');
    let values = [
      'Độc thân','Có quan hệ tình cảm','Đã kết hôn','Đã ly thân','Đã ly dị','Đã góa','Đang tìm hiểu','Phức tạp',
    ]
    values.forEach(value =>{
      alert.addInput({
        type: 'radio',
        label:  value,
        value: value,
        checked: value == this.data.relationship
      });
    })
    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        console.log( 'relationship',data)
        if(data){
          this.data.relationship = data
        }
      }
    });
    alert.present();
  }

  openDialogHeight_least() {
    const prompt = this.alertCtrl.create({
      title: 'Cao từ',
      inputs: [{
        name: "Cao từ ",
        value: this.data.min_height
      }],
      buttons: [
        {
          text: 'Ok',
          handler: data => {
            console.log( 'min-heigh',data)
            if(data){
              this.data.min_height = data
            }
          }
        },
        {
          text: 'Cancel',
          handler: data => {
          }
        }
      ]
    });
    prompt.present();
  }

  openDialogHeight_maximum() {
    const prompt = this.alertCtrl.create({
      title: 'Cao đến',
      inputs: [{
        name: "Cao đến",
        value: this.data.max_height
      }],
      buttons: [
        {
          text: 'Ok',
          handler: data => {
            console.log( 'max-heigh',data)
            if(data){
              this.data.max_height = data
            }
          }
        },
        {
          text: 'Cancel',
          handler: data => {
          }
        }
      ]
    });
    prompt.present();
  }

  openDialogSmoking() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Hút thuốc');
    let values = [
      'Không sao','Có','Không',
    ]
    values.forEach(value =>{
      alert.addInput({
        type: 'radio',
        label:  value,
        value: value,
        checked: value == this.data.smoke
      });
    })

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        console.log( 'hút thuốc',data)
        if(data){
          this.data.smoke = data
        }
      }
    });
    alert.present();
  }

  openDialogReligion() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Tôn giáo');
    let values = [
      'Không','Hồi giáo','Đạo Phật','Do thái','Thiên Chúa giáo','Khác','Hỏi tôi',
    ]
    values.forEach(value =>{
      alert.addInput({
        type: 'radio',
        label:  value,
        value: value,
        checked: value == this.data.religion
      });
    })

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        console.log( 'religion',data)
        if(data){
          this.data.religion = data
        }
      }
    });
    alert.present();
  }

}
