import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TwilioService {

  private header = { headers: { "Content-Type": "application/json" } };

  constructor(private http: HttpClient) { }

  send_sms(req: any) {
    console.log('gf');
    return this.http.post("http://localhost:3000/rappelsms", req , this.header).subscribe((resp: any) => {
      console.log(resp);
    });
  }

}
