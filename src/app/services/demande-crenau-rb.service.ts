import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, docData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { DemandecrenauRB } from '../models/demandeCrenauRB.model';

@Injectable({
  providedIn: 'root'
})
export class DemandeCrenauRBService {

  constructor(private firestore: Firestore) { }

  // addDemandeCrenauRB(crenauRB: DemandecrenauRB) {
  //   const crenauRef = collection(this.firestore, 'demandeCrenauRB'); 
  //   return addDoc(crenauRef, crenauRB);
  // }

  async addDemandeCrenauRB(crenau: DemandecrenauRB) {
    const crenauRef = collection(this.firestore, 'demandeCrenauRB');
    const docRef = await addDoc(crenauRef, crenau);
    return docRef.id;
  }

  getDemandeCrenauRB(): Observable<DemandecrenauRB[]> {
    const crenauxRef = collection(this.firestore, 'demandeCrenauRB');
    return collectionData(crenauxRef, { idField: 'id' }) as Observable<DemandecrenauRB[]>;
  }

  getDemandeCrenauRBByID(id: string){
    const crenauRef = doc(this.firestore, `demandeCrenauRB/${id}`);
    return docData(crenauRef, { idField: 'id' }) as Observable<DemandecrenauRB>;
  }
}
