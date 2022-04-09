import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, deleteField, doc, docData, Firestore, getDoc, getDocs, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { concatMap, Observable } from 'rxjs';
import { Adresse } from '../models/adresse.model';

@Injectable({
  providedIn: 'root'
})
export class AdressesService {

  constructor(private firestore: Firestore) { }

  addAdressse(adresse: Adresse) {
    const adresseRef = collection(this.firestore, 'adresses'); 
    return addDoc(adresseRef, adresse);
  }

  getAdresses(): Observable<Adresse[]> {
    const adresseRef = collection(this.firestore, 'adresses');
    return collectionData(adresseRef, { idField: 'id' }) as Observable<Adresse[]>;
  }

  getByAdresse(adresse: any){
    const adresseRef = query(collection(this.firestore, 'adresses'), where("adresse", "==", adresse));
    return collectionData(adresseRef, { idField: 'id' });
  }

  getByNom(nom: any){
    const adresseRef = query(collection(this.firestore, 'adresses'), where("nom", "==", nom));
    return collectionData(adresseRef, { idField: 'id' });
  }
  
  getAdresseDepot(): Observable<Adresse[]>{
    const adresseRef = query(collection(this.firestore, 'adresses'), where("status", "==", "depot"));
    return collectionData(adresseRef, { idField: 'id' }) as Observable<Adresse[]>;
  }

  deleteAdresse(id: string) {
    const adresseRef = doc(this.firestore, 'adresses', id);
    return deleteDoc(adresseRef);
  }

  async setStatusDepot(id: string) {
    const depotRef = doc(this.firestore, 'adresses', id);
    let r = {'status': 'depot'}
    await setDoc(depotRef, r, { merge: true });
  }

  async deleteStatusDepot(id: string) {
    const depotRef = doc(this.firestore, 'adresses', id);
    await updateDoc(depotRef, {status: deleteField()});
  }

}
