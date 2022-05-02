import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, Firestore, orderBy, query, setDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { BonLivraisonRosebaie } from '../models/bonLivraisonRosebaie.model';

@Injectable({
  providedIn: 'root'
})
export class BonLivraisonRosebaieService {

  constructor(private firestore: Firestore) { }

  async addBonLivraison(bonLivraison: any) {
    await setDoc(doc(this.firestore, "bonLivraisonRosebaie", bonLivraison.id), bonLivraison);
  }

  async setBonLivraisonSigne(id: string, urlBonLivraisonSigne: string){
    const bonLivraisonSigneRef = doc(this.firestore, 'bonLivraisonRosebaie', id);
    let bonLivraisonSigne = {'urlBonLivraisonSigne': urlBonLivraisonSigne};

    await setDoc(bonLivraisonSigneRef, bonLivraisonSigne, { merge: true });
  }

  getBonLivraison(): Observable<BonLivraisonRosebaie[]> {
    const bonLivraisonRef = collection(this.firestore, 'bonLivraisonRosebaie');
    return collectionData(bonLivraisonRef, { idField: 'id' }) as Observable<BonLivraisonRosebaie[]>;
  }
  
  getBonLivraisonByNom(nom:string): Observable<BonLivraisonRosebaie[]> {
    const bonLivraisonRef = query(collection(this.firestore, 'bonLivraisonRosebaie'), where("nom", "==", nom), orderBy("date"));
    return collectionData(bonLivraisonRef, { idField: 'id' }) as Observable<BonLivraisonRosebaie[]>;
  }
}
