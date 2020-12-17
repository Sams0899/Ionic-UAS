import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ProfileService } from '../profile.service';
import { AngularFireDatabase } from '@angular/fire/database'

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  email: string = ""
  fullname: string = ""
  password: string = ""
  cpassword: string = ""

  constructor(public afAuth: AngularFireAuth,
    private router:Router,
    public alertController: AlertController, 
    public loadingCtrl: LoadingController,
    public toastr: ToastController,
    public afDB: AngularFireDatabase,
    public user: ProfileService
    ) { }

  ngOnInit() {
  }

  async register(){
    const loading = await this.loadingCtrl.create({
      message: "Mendaftarkan Akun Anda...",
      spinner: 'crescent',
      showBackdrop: true
    });
    const alert = await this.alertController.create({
      header: 'Konfirmasi Email',
      subHeader: '',
      message: 'Cek email untuk konfirmasi email Anda.',
      buttons: ['OK']
    });
    loading.present();
    const {email, fullname, password, cpassword} = this
    if(password !== cpassword){
      loading.dismiss();
      this.toast('Password tidak sama','danger');
    }else{
      try{
        loading.dismiss();
        const res = await this.afAuth.createUserWithEmailAndPassword(email,password);
        this.afDB.object('profile/'+res.user.uid).set({
          email: email,
          name: fullname,
          uid: res.user.uid,
          createdAt: Date.now()
        });
        await res.user.sendEmailVerification();
        await alert.present();
        // console.log(res.user);
        let result = await alert.onDidDismiss();
        this.router.navigateByUrl('/login');
      }catch(error){
        console.dir(error.code)
        if(error.code=='auth/email-already-in-use'){
          this.toast('Email sudah digunakan','danger');
        }
        if(error.code=='auth/weak-password'){
          this.toast('Kata sandi terlalu lemah. Kurang dari 6 karakter','danger');
        }
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
