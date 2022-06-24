import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class TwilioService {

  private header = { headers: { "Content-Type": "application/json" } };
  ccE: string = "+33";

  constructor(private http: HttpClient, private usersService: UsersService) { }

  send_sms(req: any, creneauId: string, userId: string, typeMission: string) {
    return this.http.post("http://localhost:3000/rappelsms", req , this.header).subscribe(async (resp: any) => {
    // return this.http.post("https://limitless-earth-25794.herokuapp.com/rappelsms", req , this.header).subscribe(async (resp: any) => {
      // ajout sms id dans firebase
      let tabInscrit: any;
      if(typeMission == "astreinte"){
        tabInscrit = await this.tabAstreinteInscrit;
      }else{
        tabInscrit= await this.tabcrenauInscrit;
      }

      for(let creneauInscrit of tabInscrit){
        if(creneauInscrit.idCrenau === creneauId){
          creneauInscrit.smsId = resp.smsId
        }
      }
      
      if(typeMission == "astreinte"){
        this.usersService.updateAstreinteInscrit(userId, tabInscrit)
      }else{
        this.usersService.updateCrenauInscrit(userId, tabInscrit)
      }                                            
    });
  }

  send_smsGroupe(req: any) {
    return this.http.post("http://localhost:3000/notificationCrenau", req , this.header).subscribe((resp: any) => {
    // return this.http.post("https://limitless-earth-25794.herokuapp.com/notificationCrenau", req , this.header).subscribe((resp: any) => {
      console.log(resp);
    });
  }

  send_smsGroupe2(req: any) {
    return this.http.post("http://localhost:3000/notificationCrenau2", req , this.header).subscribe((resp: any) => {
    // return this.http.post("https://limitless-earth-25794.herokuapp.com/notificationCrenau2", req , this.header).subscribe((resp: any) => {
      console.log(resp);
    });
  }

  send_smsAstreinte(req:any){
    return this.http.post("http://localhost:3000/callAstreinte", req , this.header).subscribe((resp: any) => {
      // return this.http.post("https://limitless-earth-25794.herokuapp.com/callAstreinte", req , this.header).subscribe((resp: any) => {
        console.log(resp);
      });
  }

  send_smsAnnulationCreneau(req:any){
    return this.http.post("http://localhost:3000/annulationCreneau", req , this.header).subscribe((resp: any) => {
      // return this.http.post("https://limitless-earth-25794.herokuapp.com/annulationCreneau", req , this.header).subscribe((resp: any) => {
        console.log(resp);
      });
  }

  cancel_sms(req: any) {
    return this.http.post("http://localhost:3000/cancelRappelSms", req , this.header).subscribe((resp: any) => {
    // return this.http.post("https://limitless-earth-25794.herokuapp.com/cancelRappelSms", req , this.header).subscribe((resp: any) => {
      console.log(resp);
    });
  }

  // return array telephones des livreurs (Promise for use await dans la fonction send_smsGrouper())
  get livreursPhone$(){
    let tab: any = [];
    return new Promise(resolve => {
      this.usersService.getUsersByRole('livreur').subscribe((res) => {
        res.map(user => {
          tab.push(this.ccE + user.phone)
        })
        resolve(tab);
      })
    });
  }
  
  get tabcrenauInscrit(){
    return new Promise(resolve => {
      this.usersService.currentUserProfile$.subscribe((res) => {
        resolve(res.crenauInscrit);
      })
    });
  }

  get tabAstreinteInscrit(){
    return new Promise(resolve => {
      this.usersService.currentUserProfile$.subscribe((res) => {
        resolve(res.astreinteInscrit);
      })
    });
  }

}
