import { Injectable } from '@angular/core';
import { addDoc, arrayRemove, arrayUnion, collection, collectionData, deleteDoc, doc, docData, Firestore, getDocs, increment, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Crenau } from '../models/crenau.model';

@Injectable({
  providedIn: 'root'
})
export class CrenauService {

  constructor(private firestore: Firestore) { }

  // ajouter un crenau
  addCrenau(crenau: Crenau) {
    const crenauRef = collection(this.firestore, 'crenau'); 
    return addDoc(crenauRef, crenau);
  }

  // retourner tous les crenaux
  getCrenaux(): Observable<Crenau[]> {
    const booksRef = collection(this.firestore, 'crenau');
    return collectionData(booksRef, { idField: 'id' }) as Observable<Crenau[]>;
  }

  // ajouter 1 au inscrit
  incrementInscrit(crenau: Crenau) {
    const bookDocRef = doc(this.firestore, `crenau/${crenau.id}`);
    return updateDoc(bookDocRef, { inscrit: increment(1) });
  }

  // retirer 1 au inscrit
  decrementInscrit(crenau: Crenau) {
    const bookDocRef = doc(this.firestore, `crenau/${crenau.id}`);
    return updateDoc(bookDocRef, { inscrit: increment(-1) });
  }
  // retirer 1 au inscrit (mon planning)
  decrementInscrit2(crenauId: string) {
    const bookDocRef = doc(this.firestore, `crenau/${crenauId}`);
    return updateDoc(bookDocRef, { inscrit: increment(-1) });
  }

  // inscription d'un livreur
  addLivreur(crenau: Crenau, uid: string) {
    const crenauDocRef = doc(this.firestore, `crenau/${crenau.id}`);
    return updateDoc(crenauDocRef, { users: arrayUnion(uid) });
  }

  // suppresion d'un livreur
  removeLivreur(crenau: Crenau, uid: string) {
    const crenauDocRef = doc(this.firestore, `crenau/${crenau.id}`);
    // arrayRemove for remove
    return updateDoc(crenauDocRef, { users: arrayRemove(uid) });
  }

  // suppresion d'un livreur (mon planning)
  removeLivreur2(crenauId: string, uid: string) {
    const crenauDocRef = doc(this.firestore, `crenau/${crenauId}`);
    // arrayRemove for remove
    return updateDoc(crenauDocRef, { users: arrayRemove(uid) });
  }
  
  // suppression d'un crenau
  deleteCrenau(crenau: Crenau) {
    const crenauDocRef = doc(this.firestore, `crenau/${crenau.id}`);
    return deleteDoc(crenauDocRef);
  }

  // getCrenauByID(id: string){
  //   const crenauRef = doc(this.firestore, `crenau/${id}`);
  //   return docData(crenauRef, { idField: 'id' }) as Observable<Crenau>;
  // }

  // retourner les crenaux que l'user connecté à réservé
  getCrenauxInscritCurrentUser(userid: string): Observable<Crenau[]> {
    const crenauxRef = query(collection(this.firestore, 'crenau'), where("users", "array-contains", userid));
    return collectionData(crenauxRef, { idField: 'id' }) as Observable<Crenau[]>;
  }

  // retourner tous les crenaux par date
  getCrenauxByDate(date: string): Observable<Crenau[]> {
    const crenauxRef = query(collection(this.firestore, 'crenau'), where("dateString", "==", date));
    return collectionData(crenauxRef, { idField: 'id' }) as Observable<Crenau[]>;
  }
    
  // retourner tous les crenaux par semaine
  getCrenauxrBySemaine(tabDate: string[]): Observable<Crenau[]> {
    const crenauxRef = query(collection(this.firestore, 'crenau'), where("dateString", 'in', [tabDate[0], tabDate[1], tabDate[2], tabDate[3], tabDate[4], tabDate[5], tabDate[6]]));
    return collectionData(crenauxRef, { idField: 'id' }) as Observable<Crenau[]>;
  }

  // retourner les crenaux que l'user connecté à réservé et afficher par jour
  getCrenauxInscritCurrentUserByDate(userid: string, date: string): Observable<Crenau[]> {
    const crenauxRef = query(collection(this.firestore, 'crenau'), where("users", "array-contains", userid), where("dateString", "==", date));
    return collectionData(crenauxRef, { idField: 'id' }) as Observable<Crenau[]>;
  }

  // retourner les crenaux que l'user connecté à réservé et afficher par semaine
  getCrenauxInscritCurrentUserBySemaine(userid: string, tabDate: string[]): Observable<Crenau[]> {
    const crenauxRef = query(collection(this.firestore, 'crenau'), where("users", "array-contains", userid), where("dateString", 'in', [tabDate[0], tabDate[1], tabDate[2], tabDate[3], tabDate[4], tabDate[5], tabDate[6]]));
    return collectionData(crenauxRef, { idField: 'id' }) as Observable<Crenau[]>;
  }

}
