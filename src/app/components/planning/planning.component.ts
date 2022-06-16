import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Crenau } from 'src/app/models/crenau.model';
import { CrenauService } from 'src/app/services/crenau.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalUserInscritComponent } from '../modal/modal-user-inscrit/modal-user-inscrit.component';
import { UsersService } from 'src/app/services/users.service';
import { ProfileUser } from 'src/app/models/user.profil';
import { HotToastService } from '@ngneat/hot-toast';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
  societes: string[] = ['rosebaie','kyo'];

  constructor(private crenauservice: CrenauService, private userservice: UsersService, public datePipe : DatePipe, public dialog: MatDialog, private toast: HotToastService, private sanitizer: DomSanitizer) {
    this.defaultDatePicker = new Date;
  }

  async ngOnInit(): Promise<void> {
    this.defaultSociete = 'rosebaie';
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
      return a.heureDebut.value - b.heureDebut.value
      });
    })
  }
    
  returnCrenauId(jour: number, heure: number){
    let res;
    for(let crenau of this.crenaux){
      if(jour == this.getDay(crenau.date) && this.heures[heure] == crenau.heureDebut.value ){
        res = crenau;
      }
    }
    return res
  }

  // return users(Promise pour attendre les données users avant d'ouvrir la popup 'modal-user-inscrit')
  // usersInscrit(crenauId: string){
  //   return new Promise<ProfileUser[]>(resolve => {
  //     this.userservice.getUserInscritByCrenau(crenauId).subscribe((res) => {
  //       resolve(res);
  //     })
  //   });
  // }
  
  // return users(Promise pour attendre les données users avant d'ouvrir la popup 'modal-user-inscrit')
  usersInscrit2(crenau: Crenau){
    return new Promise<ProfileUser[]>(resolve => {
      let users: any[] = [];
      crenau.users.map((element: any)=>{
        users.push(element.idUser)
      });
      let tab: any[] = [];
      for(let user of users){
        this.userservice.getUserByID(user).subscribe((res) => {
          tab.push(res)
        })
      }
      resolve(tab)
    });
  }

  // ouvrir popup avec info livreur pour chaque créneaux
  async openDialogModal(crenau: Crenau) {
    this.toast.loading('Chargement');

    // const users = await this.usersInscrit(crenauId);
    const users = await this.usersInscrit2(crenau);
    this.toast.close();
    const dialogRef = this.dialog.open(ModalUserInscritComponent);
    dialogRef.componentInstance.users = users;
  }

  // ouvrir popup avec livreur pour chaque créneaux
  // openDialogModal(crenau: Crenau) {
  //   const activeModal = this.dialog.open(ModalUserInscritComponent);
  //   activeModal.componentInstance.crenau = crenau;
  // }

}