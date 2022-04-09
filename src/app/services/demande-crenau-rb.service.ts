import { Injectable } from '@angular/core';
import { addDoc, arrayUnion, collection, collectionData, doc, docData, FieldValue, Firestore, orderBy, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
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
    return docRef.id; // recuperer l'id
  }

  getDemandeCrenauRB(): Observable<DemandecrenauRB[]> {
    const crenauxRef = query(collection(this.firestore, 'demandeCrenauRB'), orderBy("date", "desc"));
    return collectionData(crenauxRef, { idField: 'id' }) as Observable<DemandecrenauRB[]>;
  }

  getDemandeCrenauRBByID(id: string): Observable<DemandecrenauRB>{
    const crenauRef = doc(this.firestore, `demandeCrenauRB/${id}`);
    return docData(crenauRef, { idField: 'id' }) as Observable<DemandecrenauRB>;
  }

  async updateAdresseEnlevement(id: string, date: Date) {
    const crenauRef = doc(this.firestore, 'demandeCrenauRB', id);
    await updateDoc(crenauRef, {"adresseEnlevement.recupere": date});
  }

  async updateAdresseLivraison(id: string, tabLivraison: any) {
    const crenauRef = doc(this.firestore, 'demandeCrenauRB', id);
    let adresseLivraison = {'adresseLivraison': tabLivraison}

    await setDoc(crenauRef, adresseLivraison, { merge: true });
  }

  async setStatusLivraison(id: string, etat: string) {
    const crenauRef = doc(this.firestore, 'demandeCrenauRB', id);
    let r = {'status': etat}
    await setDoc(crenauRef, r, { merge: true });
  }

}
