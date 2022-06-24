import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Crenau } from 'src/app/models/crenau.model';
import { ProfileUser } from 'src/app/models/user.profil';
import { AstreinteService } from 'src/app/services/astreinte.service';
import { CrenauService } from 'src/app/services/crenau.service';
import { TwilioService } from 'src/app/services/twilio.service';
import { UsersService } from 'src/app/services/users.service';
import { ModalDeleteCrenauComponent } from '../modal/modal-delete-crenau/modal-delete-crenau.component';
import { ModalUserInscritComponent } from '../modal/modal-user-inscrit/modal-user-inscrit.component';

@Component({
  selector: 'app-dahsboard-societe',
  templateUrl: './dahsboard-societe.component.html',
  styleUrls: ['./dahsboard-societe.component.scss']
})
export class DahsboardSocieteComponent implements OnInit {
  userUid = this.auth.currentUser.uid;
  creneaux: Crenau[] = [];
  defaultDatePicker: Date;
  heures: number[] = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  jours: number[]= [1, 2, 3, 4, 5, 6, 0];
  userRole: any;
  societeSelectionne: any;
  defaultSociete : string;
  societes: string[] = ['rosebaie','kyoSushi'];
  showSpinner: boolean = true;

  constructor(private crenauservice: CrenauService, private astreinteservice: AstreinteService, private usersService: UsersService, private twilioservice: TwilioService, private auth: Auth, private toast: HotToastService, public datePipe : DatePipe, public dialog: MatDialog, private router: Router) {
    this.defaultDatePicker = new Date;
  }

  async ngOnInit(): Promise<void> {
    this.defaultSociete = 'kyoSushi';
    this.userRole =  await this.usersService.canAccess$;
    this.societeSelectionne = this.userRole;
    if(this.userRole == 'woozoo'){
      this.societeSelectionne = this.defaultSociete;
    }
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

  tabCrenauInscritByUser(userId: string){
    return new Promise(resolve => {
      this.usersService.getUserByID(userId).subscribe((res: any) => {
        resolve(res.crenauInscrit);
      })
    });
  }

  tabAstreinteInscritByUser(userId: string){
    return new Promise(resolve => {
      this.usersService.getUserByID(userId).subscribe((res: any) => {
        resolve(res.astreinteInscrit);
      })
    });
  }

  returnUrlMissionRB(crenaux: Crenau[], jour: number, heure: number){
    for(let crenau of crenaux){
      if(jour == this.getDay(crenau.date) && this.heures[heure] == crenau.heureDebut.value && crenau.societe == 'rosebaie'){
          this.router.navigate(['/missionRoseBaie/'+ crenau.idDemandeCreneauRB]);
      }
    }
  }

  returnCrenau(jour: number, heure: number, tranche: string){
    let res;
    for(let i = 0; i < this.creneaux.length; i++){
      if(tranche == 'heure'){
        if(jour == this.getDay(this.creneaux[i].date) && this.heures[heure] == this.creneaux[i].heureDebut.value ){
          if(60 < this.calculDifferenceDate(this.creneaux[i].date.toDate(), new Date)){
            res = this.creneaux[i];
          }
        }
      }else{
        if(jour == this.getDay(this.creneaux[i].date) && this.heures[heure] + 0.5 == this.creneaux[i].heureDebut.value ){
          if(60 < this.calculDifferenceDate(this.creneaux[i].date.toDate(), new Date)){
            res = this.creneaux[i];
          }
        }
      }
    }
    return res
  }

  chargerPlanningSociete(el: string){
    this.societeSelectionne = el;
    this.afficherCrenauParSemaine();
  }
  
  async afficherCrenauParSemaine(){
    this.showSpinner = true;
    let dateLundi = this.setToMonday(this.defaultDatePicker);
    let tabSemaine = this.createSemaineTab(dateLundi);
    this.crenauservice.getCrenauxBySemaineAndSociete(this.societeSelectionne,tabSemaine).subscribe((res: Crenau[]) => {
      // trier par heure
      this.creneaux = res.sort(function (a:any, b:any) {
      return a.heureDebut.value - b.heureDebut.value;
      });
      this.showSpinner = false;
    })
  }
  
  async deleteCreneauToUser(crenauId: string, userId: string){
    let tabCrenauInscrit: any =  await this.tabCrenauInscritByUser(userId);
    var newArray = tabCrenauInscrit.filter((item: any) => item.idCrenau !== crenauId);
    this.usersService.updateCrenauInscrit(userId, newArray)
  }

  async deleteAstreinteToUser(astreinteId: string, userId: string){
    let tabAstreinteInscrit: any =  await this.tabAstreinteInscritByUser(userId);
    var newArray = tabAstreinteInscrit.filter((item: any) => item.idCrenau !== astreinteId);
    this.usersService.updateAstreinteInscrit(this.userUid, newArray)
  }

  returnUserByCreneau(crenau: Crenau){
    return new Promise<string[]>(async resolve => {
      let users: any[] = [];
      crenau.users.map((element: any)=>{
        users.push(element.idUser)
      });
      resolve(users)
    });
  }

  returnPhoneUser(userId: string){
    return new Promise(resolve => {
      this.usersService.getUserByID(userId).subscribe((res: any) => {
        resolve(res.phone);
      })
    });
  }


  async supprimerCreneau(creneau: Crenau){
    this.toast.close();

    // desinscrire livreurs
    if(creneau.users){
      let users = await this.returnUserByCreneau(creneau);
      users.map(async user => {
        // console.log(user)
        if(creneau.typeMission == 'creneau'){
          this.deleteCreneauToUser(creneau.id, user)
        }else{
          this.deleteAstreinteToUser(creneau.id, user)
        }
        // envoyer sms d'annulation
        let phone: any = await this.returnPhoneUser(user);
        this.send_smsAnnulation(creneau, phone);
      });
    }

    // supprimer créneau/astreinte
    if(creneau.typeMission == 'creneau'){
      this.crenauservice.deleteCrenau(creneau);
      this.toast.success('Crénau retiré de votre planning', {duration: 3000});
    }else{
      this.astreinteservice.deleteAstreinte(creneau);
      this.toast.success('Astreinte retirée de votre planning', {duration: 3000});
    }
  }

  async send_smsAnnulation(creneau: Crenau, userPhone: string) {
    let req = {
      typeMission: creneau.typeMission,
      phone: userPhone,
      role: creneau.societe,
      date: creneau.dateString,
      heureDebut: creneau.heureDebut.viewValue,
      heureFin: creneau.heureFin.viewValue,
    }
    // requete twilio
    this.twilioservice.send_smsAnnulationCreneau(req);
  }

  calculDifferenceDate(date1: any, date2: any){
    var diff_temps = date1.getTime() - date2.getTime();
    var diff_hour = diff_temps / (1000 * 3600 / 60);
    return Math.round(diff_hour);
  }

  // ouvrir popup confirmation suppression du créneaux
  openDialogModal(crenau: Crenau) {
      const dialogRef = this.dialog.open(ModalDeleteCrenauComponent);
      if(crenau.typeMission == 'creneau'){
        dialogRef.componentInstance.confirmMessage = "Êtes-vous sûr de vouloir enlever ce créneau de votre planning ?"
      }else{
        dialogRef.componentInstance.confirmMessage = "Êtes-vous sûr de vouloir enlever cette astreinte de votre planning ?"
      }
      dialogRef.afterClosed().subscribe(async result => {
        if(result == true) {
          this.supprimerCreneau(crenau);
          this.afficherCrenauParSemaine();
        }    
      });
  }

  // return users(Promise pour attendre les données users avant d'ouvrir la popup 'modal-user-inscrit')
  usersInscrit(crenau: Crenau){
    return new Promise<ProfileUser[]>(resolve => {
      let users: any[] = [];
      crenau.users.map((element: any)=>{
        users.push(element.idUser)
      });
      let tab: any[] = [];
      for(let user of users){
        this.usersService.getUserByID(user).subscribe((res) => {
          tab.push(res)
        })
      }
      resolve(tab)
    });
  }

  // ouvrir popup avec info livreur pour chaque créneaux
  async openDialogModalLivreur(crenau: Crenau) {
    this.toast.loading('Chargement');

    if(crenau.users && crenau.users.length != 0){
      const users = await this.usersInscrit(crenau);
      console.log(users)
      this.toast.close();
      const dialogRef = this.dialog.open(ModalUserInscritComponent);
      dialogRef.componentInstance.users = users;
    }else{
      this.toast.close();
      this.toast.info('Aucun livreur encore inscrit à ce créneau')
    }

  }

  cancelSms(messageId: string){
    let req = {
      messageId: messageId
    }
    this.twilioservice.cancel_sms(req);
  }
  
}