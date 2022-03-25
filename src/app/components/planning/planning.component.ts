import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Crenau } from 'src/app/models/crenau.model';
import { CrenauService } from 'src/app/services/crenau.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalUserInscritComponent } from '../modal-user-inscrit/modal-user-inscrit.component';
import { UsersService } from 'src/app/services/users.service';
import { ProfileUser } from 'src/app/models/user.profil';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})
export class PlanningComponent implements OnInit {

  crenaux: Crenau[] = [];
  defaultDatePicker: Date;
  heures: number[] = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  jours: number[]= [1, 2, 3, 4, 5, 6, 0];
  userRole: any;
  societeSelectionne: any;
  defaultSociete : string;
  societes: string[] = ['rocket','rosebaie'];

  constructor(private crenauservice: CrenauService, private userservice: UsersService, public datePipe : DatePipe, public dialog: MatDialog, private toast: HotToastService) {
    this.defaultDatePicker = new Date;
  }

  async ngOnInit(): Promise<void> {
    this.defaultSociete = 'rocket';
    this.userRole =  await this.userservice.canAccess$;
    this.societeSelectionne = this.userRole;
    if(this.userRole == 'woozoo'){
      this.societeSelectionne = this.defaultSociete;
    }
    // crenaux par semaine
    this.afficherCrenauParSemaine(this.societeSelectionne);
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

  chargerPlanningSociete(el: string){
    this.societeSelectionne = el;
    this.afficherCrenauParSemaine(el);
  }

  // crenaux par semaine (datepicker)
  async afficherCrenauParSemaine(el: string){
    let dateLundi = this.setToMonday(this.defaultDatePicker);
    let tab = this.createSemaineTab(dateLundi);
    this.crenauservice.getCrenauxBySemaineAndSociete(el,tab).subscribe((res: Crenau[]) => {
      // trier par heure
      this.crenaux = res.sort(function (a:any, b:any) {
      return a.heureDebut - b.heureDebut
      });
    })
  }

  returnPlanning(jour: number, heure: number){
    let res = false;
    for(let i = 0; i < this.crenaux.length; i++){
      if(jour == this.getDay(this.crenaux[i].date) && this.heures[heure] == this.crenaux[i].heureDebut ){
        res = true;
      }
    }
    return res
  }
  returnPlanningInscrit(jour: number, heure: number){
    let res;
    for(let i = 0; i < this.crenaux.length; i++){
      if(jour == this.getDay(this.crenaux[i].date) && this.heures[heure] == this.crenaux[i].heureDebut ){
        res = this.crenaux[i].inscrit;
      }
    }
    return res
  }
  returnPlanningInscritMax(jour: number, heure: number){
    let res;
    for(let i = 0; i < this.crenaux.length; i++){
      if(jour == this.getDay(this.crenaux[i].date) && this.heures[heure] == this.crenaux[i].heureDebut ){
        res = this.crenaux[i].inscritMax;
      }
    }
    return res
  }
  returnCrenau(jour: number, heure: number){
    let res;
    for(let i = 0; i < this.crenaux.length; i++){
      if(jour == this.getDay(this.crenaux[i].date) && this.heures[heure] == this.crenaux[i].heureDebut ){
        res = this.crenaux[i];
      }
    }
    return res
  }

  // return users(Promise pour attendre les données users avant d'ouvrir la popup 'modal-user-inscrit')
  usersInscrit(crenauId: string){
    return new Promise<ProfileUser[]>(resolve => {
      this.userservice.getUserInscritByCrenau(crenauId).subscribe((res) => {
        resolve(res);
      })
    });
  }

  // ouvrir popup avec info livreur pour chaque créneaux
  async openDialogModal(crenau: Crenau) {
    this.toast.loading('Chargement');

    const users = await this.usersInscrit(crenau.id);
    this.toast.close();

    const dialogRef = this.dialog.open(ModalUserInscritComponent);
    dialogRef.componentInstance.users = users;
    // dialogRef.componentInstance.crenau = crenau;
  }

  // ouvrir popup avec livreur pour chaque créneaux
  // openDialogModal(crenau: Crenau) {
  //   const activeModal = this.dialog.open(ModalUserInscritComponent);
  //   activeModal.componentInstance.crenau = crenau;
  // }

}