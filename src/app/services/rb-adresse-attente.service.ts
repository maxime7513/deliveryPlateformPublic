import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, orderBy, query, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { rbLivraisonAttente } from '../models/rbLivraisonAttente';

@Injectable({
  providedIn: 'root'
})
export class RBAdresseAttenteService {

  constructor(private firestore: Firestore) { }

  addLivraisonAttente(adresse: rbLivraisonAttente) {
    const adresseRef = collection(this.firestore, 'rbLivraisonAttente'); 
    return addDoc(adresseRef, adresse);
  }
  
  getLivraisonsAttente(): Observable<rbLivraisonAttente[]> {
    const adresseRef = query(collection(this.firestore, 'rbLivraisonAttente'), orderBy("date"));
    return collectionData(adresseRef, { idField: 'id' }) as Observable<rbLivraisonAttente[]>;
  }

  deleteLivraisonsAttente(id: string) {
    const adresseRef = doc(this.firestore, 'rbLivraisonAttente', id);
    return deleteDoc(adresseRef);
  }

}
