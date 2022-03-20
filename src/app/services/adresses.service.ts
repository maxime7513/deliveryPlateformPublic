import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, Firestore } from '@angular/fire/firestore';
import { concatMap, Observable } from 'rxjs';
import { Adresse } from '../models/adresse.model';

@Injectable({
  providedIn: 'root'
})
export class AdressesService {

  constructor(private firestore: Firestore) { }

  addAdressse(adresse: Adresse) {
    const crenauRef = collection(this.firestore, 'adresses'); 
    return addDoc(crenauRef, adresse);
  }

  getAdresses(): Observable<Adresse[]> {
    const usersRef = collection(this.firestore, 'adresses');
    return collectionData(usersRef, { idField: 'id' }) as Observable<Adresse[]>;
  }

}
