import { Injectable } from '@angular/core';
import { addDoc, arrayRemove, arrayUnion, collection, collectionData, deleteDoc, doc, docData, Firestore, getDocs, increment, orderBy, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Crenau } from '../models/crenau.model';

@Injectable({
  providedIn: 'root'
})
export class AstreinteService {

  constructor(private firestore: Firestore) { }

  addAstreinte(crenau: Crenau) {
    const astreinteRef = collection(this.firestore, 'astreinte'); 
    return addDoc(astreinteRef, crenau);
  }

  getAstreintes(): Observable<Crenau[]> {
    const astreintesRef = collection(this.firestore, 'astreinte');
    return collectionData(astreintesRef, { idField: 'id' }) as Observable<Crenau[]>;
  }

  // ajouter 1 au inscrit
  incrementInscrit(crenau: Crenau) {
    const incrementDocRef = doc(this.firestore, `astreinte/${crenau.id}`);
    return updateDoc(incrementDocRef, { inscrit: increment(1) });
  }

  // retirer 1 au inscrit
  decrementInscrit(crenauId: string) {
    const decrementDocRef = doc(this.firestore, `astreinte/${crenauId}`);
    return updateDoc(decrementDocRef, { inscrit: increment(-1) });
  }

  // inscription d'un livreur
  addLivreur(crenau: Crenau, uid: string) {
    const astreinteDocRef = doc(this.firestore, `astreinte/${crenau.id}`);
    return updateDoc(astreinteDocRef, { users: arrayUnion({idUser : uid}) });
  }

  // désinscription d'un livreur
  removeLivreur(crenauId: string, uid: string) {
    const astreinteDocRef = doc(this.firestore, `astreinte/${crenauId}`);
    return updateDoc(astreinteDocRef, { users: arrayRemove({idUser : uid}) });
  }
  
  deleteAstreinte(crenau: Crenau) {
    const astreinteDocRef = doc(this.firestore, `astreinte/${crenau.id}`);
    return deleteDoc(astreinteDocRef);
  }

  getAstreinteByID(id: string): Observable<Crenau>{
    const crenauRef = doc(this.firestore, `astreinte/${id}`);
    return docData(crenauRef, { idField: 'id' }) as Observable<Crenau>;
  }

  async getAcceptAddAstreinte(Usersociete: any, date: string, heureDebut: number) {
    const astreintesRef = query(collection(this.firestore, 'astreinte'), where("societe", "==" , Usersociete), where("dateString", "==", date), where("heureDebut", "==", heureDebut));
    let resLength = await getDocs(astreintesRef);
    return resLength.size
  }

  // retourner tous les crenaux par date
  getAstreintesByDate(date: string): Observable<Crenau[]> {
    const astreintesRef = query(collection(this.firestore, 'astreinte'), where("dateString", "==", date), orderBy("date"));
    return collectionData(astreintesRef, { idField: 'id' }) as Observable<Crenau[]>;
  }

  // retourner tous les crenaux par date (filtrer par societe)
  getAstreintesByDateandSociete(Usersociete: any, date: string): Observable<Crenau[]> {
    const astreintesRef = query(collection(this.firestore, 'astreinte'), where("societe", "==" , Usersociete), where("dateString", "==", date));
    return collectionData(astreintesRef, { idField: 'id' }) as Observable<Crenau[]>;
  }

  // retourner les astreintes par date et par société et supérieur à l'heure actuelle
  getAstreintesValableByDateandSociete(dateString: string, date: Date, societe: string): Observable<Crenau[]> {
    const astreintesRef = query(collection(this.firestore, 'astreinte'), where("dateString", "==", dateString), where("societe", "==", societe), where("date", ">", date));
    return collectionData(astreintesRef, { idField: 'id' }) as Observable<Crenau[]>;
  }

  getAstreintesInscritCurrentUserByDate(userid: string, dateString: string): Observable<Crenau[]> {
    const astreintesRef = query(collection(this.firestore, 'astreinte'), where("users", "array-contains", {idUser: userid}), where("dateString", "==", dateString));
    return collectionData(astreintesRef, { idField: 'id' }) as Observable<Crenau[]>;
  }

  getAstreintesByDate2(date: string, hour: number, societe: string): Observable<Crenau[]> {
    const astreintesRef = query(collection(this.firestore, 'astreinte'), where("dateString", "==", date), where ("heureDebut", "==", hour), where("societe", "==", societe));
    return collectionData(astreintesRef, { idField: 'id' }) as Observable<Crenau[]>;
  }

  // retourner toutes les astreintes par date (filtrer par societe)
  getAstreinteByDateandSociete(Usersociete: any, date: string): Observable<Crenau[]> {
    const crenauxRef = query(collection(this.firestore, 'astreinte'), where("societe", "==" , Usersociete), where("dateString", "==", date));
    return collectionData(crenauxRef, { idField: 'id' }) as Observable<Crenau[]>;
  }

  // ajouter call si livreur est appelé
  updateAstreinte(astreinteId: string, tabUsersInscrit: any) {
    const astreintesRef = doc(this.firestore, `astreinte/${astreinteId}`);
    let callAstreinte = {'users': tabUsersInscrit}
    return setDoc(astreintesRef, callAstreinte, { merge: true });
  }

  // ajouter priseServiceKYO 
  updatePriseService(astreinteId: string, tabAstreinteInscrit: any) {
    const crenauDocRef = doc(this.firestore, `astreinte/${astreinteId}`);
    let priseService = {'users': tabAstreinteInscrit}
    return setDoc(crenauDocRef, priseService, { merge: true });
  }
}