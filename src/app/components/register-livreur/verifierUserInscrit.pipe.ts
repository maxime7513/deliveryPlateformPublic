import { Pipe, PipeTransform } from "@angular/core";
import { Crenau } from "src/app/models/crenau.model";
import { Auth } from '@angular/fire/auth';

@Pipe({
    name: 'verifierUserInscrit',
    pure: true
})

export class verifierUserInscritPipe implements PipeTransform {
    
    userUid = this.auth.currentUser.uid;

  constructor(private auth: Auth){}

  transform(value: Crenau): any{
    return this.verifierUserInscrit(value);
  }

  // verifier si l'utilisateur est deja inscrit à ce créneau
  verifierUserInscrit(crenau: Crenau){
    if(crenau.users){
      let res;
      for (var i = 0; i < crenau.users.length; i++) {
        if(this.userUid == crenau.users[i].idUser){
          res = true;
          break
        }else{
          res = false;
        }
      }
      return res
    }else{
      return false
    }
  }
  
}