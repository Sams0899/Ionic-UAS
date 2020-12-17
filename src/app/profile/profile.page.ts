import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  tempLocation = [];
  userInfo = [];
  date:Date;
  constructor(private fDB: AngularFireDatabase,
    private router: Router  
  ) {
    setInterval(()=>{
      this.date = new Date()
    }, 1000)
  }

  ionViewDidEnter(){
    let curremail = window.localStorage.getItem('email') ? window.localStorage.getItem('email') : '';
    this.fDB.database.ref("locations").orderByChild("email")
      .once("value", snapshot=>{
        this.tempLocation = [];
        snapshot.forEach(childSnap=>{
          if((childSnap.val().email)==curremail){
            this.tempLocation.push(childSnap.val());
          }
        });
      })
    this.fDB.database.ref("profile").orderByChild("email")
      .once("value", snapshot=>{
        this.userInfo = [];
        snapshot.forEach(snapvalue=>{
          if((snapvalue.val().email)==curremail){
            this.userInfo.push(snapvalue.val());
            console.log(snapvalue.val());
          }
        });
      })
  }
  ngOnInit() {
  }
  
  removelocation(event, createdAt){
    let currentuid = window.localStorage.getItem('uid') ? window.localStorage.getItem('uid') : '';
    let currentemail = window.localStorage.getItem('email') ? window.localStorage.getItem('email') : '';
    console.log(createdAt);
    var locations = this.fDB.database.ref('locations/'+currentuid+createdAt);
    locations.on('value', (snapshot)=>{
        this.fDB.object('locations/'+currentuid+createdAt).remove();
        this.ionViewDidEnter();
    })
  }
  logout(){
    this.router.navigateByUrl('/login');
    window.localStorage.removeItem('email');
    window.localStorage.removeItem('uid');
  }


}
