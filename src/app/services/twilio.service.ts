import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TwilioService {

  private header = { headers: { "Content-Type": "application/json" } };

  constructor(private http: HttpClient, private firestore: Firestore) { }

  send_sms(req: any, creneauId: string) {
    return this.http.post("http://localhost:3000/rappelsms", req , this.header).subscribe((resp: any) => {
      // ajout sms id dans firebase
      const crenauRef = doc(this.firestore, 'crenau', creneauId);
      let r = {'smsId': resp.smsId}
      setDoc(crenauRef, r, { merge: true });
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

}
