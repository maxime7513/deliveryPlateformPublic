import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { HotToastService } from '@ngneat/hot-toast';
import { Crenau } from 'src/app/models/crenau.model';
import { CrenauService } from 'src/app/services/crenau.service';

@Component({
  selector: 'app-dahsboard-livreur',
  templateUrl: './dahsboard-livreur.component.html',
  styleUrls: ['./dahsboard-livreur.component.scss']
})
export class DahsboardLivreurComponent implements OnInit {

  userUid = this.auth.currentUser.uid;
  crenaux: Crenau[] = [];
  datePicker = new Date;
  defaultDatePicker: Date;
  dateAfficher : string;

  constructor(private crenauservice: CrenauService, private auth: Auth, private toast: HotToastService, public datePipe : DatePipe) {
    this.defaultDatePicker = this.datePicker;
  }

  ngOnInit(): void {
    // crenaux par date
    this.afficherCrenauParDate();
  }
  
  // crenaux par date (datepicker)
  afficherCrenauParDate(){
    this.dateAfficher = this.datePipe.transform(this.defaultDatePicker, 'dd MMMM');
    let date = this.datePipe.transform(this.defaultDatePicker, 'dd/MM/yyyy');
    this.crenauservice.getCrenauxInscritCurrentUserByDate(this.userUid, date).subscribe((res: Crenau[]) => {
      // trier par heure
      this.crenaux = res.sort(function (a:any, b:any) {
      return a.heureDebut - b.heureDebut
      });
    })
  }

  desinscriptionLivreur(crenau: Crenau){
    this.toast.close();
    this.crenauservice.removeLivreur(crenau, this.userUid)
    // retirer 1 au inscrit
    this.crenauservice.decrementInscrit(crenau)
    this.toast.success('Crénau retiré de votre planning', {duration: 3000});
  }

  calculDifferenceDate(date1: any, date2: any){
    var diff_temps = date1.getTime() - date2.getTime();
    var diff_hour = diff_temps / (1000 * 3600 / 60);
    return Math.round(diff_hour);
  }
  
}
