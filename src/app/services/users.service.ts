import { Injectable } from '@angular/core';
import { arrayUnion, collection, collectionData, doc, docData, Firestore, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { from, Observable, of, switchMap } from 'rxjs';
import { ProfileUser } from '../models/user.profil';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private firestore: Firestore, private authService: AuthService) { }

  get currentUserProfile$(): Observable<ProfileUser | null> {
    return this.authService.currentUser$.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }

        const ref = doc(this.firestore, 'users', user?.uid);
        return docData(ref) as Observable<ProfileUser>;
      })
    );
  }
  
  // return userRole (Promise for use await un guard)
  get canAccess$(){
    return new Promise(resolve => {
      this.currentUserProfile$.subscribe((res) => {
        resolve(res.role);
      })
    });
  }

  addUser(user: ProfileUser): Observable<void> {
    const ref = doc(this.firestore, 'users', user.uid);
    return from(setDoc(ref, user));
  }
  
  updateUser(user: ProfileUser): Observable<void> {
    const ref = doc(this.firestore, 'users', user.uid);
    return from(updateDoc(ref, { ...user }));
  }

  // ajouter crenauInscrit au profil user
  addCrenauToUser(userId: string, crenauId: string) {
    const crenauDocRef = doc(this.firestore, `users/${userId}`);
    return updateDoc(crenauDocRef, { crenauInscrit: arrayUnion(crenauId) });
  }

  // retourner tous les users
  getUsers(): Observable<ProfileUser[]> {
    const usersRef = collection(this.firestore, 'users');
    return collectionData(usersRef, { idField: 'id' }) as Observable<ProfileUser[]>;
  }

  // getUserByID(id: string): Observable<ProfileUser[]>{
  //   const crenauRef = doc(this.firestore, `users/${id}`);
  //   return docData(crenauRef, { idField: 'id' }) as Observable<ProfileUser[]>;
  // }

  // retourner les users inscrit à chaque créneau
  getUserInscritByCrenau(crenauId: string): Observable<ProfileUser[]> {
    const userxRef = query(collection(this.firestore, 'users'), where("crenauInscrit", "array-contains", crenauId));
    return collectionData(userxRef, { idField: 'id' }) as Observable<ProfileUser[]>;
  }

  // retourner tous les livreurs (role => livreur)
  getUsersByRole(role: string): Observable<ProfileUser[]> {
    const userxRef = query(collection(this.firestore, 'users'), where("role", "==" , role));
    return collectionData(userxRef, { idField: 'id' }) as Observable<ProfileUser[]>;
  }

  // retourner tous les admins (role => woozoo et rocket)
  getUsersAdmin(): Observable<ProfileUser[]> {
    const userxRef = query(collection(this.firestore, 'users'), where('role', 'in', ['woozoo', 'rocket']));
    return collectionData(userxRef, { idField: 'id' }) as Observable<ProfileUser[]>;
  }

}
