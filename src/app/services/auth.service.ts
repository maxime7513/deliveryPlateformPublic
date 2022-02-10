import { Injectable } from '@angular/core';
import { Auth, authState, signInWithEmailAndPassword } from '@angular/fire/auth'
import { from } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  currentUser$ = authState(this.auth);
  currentUserProfile$: any;

  constructor(private auth: Auth) { }

  login(email: string, password: string){
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout(){
    return from(this.auth.signOut());
  }

}
