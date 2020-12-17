import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { ToastController } from '@ionic/angular';

declare var google:any;

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {
  areaname: string = ""
  map:any;
  infoWindow: any = new google.maps.InfoWindow();
  @ViewChild('map',{read: ElementRef, static:false}) mapRef: ElementRef;
  umnPos: any = {
    lat: -6.256081,
    lng: 106.618755
  };

  ionViewDidEnter(){
    // this.periodic();
    this.showCurrentLoc();
  }

  periodic(){
    let currentuid = window.localStorage.getItem('uid') ? window.localStorage.getItem('uid') : '';
    let currentemail = window.localStorage.getItem('email') ? window.localStorage.getItem('email') : '';
    const {areaname} = this
    setInterval(() => {
      navigator.geolocation.getCurrentPosition( position =>{
        this.fDB.object('locations/'+currentuid+Date.now()).set({
          uid:currentuid,
          email: currentemail,
          areaname: ('Lat : '+position.coords.latitude+', lng: '+position.coords.longitude),
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          createdAt: Date.now()
        });
      })
    }, 600000);
  }

  checkin(){
    let currentuid = window.localStorage.getItem('uid') ? window.localStorage.getItem('uid') : '';
    let currentemail = window.localStorage.getItem('email') ? window.localStorage.getItem('email') : '';
    const {areaname} = this
    try{
      if(areaname==''){
        this.toast('Isi nama lokasi Anda','danger');
      }else{
        navigator.geolocation.getCurrentPosition( position =>{
          this.fDB.object('locations/'+currentuid+Date.now()).set({
            uid:currentuid,
            email: currentemail,
            areaname: areaname,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            createdAt: Date.now()
          });
        });
      }
    }catch(error){
      console.dir(error.code)
    }
    this.showMap(this.umnPos);
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition( position =>{
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        this.infoWindow.setPosition(pos);
        this.infoWindow.setContent(areaname);
        this.infoWindow.open(this.map);
        this.map.setCenter(pos);
      });
    }
  }

  showCurrentLoc(){
    this.showMap(this.umnPos);
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition( position =>{
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        console.log(pos);
        this.infoWindow.setPosition(pos);
        this.infoWindow.setContent('Your Current Location');
        this.infoWindow.open(this.map);
        this.map.setCenter(pos);
      });
    }
  }
  

  showMap(pos: any){
    console.log('test', pos);
    const location = new google.maps.LatLng(pos.lat, pos.lng);
    const options = {
      center: location,
      zoom: 13,
      disableDefaultUI: true
    };
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);
  }

  constructor(private fDB: AngularFireDatabase,  public toastr: ToastController) { }

  ngOnInit() {
    
  }
  async toast(message, status){
    const toast = await this.toastr.create({
      message: message,
      position: 'top',
      color: status,
      duration: 2000
    });

    toast.present();
  }


}
