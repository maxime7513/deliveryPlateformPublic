import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Crenau } from 'src/app/models/crenau.model';
import { CrenauService } from 'src/app/services/crenau.service';
import { TwilioService } from 'src/app/services/twilio.service';
import { UsersService } from 'src/app/services/users.service';
import { ModalDeleteCrenauComponent } from '../modal/modal-delete-crenau/modal-delete-crenau.component';

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

  constructor(private crenauservice: CrenauService, private usersService: UsersService, private twilioservice: TwilioService, private auth: Auth, private toast: HotToastService, public datePipe : DatePipe, public dialog: MatDialog, private router: Router) {
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

  get tabCrenauInscrit(){
    return new Promise(resolve => {
      this.usersService.currentUserProfile$.subscribe((res) => {
        resolve(res.crenauInscrit);
      })
    });
  }

  returnUrlMissionRB(crenaux: Crenau[], jour: number, heure: number){
    for(let crenau of crenaux){
      if(jour == this.getDay(crenau.date) && this.heures[heure] == crenau.heureDebut && crenau.societe == 'rosebaie'){
          this.router.navigate(['/missionRoseBaie/'+ crenau.idDemandeCreneauRB]);
      }
    }
  }

  returnCrenau(jour: number, heure: number){
    let res;
    for(let i = 0; i < this.crenaux.length; i++){
      if(jour == this.getDay(this.crenaux[i].date) && this.heures[heure] == this.crenaux[i].heureDebut ){
        if(60 < this.calculDifferenceDate(this.crenaux[i].date.toDate(), new Date)){
          res = this.crenaux[i];
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

  async deleteCreneauUser(crenauId: string){
    let tabCrenauInscrit: any =  await this.tabCrenauInscrit;
    var newArray = tabCrenauInscrit.filter((item: any) => item.idCrenau !== crenauId);
    this.usersService.updateCrenauInscrit(this.userUid, newArray)
  }

  desinscriptionLivreur(crenauId: string){
    this.toast.close();
    this.crenauservice.removeLivreur(crenauId, this.userUid);
    // this.usersService.removeCrenauToUser(this.userUid, crenauId)
    this.deleteCreneauUser(crenauId)
    // retirer 1 au inscrit
    this.crenauservice.decrementInscrit(crenauId)
    this.toast.success('Crénau retiré de votre planning', {duration: 3000});
  }

  calculDifferenceDate(date1: any, date2: any){
    var diff_temps = date1.getTime() - date2.getTime();
    var diff_hour = diff_temps / (1000 * 3600 / 60);
    return Math.round(diff_hour);
  }

  // ouvrir popup confirmation suppression du créneaux
  openDialogModal(crenau: Crenau) {
      const dialogRef = this.dialog.open(ModalDeleteCrenauComponent);
      dialogRef.componentInstance.confirmMessage = "Êtes-vous sûr de vouloir enlever ce créneau de votre planning ?"
      dialogRef.afterClosed().subscribe(async result => {
        if(result == true) {
          this.desinscriptionLivreur(crenau.id);
          
          // envoyer sms à tous les livreurs pour informer que le créneau est disponible
          let tabPhones = await this.twilioservice.livreursPhone$;
          let req = {
            role: crenau.societe,
            date: crenau.dateString,
            phoneTab: tabPhones,
            heureDebut: crenau.heureDebut,
            heureFin: crenau.heureFin
          }
          this.twilioservice.send_smsGroupe2(req); 
        }    
      });
  }
  
}