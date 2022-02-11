import { Injectable } from '@angular/core';
import { Auth, authState, signInWithEmailAndPassword } from '@angular/fire/auth'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { from, switchMap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  currentUser$ = authState(this.auth);
  // currentUserProfile$: any;

  constructor(private auth: Auth) { }

  signUp(name: string, email: string, password: string){
    return from(createUserWithEmailAndPassword(this.auth, email, password)
    ).pipe(switchMap(({ user }) => updateProfile(user, {displayName: name})))
  }

  login(email: string, password: string){
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout(){
    return from(this.auth.signOut());
  }

}
