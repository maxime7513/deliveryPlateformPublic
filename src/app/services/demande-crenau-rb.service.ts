import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { DemandecrenauRB } from '../models/demandeCrenauRB.model';

@Injectable({
  providedIn: 'root'
})
export class DemandeCrenauRBService {

  constructor(private firestore: Firestore) { }

    addDemandeCrenauRB(crenauRB: DemandecrenauRB) {
      const crenauRef = collection(this.firestore, 'demandeCrenauRB'); 
      return addDoc(crenauRef, crenauRB);
    }
}
