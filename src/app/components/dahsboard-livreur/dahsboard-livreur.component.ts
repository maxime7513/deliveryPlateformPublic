import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Crenau } from 'src/app/models/crenau.model';
import { AstreinteService } from 'src/app/services/astreinte.service';
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
  creneaux: Crenau[] = [];
  defaultDatePicker: Date;
  heures: number[] = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  jours: number[]= [1, 2, 3, 4, 5, 6, 0];
  showSpinner: boolean = true;

  constructor(private crenauservice: CrenauService, private astreinteservice: AstreinteService, private usersService: UsersService, private twilioservice: TwilioService, private auth: Auth, private toast: HotToastService, public datePipe : DatePipe, public dialog: MatDialog, private router: Router) {
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
  get tabAstreinteInscrit(){
    return new Promise(resolve => {
      this.usersService.currentUserProfile$.subscribe((res) => {
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

  get returnCreneaux$(){
    return new Promise<Crenau[]>(resolve => {
      let dateLundi = this.setToMonday(this.defaultDatePicker);
      let tabSemaine = this.createSemaineTab(dateLundi);
      let tabCreneaux: Crenau[] = [];
      this.crenauservice.getCrenauxBySemaine(tabSemaine).subscribe((res: Crenau[]) => {
        res.map(creneau => {
          if(creneau.users){
            creneau.users.map(creneauUser => {
              if(creneauUser.idUser == this.userUid){
                tabCreneaux.push(creneau)
              }
            })
          }
        })
        resolve(tabCreneaux)
      });
    });
  }

  get returnAstreintes$(){
    return new Promise<Crenau[]>(resolve => {
      let dateLundi = this.setToMonday(this.defaultDatePicker);
      let tabSemaine = this.createSemaineTab(dateLundi);
      let tabAstreintes: Crenau[] = [];
      this.astreinteservice.getAstreinteBySemaine(tabSemaine).subscribe((res: Crenau[]) => {
        res.map(creneau => {
          if(creneau.users){
            creneau.users.map(creneauUser => {
              if(creneauUser.idUser == this.userUid){
                tabAstreintes.push(creneau)
              }
            })
          }
        })
        resolve(tabAstreintes)
      });
    });
  }

  // afficherCrenauParSemaine(){
  //   this.showSpinner = true;
  //   return new Promise(resolve => {
  //     let dateLundi = this.setToMonday(this.defaultDatePicker);
  //     let tab = this.createSemaineTab(dateLundi);
  //     this.crenauservice.getCrenauxBySemaine(tab).subscribe((res: Crenau[]) => {
  //       let tabCreneauxCurrentInscrit: Crenau[] = [];
  //       res.map(creneau => {
  //         if(creneau.users){
  //           creneau.users.map(creneauUser => {
  //             if(creneauUser.idUser == this.userUid){
  //               tabCreneauxCurrentInscrit.push(creneau)
  //             }
  //           })
  //         }
  //       })
  //       resolve(this.creneaux = tabCreneauxCurrentInscrit)
  //     });
  //     this.showSpinner = false;
  //   })
  // }

  async afficherCrenauParSemaine(){
    this.showSpinner = true;
    let tabCreneaux = await this.returnCreneaux$,
    tabAstreintes= await this.returnAstreintes$,
    tabCreneauxAstreintes: Crenau[] =  tabCreneaux.concat(tabAstreintes); // concatener les 2 tableaux ensembles
    this.creneaux = tabCreneauxAstreintes;
    this.showSpinner = false;
  }

  async deleteCreneauUser(crenauId: string){
    let tabCrenauInscrit: any =  await this.tabCrenauInscrit;
    var newArray = tabCrenauInscrit.filter((item: any) => item.idCrenau !== crenauId);
    this.usersService.updateCrenauInscrit(this.userUid, newArray)
  }

  async deleteAstreinteUser(astreinteId: string){
    let tabAstreinteInscrit: any =  await this.tabAstreinteInscrit;
    var newArray = tabAstreinteInscrit.filter((item: any) => item.idCrenau !== astreinteId);
    this.usersService.updateAstreinteInscrit(this.userUid, newArray)
  }

  async desinscriptionLivreur(crenau: Crenau){
    this.toast.close();
    if(crenau.typeMission == 'creneau'){
      this.crenauservice.removeLivreur(crenau.id, this.userUid);
      this.deleteCreneauUser(crenau.id);
      // retirer 1 au inscrit
      this.crenauservice.decrementInscrit(crenau.id);
      
      // annuler le sms de rappel
      let tabCrenauInscrit: any = await this.tabCrenauInscrit;
      for(let crenauInscrit of tabCrenauInscrit){
        if(crenauInscrit.idCrenau === crenau.id && crenauInscrit.smsId){
          this.cancelSms(crenauInscrit.smsId)
        }
      }
    }else{
      this.astreinteservice.removeLivreur(crenau.id, this.userUid);
      this.deleteAstreinteUser(crenau.id);
      // retirer 1 au inscrit
      this.astreinteservice.decrementInscrit(crenau.id);
      // annuler le sms de rappel
      let tabAstreinteInscrit: any = await this.tabAstreinteInscrit;
      for(let astreinteInscrit of tabAstreinteInscrit){
        if(astreinteInscrit.idCrenau === crenau.id && astreinteInscrit.smsId){
          this.cancelSms(astreinteInscrit.smsId)
        }
      }
    }


    // envoyer sms à tous les livreurs pour informer que le créneau est disponible
    let tabPhones = await this.twilioservice.livreursPhone$;
    let req = {
      typeMission: crenau.typeMission,
      role: crenau.societe,
      date: crenau.dateString,
      phoneTab: tabPhones,
      heureDebut: crenau.heureDebut.viewValue,
      heureFin: crenau.heureFin.viewValue
    }
    this.twilioservice.send_smsGroupe2(req); 

    if(crenau.typeMission == 'creneau'){
      this.toast.success('Crénau retiré de votre planning', {duration: 3000});
    }else{
      this.toast.success('Astreinte retirée de votre planning', {duration: 3000});
    }
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
          this.desinscriptionLivreur(crenau);
          this.afficherCrenauParSemaine();
        }    
      });
  }
  
  cancelSms(messageId: string){
    let req = {
      messageId: messageId
    }
    this.twilioservice.cancel_sms(req);
  }
}