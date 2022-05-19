import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Crenau } from 'src/app/models/crenau.model';
import { ProfileUser } from 'src/app/models/user.profil';
import { CrenauService } from 'src/app/services/crenau.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-planning-kyo',
  templateUrl: './planning-kyo.component.html',
  styleUrls: ['./planning-kyo.component.scss']
})
export class PlanningKYOComponent implements OnInit {

  crenaux: Crenau[] = [];
  datePicker = new Date;
  defaultDatePicker: Date;
  showSpinner : boolean = true;
  
  constructor(private crenauservice: CrenauService, private usersService: UsersService, public datePipe : DatePipe) {
    this.defaultDatePicker = this.datePicker;
  }
  
  ngOnInit(): void {
    this.afficherCrenauParDate();
  }

  afficherCrenauParDate(){
    this.showSpinner = true; // loading
    let date = this.datePipe.transform(this.defaultDatePicker, 'dd/MM/yyyy');
    this.crenauservice.getCrenauxByDateandSociete("kyo", date).subscribe((res: Crenau[]) => {
      // trier par heure
      this.crenaux = res.sort(function (a:any, b:any) {
      return a.heureDebut - b.heureDebut
      });
      this.showSpinner = false; // loading
    })
  }

  getUserInscrit(userId: string){
    return new Promise(resolve => {
      this.usersService.getUserByID(userId).subscribe((res:any) => {
        resolve(res.crenauInscrit);
      })
    });
  }

  async PriseService(userId: string, creneau: Crenau){
    let tabCrenauInscrit: any = await this.getUserInscrit(userId);
    for(let creneauInscrit of tabCrenauInscrit){
      if(creneauInscrit.idCrenau === creneau.id){
        creneauInscrit.priseServiceKYO = new Date;
      }
    }
    this.usersService.updateCrenauInscrit(userId, tabCrenauInscrit)
  }

}
