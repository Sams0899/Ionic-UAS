import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import * as firebase from "../firebase";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  searchedUsers = [];
  tempfriends = [];
  constructor(private fDB: AngularFireDatabase,
    public toastr: ToastController,
    private router: Router  
  ) {}
  
  ionViewDidEnter(){
    if(localStorage.getItem('friend status')!=null){
      if(localStorage.getItem("friend status")=='Berhasil ditambah')
      {
        this.toast('Berhasil menambahkan teman','success');
        localStorage.removeItem('friend status');
      }else{
        this.toast('Berhasil menghapus dari daftar teman', 'success');
        localStorage.removeItem('friend status');
      }
    }
    let curremail = window.localStorage.getItem('email') ? window.localStorage.getItem('email') : '';
    this.fDB.database.ref("friends").orderByChild("uid")
      .once("value", snapshot=>{
        this.tempfriends = [];
        snapshot.forEach(childSnap=>{
          if((childSnap.val().email)!=curremail){
            this.tempfriends.push(childSnap.val());
          }
        });
      })
  }
  ngOnInit(){
    let email = window.localStorage.getItem('email') ? window.localStorage.getItem('email') : '';
    let uid = window.localStorage.getItem('uid') ? window.localStorage.getItem('uid') : '';
    if(email == '' && uid == '') {
      this.router.navigateByUrl('/login');
    }else{
      this.router.navigateByUrl('/tabs');
    }
  }

  addfriend(event, uid,email){
    let currentuid = window.localStorage.getItem('uid') ? window.localStorage.getItem('uid') : '';
    let currentemail = window.localStorage.getItem('email') ? window.localStorage.getItem('email') : '';
    var friends = this.fDB.database.ref('friends/'+currentuid+uid);
    friends.on('value', (snapshot)=>{
      if(snapshot.exists()){
        this.toast('Sudah terdaftar menjadi teman Anda','danger');
      }else{
        this.fDB.object('friends/'+currentuid+uid).set({
          uid: currentuid,
          email:currentemail,
          friendid: uid,
          friendemail: email
        });
        this.fDB.object('friends/'+uid+currentuid).set({
          uid: uid,
          email: email,
          friendid: currentuid,
          friendemail: currentemail
        });
        window.localStorage.setItem('friend status', 'Berhasil ditambah');
        this.ionViewDidEnter();
      }
    })
  }

  removefriend(event, uid,email){
    let currentuid = window.localStorage.getItem('uid') ? window.localStorage.getItem('uid') : '';
    let currentemail = window.localStorage.getItem('email') ? window.localStorage.getItem('email') : '';
    var friends = this.fDB.database.ref('friends/'+currentuid+uid);
    friends.on('value', (snapshot)=>{
        this.fDB.object('friends/'+currentuid+uid).remove();
        this.fDB.object('friends/'+uid+currentuid).remove();
        window.localStorage.setItem('friend status', 'Berhasil dihapus');
        this.ionViewDidEnter();
    })
  }

  search(event){
    var key: string = event.target.value;
    var lowerCasekey = key.toLowerCase();

    if(lowerCasekey.length > 0){
      let email = window.localStorage.getItem('email') ? window.localStorage.getItem('email') : '';
      this.fDB.database.ref("profile").orderByChild("email").startAt(lowerCasekey).endAt(lowerCasekey + "\uf8ff")
      .once("value", snapshot=>{
        this.searchedUsers = [];
        snapshot.forEach(childSnap=>{
          if((childSnap.val().email)!=email){
            this.searchedUsers.push(childSnap.val());
          }
        });
      })
    }else{
      this.searchedUsers = [];
    }
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
