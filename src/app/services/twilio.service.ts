import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class TwilioService {

  private header = { headers: { "Content-Type": "application/json" } };

  constructor(private http: HttpClient, private usersService: UsersService) { }

  send_sms(req: any, creneauId: string, userId: string) {
    return this.http.post("http://localhost:3000/rappelsms", req , this.header).subscribe(async (resp: any) => {
      // ajout sms id dans firebase
      let tabCrenauInscrit: any = await this.tab;
      for(let creneauInscrit of tabCrenauInscrit){
        console.log(creneauInscrit.idCrenau)
        if(creneauInscrit.idCrenau === creneauId){
          creneauInscrit.smsId = resp.smsId
        }
      }
      this.usersService.updateCrenauInscrit(userId, tabCrenauInscrit)
    });
  }

  send_smsGroupe(req: any) {
    return this.http.post("http://localhost:3000/notificationCrenau", req , this.header).subscribe((resp: any) => {
      console.log(resp);
    });
  }

  cancel_sms(req: any) {
    return this.http.post("http://localhost:3000/cancelRappelSms", req , this.header).subscribe((resp: any) => {
      console.log(resp);
    });
  }

  get tab(){
    return new Promise(resolve => {
      this.usersService.currentUserProfile$.subscribe((res) => {
        resolve(res.crenauInscrit);
      })
    });
  }

}
