import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

Injectable({
  providedIn: 'root'
})

interface user{
  email: string,
  uid: string
}

export class ProfileService {
  private user: user

  constructor(){

  }

  setUser(user: user){
    this.user = user;
  }

  getUID(){
    return this.user.uid;
  }
}
