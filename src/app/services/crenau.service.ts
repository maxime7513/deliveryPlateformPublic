import { Injectable } from '@angular/core';
import { addDoc, arrayRemove, arrayUnion, collection, collectionData, deleteDoc, doc, docData, Firestore, getDocs, increment, orderBy, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Crenau } from '../models/crenau.model';
import { DemandecrenauRB } from '../models/demandeCrenauRB.model';

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
    const crenauxRef = collection(this.firestore, 'crenau');
    return collectionData(crenauxRef, { idField: 'id' }) as Observable<Crenau[]>;
  }

  // ajouter 1 au inscrit
  incrementInscrit(crenau: Crenau) {
    const incrementDocRef = doc(this.firestore, `crenau/${crenau.id}`);
    return updateDoc(incrementDocRef, { inscrit: increment(1) });
  }

  // retirer 1 au inscrit
  decrementInscrit(crenauId: string) {
    const decrementDocRef = doc(this.firestore, `crenau/${crenauId}`);
    return updateDoc(decrementDocRef, { inscrit: increment(-1) });
  }

  // inscription d'un livreur
  addLivreur(crenau: Crenau, uid: string) {
    const crenauDocRef = doc(this.firestore, `crenau/${crenau.id}`);
    // return updateDoc(crenauDocRef, { users: arrayUnion(uid) });
    return updateDoc(crenauDocRef, { users: arrayUnion({idUser : uid}) });
  }

  // désinscription d'un livreur
  removeLivreur(crenauId: string, uid: string) {
    const crenauDocRef = doc(this.firestore, `crenau/${crenauId}`);
    // return updateDoc(crenauDocRef, { users: arrayRemove(uid) });
    return updateDoc(crenauDocRef, { users: arrayRemove({idUser : uid}) });
  }
  
  // suppression d'un crenau
  deleteCrenau(crenau: Crenau) {
    const crenauDocRef = doc(this.firestore, `crenau/${crenau.id}`);
    return deleteDoc(crenauDocRef);
  }

  // suppression d'un crenau
  getCrenauRB(crenau: DemandecrenauRB){
    const crenauxRef = query(collection(this.firestore, 'crenau'), where("idDemandeCreneauRB", "==", crenau.id));
    return collectionData(crenauxRef, { idField: 'id' });
  }

  getCrenauByID(id: string): Observable<Crenau>{
    const crenauRef = doc(this.firestore, `crenau/${id}`);
    return docData(crenauRef, { idField: 'id' }) as Observable<Crenau>;
  }

  // retourner les crenaux que l'user connecté à réservé
  getCrenauxInscritCurrentUser(userid: string): Observable<Crenau[]> {
    const crenauxRef = query(collection(this.firestore, 'crenau'), where("users", "array-contains", userid));
    return collectionData(crenauxRef, { idField: 'id' }) as Observable<Crenau[]>;
  }

  // retourner tous les crenaux par date
  getCrenauxByDate(date: string): Observable<Crenau[]> {
    const crenauxRef = query(collection(this.firestore, 'crenau'), where("dateString", "==", date), orderBy("date"));
    return collectionData(crenauxRef, { idField: 'id' }) as Observable<Crenau[]>;
  }

  // retourner les crenaux par date et supérieur à l'heure actuelle
  getCrenauxValableByDate(dateString: string, date: Date): Observable<Crenau[]> {
    const crenauxRef = query(collection(this.firestore, 'crenau'), where("dateString", "==", dateString), where("date", ">", date));
    return collectionData(crenauxRef, { idField: 'id' }) as Observable<Crenau[]>;
  }
  // retourner les crenaux par date et par société et supérieur à l'heure actuelle
  getCrenauxValableByDateandSociete(dateString: string, date: Date, societe: string): Observable<Crenau[]> {
    const crenauxRef = query(collection(this.firestore, 'crenau'), where("dateString", "==", dateString), where("societe", "==", societe), where("date", ">", date));
    return collectionData(crenauxRef, { idField: 'id' }) as Observable<Crenau[]>;
  }
  
  // retourner tous les crenaux par date (filtrer par societe)
  getCrenauxByDateandSociete(Usersociete: any, date: string): Observable<Crenau[]> {
    const crenauxRef = query(collection(this.firestore, 'crenau'), where("societe", "==" , Usersociete), where("dateString", "==", date));
    return collectionData(crenauxRef, { idField: 'id' }) as Observable<Crenau[]>;
  }
    
  // retourner tous les crenaux par semaine
  getCrenauxBySemaine(tabDate: string[]): Observable<Crenau[]> {
    const crenauxRef = query(collection(this.firestore, 'crenau'), where("dateString", 'in', [tabDate[0], tabDate[1], tabDate[2], tabDate[3], tabDate[4], tabDate[5], tabDate[6]]));
    return collectionData(crenauxRef, { idField: 'id' }) as Observable<Crenau[]>;
  }

  // retourner tous les crenaux par semaine et par entreprise
  getCrenauxBySemaineAndSociete(Usersociete: any, tabDate: string[]): Observable<Crenau[]> {
    const crenauxRef = query(collection(this.firestore, 'crenau'), where("societe", "==" , Usersociete), where("dateString", 'in', [tabDate[0], tabDate[1], tabDate[2], tabDate[3], tabDate[4], tabDate[5], tabDate[6]]));
    return collectionData(crenauxRef, { idField: 'id' }) as Observable<Crenau[]>;
  }

  // retourner les crenaux que l'user connecté à réservé et par jour(string)
  getCrenauxInscritCurrentUserByDate(userid: string, date: string): Observable<Crenau[]> {
    const crenauxRef = query(collection(this.firestore, 'crenau'), where("users", "array-contains", userid), where("dateString", "==", date));
    return collectionData(crenauxRef, { idField: 'id' }) as Observable<Crenau[]>;
  }

  // retourner les crenaux que l'user connecté à réservé et par jour(format date)
  getCrenauxInscritCurrentUserByDate2(userid: string, date: Date): Observable<Crenau[]> {
    const crenauxRef = query(collection(this.firestore, 'crenau'), where("users", "array-contains", userid), where("date", "==", date));
    return collectionData(crenauxRef, { idField: 'id' }) as Observable<Crenau[]>;
  }
  getCrenauxInscritCurrentUserByDate3(userid: string, dateString: string): Observable<Crenau[]> {
    // const crenauxRef = query(collection(this.firestore, 'crenau'), where("users", "array-contains", userid), where("dateString", "==", dateString));
    const crenauxRef = query(collection(this.firestore, 'crenau'), where("users", "array-contains", {idUser: userid}), where("dateString", "==", dateString));

    return collectionData(crenauxRef, { idField: 'id' }) as Observable<Crenau[]>;
  }

  // retourner les crenaux que l'user connecté à réservé et  par semaine
  getCrenauxInscritCurrentUserBySemaine(userid: string, tabDate: string[]): Observable<Crenau[]> {
    const crenauxRef = query(collection(this.firestore, 'crenau'), where("users", "array-contains", {idUser: userid}), where("dateString", 'in', [tabDate[0], tabDate[1], tabDate[2], tabDate[3], tabDate[4], tabDate[5], tabDate[6]]));
    return collectionData(crenauxRef, { idField: 'id' }) as Observable<Crenau[]>;
  }

  async getAcceptAddCrenau(Usersociete: any, date: string, heureDebut: number) {
    const crenauxRef = query(collection(this.firestore, 'crenau'), where("societe", "==" , Usersociete), where("dateString", "==", date), where("heureDebut", "==", heureDebut));
    let resLength = await getDocs(crenauxRef);
    return resLength.size
  }

  async returnNumeroCrenau(Usersociete: any) {
    const crenauxRef = query(collection(this.firestore, 'crenau'), where("societe", "==" , Usersociete));
    let resLength = await getDocs(crenauxRef);
    return resLength.size
  }

  // ajouter priseServiceKYO 
  updatePriseService(creneauId: string, tabCrenauInscrit: any) {
    const crenauDocRef = doc(this.firestore, `crenau/${creneauId}`);
    let priseService = {'users': tabCrenauInscrit}
    return setDoc(crenauDocRef, priseService, { merge: true });
  }

}
