import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { InfoProvider } from '../../providers/info/info';
import { SuitablePage } from '../../modals/suitable/suitable';
import { AddressPage } from '../../modals/address/address';
import { UserProvider } from '../../providers/user/user';
import { HttpHeaders, HttpClient } from '@angular/common/http';


@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html',
})
export class ProfilePage {
    data: any
    constructor(
        public info: InfoProvider,
        public navCtrl: NavController,
        public navParams: NavParams,
        public alertCtrl: AlertController,
        public modalCtrl: ModalController,
        public user: UserProvider,
        private http: HttpClient,
    ) 
    {}

    ionViewDidLoad() {
        console.log('ionViewDidLoad ProfilePage');
        console.log(this.info.infos)
    }
   async updateInfo(info:any){
    try{
      await this.user.updateInfo(info)
    }catch(err){
      console.log(err)
    }
   }
    openDialogRelate_status() {
        let alert = this.alertCtrl.create();
        alert.setTitle('Trạng thái quan hệ');
    
        alert.addInput({
          type: 'radio',
          label: 'Độc thân',
          value: 'Độc thân',
        });
    
        alert.addInput({
            type: 'radio',
            label: 'Có quan hệ tình cảm',
            value: 'Có quan hệ tình cảm',
        });
    
        alert.addInput({
            type: 'radio',
            label: 'Đã kết hôn',
            value: 'Đã kết hôn',
        });
        alert.addInput({
            type: 'radio',
            label: 'Đã ly thân',
            value: 'Đã ly thân',
        });
        alert.addInput({
            type: 'radio',
            label: 'Đã ly dị',
            value: 'Đã ly dị',
        });
        alert.addInput({
            type: 'radio',
            label: 'Đã góa',
            value: 'Đã góa',
        });
        alert.addInput({
            type: 'radio',
            label: 'Đang tìm hiểu',
            value: 'Đang tìm hiểu',
        });
        alert.addInput({
            type: 'radio',
            label: 'Phức tạp',
            value: 'Phức tạp',
        });
        alert.addInput({
            type: 'radio',
            label: 'Hỏi tôi',
            value: 'Hỏi tôi',
        });
     
        alert.addButton('Cancel');
        alert.addButton({
          text: 'OK',
          handler: data => {
            console.log(data)
            this.updateInfo({
              relate_status:data
            })
          }
        });
        alert.present();
    }
   
    openDialogJob() {
 
        const prompt = this.alertCtrl.create({
            title: 'việc làm',
            inputs: [{
                name: "job",
                value: this.info.infos.job
            }],
            buttons: [{
              text:'Cancel',
              handler: data=>{

              }
            },
                {
                    text: 'Ok',
                    handler: data => {
                      console.log('Saved clicked', data);
                      this.updateInfo({
                        job:data.job
                      })
                    }
                }
            ]
        });
        prompt.present();
    }

    openDialogName() {
        
        const prompt = this.alertCtrl.create({
            title: 'Sửa thông tin',
            inputs: [{
                name: "Name",
                value: this.info.infos.displayName
            }, {
                name: "Ngày sinh",
                value: this.info.infos.date,
                type:'date'
            }],
            buttons: [
                {
                    text: 'Cancel',
                    role:'cancel',
                    handler: data => {
                    }
                },
                {
                    text: 'Save',
                    handler: data => {
                        console.log('Saved clicked', data, new Date(data['Ngày sinh']));
                        this.updateInfo({
                          displayName:data['Name'],
                          date:data['Ngày sinh']
                        })
                    }
                }
            ]
        });
        prompt.present();
    }
    openDialogSuitable(){
        let profileModal = this.modalCtrl.create(SuitablePage, {suitable: this.info.infos.suitable});
         profileModal.onDidDismiss(data => {
           console.log(data);
           if(!data.close){
            this.updateInfo({
              suitable: data.suitable
            })
          }
         });
         profileModal.present();
    }

    openDialogAddress(){
       
            // let contactModal = this.modalCtrl.create(AddressPage);
            // contactModal.present();
          
            let profileModal = this.modalCtrl.create(AddressPage,{address:this.info.infos.address});
            profileModal.onDidDismiss(data => {
              console.log(data);
              if(!data.close){
                this.updateInfo({
                  address: data.address
                })
              }
            });
            profileModal.present();
    }
    openDialogAge() {
        
      const prompt = this.alertCtrl.create({
          title: 'Độ tuổi',
          inputs: [{
              name: "age",
              value: this.info.infos.age
          }],
          buttons: [
            {
              text: 'Cancel',
              role:'cancel',
              handler: data => {
              }
          },
          {
              text: 'Save',
              handler: data => {
                  this.updateInfo({
                    age:data.age
                  })
              }
          }
          ]
      });
      prompt.present();
  }
      openDialogHeight() {
        
        const prompt = this.alertCtrl.create({
            title: 'Chiều cao',
            inputs: [{
                name: "height",
                value: this.info.infos.height
            }],
            buttons: [
              {
                text: 'Cancel',
                role:'cancel',
                handler: data => {
                }
            },
            {
                text: 'Save',
                handler: data => {
                    console.log('Saved clicked', data, new Date(data['Ngày sinh']));
                    this.updateInfo({
                      height:data.height
                    })
                }
            }
            ]
        });
        prompt.present();
    }

    openDialogWeight() {
        
        const prompt = this.alertCtrl.create({
            title: 'Cân nặng',
            inputs: [{
                name: "weight",
                value: this.info.infos.displayName
            }],
            buttons: [
              {
                text: 'Cancel',
                role:'cancel',
                handler: data => {
                }
            },
            {
                text: 'Save',
                handler: data => {
                    console.log('Saved clicked', data);
                    this.updateInfo({
                      weight: data.weight
                    })
                }
            }
            ]
        });
        prompt.present();
    }

    openDialogReligion(){
        let alert = this.alertCtrl.create();
    alert.setTitle('Tôn giáo');

    alert.addInput({
        type: 'radio',
        label: 'Cơ đốc giáo',
        value: 'Cơ đốc giáo',
    });
    alert.addInput({
        type: 'radio',
        label: 'Hồi giáo',
        value: 'Hồi giáo',
    });
    alert.addInput({
        type: 'radio',
        label: 'Đạo Phật',
        value: 'Đạo Phật',
    });
    alert.addInput({
        type: 'radio',
        label: 'Do thái',
        value: 'Do thái',
    });
    alert.addInput({
        type: 'radio',
        label: 'Thiên Chúa giáo',
        value: 'Thiên Chúa giáo',
    });
    alert.addInput({
        type: 'radio',
        label: 'khác',
        value: 'khác',
    });
    alert.addInput({
        type: 'radio',
        label: 'Hỏi tôi',
        value: 'Hỏi tôi',
      //   checked: true
    });
  
    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        console.log('Saved clicked', data);
                    this.updateInfo({
                      religion: data
         })
      }
    });
    alert.present();
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
           image: res['data'].link
         })
         this.loadImageDone = true 
      })
    }
    openVerifyAlert(){
      let alert = this.alertCtrl.create();
      alert.setTitle('Xác nhận thông tin');
      alert.setMessage(`<p>Bạn vui lòng gửi các tài liệu liên quan như ảnh CMND, 
        bằng lái xe, ... tới email <strong>admin@findmylove.com</strong> <br><br>Chúng tôi sẽ kiểm tra và cập nhật thông tin cho bạn. <br><br>Xin cảm ơn!</p>`);
      alert.addButton('OK');
      alert.setCssClass("alerVerify")
      alert.present();
    }
}
