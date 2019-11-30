import { Component, ViewChild } from '@angular/core';
import {  NavController, NavParams, ViewController } from 'ionic-angular';
import { MapsAPILoader } from '@agm/core';
import { PlacePredictionService } from '../../providers/google-service/place-prediction.service';
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the AddressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-address',
  templateUrl: 'address.html',
})
export class AddressPage {
  @ViewChild("map") mapElement;
  searchTerm:String  = ""
  results$: Observable<any[]>
  map:any
  lat: number = 51.678418;
  lng: number = 7.809007;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public mapsAPILoader: MapsAPILoader,
    public placePredictionService: PlacePredictionService
  ) {
  }

  ngOnInit() {
    console.log('ionViewDidLoad AddressPage');
    this.searchTerm =  this.navParams.get('address')
    this.initMap()
  }
  dismiss() {
    this.viewCtrl.dismiss({
      close:true
    });
  }
  saveAddress(){
    this.viewCtrl.dismiss({
      close: false,
      address: this.searchTerm
    });
  }
  initMap(){
    // let coords = new google.maps.LatLng(45,100)
    // let mapOptions: google.maps.MapOptions = {
    //   center: coords,
    //   zoom: 14,
    //   mapTypeId: google.maps.MapTypeId.ROADMAP
    // }
    // this.map = new google.maps.Map(this.mapElement.nativeElement,mapOptions)
  }
  typingTimer:any
    onSearch(term: string){
        clearTimeout(this.typingTimer);
      this.typingTimer =   setTimeout(() => {
            console.log('lauch',this.placePredictionService)
            this.searchTerm = term;
          
            if (this.searchTerm === '') return;
          
            this.results$ = this.placePredictionService.getPlacePredictions(term);
        },300)
    }
    releaseSearch(){
      clearTimeout(this.typingTimer);
  }

  setAddress(event){
      console.log(event);
      this.searchTerm = event.innerText
      console.log(this.searchTerm)
  }
}
