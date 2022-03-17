import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { Crenau } from 'src/app/models/crenau.model';
import { CrenauService } from 'src/app/services/crenau.service';
import { ModalDeleteCrenauComponent } from '../modal-delete-crenau/modal-delete-crenau.component';

@Component({
  selector: 'app-dahsboard-livreur',
  templateUrl: './dahsboard-livreur.component.html',
  styleUrls: ['./dahsboard-livreur.component.scss']
})
export class DahsboardLivreurComponent implements OnInit {

  userUid = this.auth.currentUser.uid;
  crenaux: Crenau[] = [];
  defaultDatePicker: Date;
  heures: number[] = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  jours: number[]= [1, 2, 3, 4, 5, 6, 0];

  constructor(private crenauservice: CrenauService, private auth: Auth, private toast: HotToastService, public datePipe : DatePipe, public dialog: MatDialog) {
    this.defaultDatePicker = new Date;
  }

  ngOnInit(): void {
    // crenaux par semaine
    this.afficherCrenauParSemaine();
    this.defaultDatePicker = new Date;
  }

  // retourner le lundi de chaque semaine séléctionnée(datepicker)
  setToMonday(date: any) {
     var day = date.getDay() || 7;
     if( day !== 1 )
     date.setHours(-24 * (day - 1));
     return date;
  }


  createSemaineTab(date: any){
    let currentDateString = this.datePipe.transform(date, 'dd/MM/yyyy');
    let tab = [currentDateString];
    for(let i = 0; i < 6; i++){
      date.setHours(+24);
      let dateString = this.datePipe.transform(date, 'dd/MM/yyyy');
      tab.push(dateString);
    }
    return tab
  }
  
  getDay(day: any){
    var date = day.toDate();
    var day = date.getDay();
    return day
  }

  // returnPlanning(jour: number, heure: number){
  //   // console.log('vv')
  //   let res= 'pas pris';
  //   for(let i = 0; i < this.crenaux.length; i++){
  //     if(jour == this.getDay(this.crenaux[i].date) && this.heures[heure] == this.crenaux[i].heureDebut ){
  //       if(60 < this.calculDifferenceDate(this.crenaux[i].date.toDate(), new Date)){
  //         res = this.crenaux[i].id;
  //       }else if(this.calculDifferenceDate(this.crenaux[i].date.toDate(), new Date) <= -60){
  //         res ="effectue";
  //       }else if(-60 < this.calculDifferenceDate(this.crenaux[i].date.toDate(), new Date) && this.calculDifferenceDate(this.crenaux[i].date.toDate(), new Date) <= 0){
  //         res = "en cours";
  //       }else if(0 < this.calculDifferenceDate(this.crenaux[i].date.toDate(), new Date) && this.calculDifferenceDate(this.crenaux[i].date.toDate(), new Date) <= 60){
  //         let minutesRestante = this.calculDifferenceDate(this.crenaux[i].date.toDate(), new Date);
  //         res = "" + minutesRestante;
  //       }
  //     }
  //   }
  //   return res
  // }

  returnCrenauId(jour: number, heure: number){
    let res;
    for(let i = 0; i < this.crenaux.length; i++){
      if(jour == this.getDay(this.crenaux[i].date) && this.heures[heure] == this.crenaux[i].heureDebut ){
        if(60 < this.calculDifferenceDate(this.crenaux[i].date.toDate(), new Date)){
          res = this.crenaux[i].id;
        }
      }
    }
    return res
  }

  // crenaux par semaine (datepicker)
  afficherCrenauParSemaine(){
    let dateLundi = this.setToMonday(this.defaultDatePicker);
    let tab = this.createSemaineTab(dateLundi);
    this.crenauservice.getCrenauxInscritCurrentUserBySemaine(this.userUid, tab).subscribe((res: Crenau[]) => {
      // trier par heure
      this.crenaux = res.sort(function (a:any, b:any) {
      return a.heureDebut - b.heureDebut
      });
    })
  }

  desinscriptionLivreur(crenauId: string){
    this.toast.close();
    this.crenauservice.removeLivreur2(crenauId, this.userUid)
    // retirer 1 au inscrit
    this.crenauservice.decrementInscrit2(crenauId)
    this.toast.success('Crénau retiré de votre planning', {duration: 3000});
  }

  // desinscriptionLivreur2(crenau: Crenau){
  //   this.toast.close();
  //   this.crenauservice.removeLivreur(crenau, this.userUid)
  //   // retirer 1 au inscrit
  //   this.crenauservice.decrementInscrit(crenau)
  //   this.toast.success('Crénau retiré de votre planning', {duration: 3000});
  // }

  calculDifferenceDate(date1: any, date2: any){
    var diff_temps = date1.getTime() - date2.getTime();
    var diff_hour = diff_temps / (1000 * 3600 / 60);
    return Math.round(diff_hour);
  }

  // ouvrir popup confirmation suppression du créneaux
  openDialogModal(crenauId: string) {
      const dialogRef = this.dialog.open(ModalDeleteCrenauComponent);
      dialogRef.componentInstance.confirmMessage = "Êtes-vous sûr de vouloir enlever ce créneau de votre planning ?"
      dialogRef.afterClosed().subscribe(result => {
        if(result == true) {
          this.desinscriptionLivreur(crenauId);      
        }    
      });
  }
  
}