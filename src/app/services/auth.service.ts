import { Injectable } from '@angular/core';
import { Auth, authState, signInWithEmailAndPassword } from '@angular/fire/auth'
import { HotToastService } from '@ngneat/hot-toast';
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, updateEmail } from 'firebase/auth';
import { from } from 'rxjs';
import { ProfileUser } from '../models/user.profil';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  currentUser$ = authState(this.auth);

  constructor(private auth: Auth, private toast: HotToastService) { }

  signUp(email: string, password: string){
    return from(createUserWithEmailAndPassword(this.auth, email, password))
  }

  login(email: string, password: string){
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout(){
    return from(this.auth.signOut());
  }

  resetPassword(email: any){
    return from(sendPasswordResetEmail(this.auth, email)
    .then(() => this.toast.info('un mail de réinitialisation a été envoyé à '+ email))
    .catch(error => console.log(error))
    );
  }

  updateEmail(email: any){
    const auth = getAuth();
    updateEmail(auth.currentUser, email).then(() => {
      // this.toast.success('email de connexion modifié')
    }).catch((error) => {
      if(error == 'FirebaseError: Firebase: Error (auth/requires-recent-login).'){
        this.toast.error('Veuillez vous reconnecter pour changer d\'email')
      }
      console.log(error)
    });
  }

  // updateProfileData(profileData: Partial<UserInfo>): Observable<any>{
  //   const user = this.auth.currentUser;
  //   return of(user).pipe(
  //     concatMap(user => {
  //       if (!user) throw new Error('Pas authentifié');

  //       return updateProfile(user, profileData);
  //     })
  //   )
  // }

}
