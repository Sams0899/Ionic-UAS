import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string = ""
  password: string =""
  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    public loadingCtrl: LoadingController,
    public toastr: ToastController,
    public user: ProfileService
  ) { }

  ngOnInit() {
  }

  async login(){
    const loading = await this.loadingCtrl.create({
      message: "Login...",
      spinner: 'crescent',
      showBackdrop: true
    });
    const { email, password } = this
    try{
      loading.present();
      const res = await this.afAuth.signInWithEmailAndPassword(email, password);
      loading.dismiss();
      if(res.user.emailVerified==true){
        this.afAuth.currentUser.then(function(currentUser:any){console.log(currentUser.uid)});
        window.localStorage.setItem('email', email);
        window.localStorage.setItem('uid',res.user.uid);
          // .then(function(user:any){
          //   console.log(user);
          // })
        console.log('login berhasil');
        if(res.user){
          this.user.setUser({
            email, uid: res.user.uid
          })
          this.router.navigateByUrl('/tabs');
        }
      }else{
        this.toast('Tolong verifikasi email Anda','danger');
      }
    }catch(err){
      loading.dismiss();
      console.dir(err)
      if(err.code == "auth/user-not-found"){
        this.toast('Akun tidak terdaftar','danger');
      }else if(err.code == "auth/wrong-password"){
        this.toast('Email atau kata sandi salah','danger');
      }else if(err.code == "auth/invalid-email"){
        this.toast('Email kosong atau tidak valid','danger');
      }else{
        this.toast(err.message,'danger');
      }
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
