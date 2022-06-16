import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { Auth } from '@angular/fire/auth';
import { Crenau } from 'src/app/models/crenau.model';
import { CrenauService } from 'src/app/services/crenau.service';
import { UsersService } from 'src/app/services/users.service';
import { ModalDeleteCrenauComponent } from '../modal/modal-delete-crenau/modal-delete-crenau.component';
import { TwilioService } from 'src/app/services/twilio.service';
import { ProfileUser } from 'src/app/models/user.profil';
import { AstreinteService } from 'src/app/services/astreinte.service';

interface Societe {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-register-livreur',
  templateUrl: './register-livreur.component.html',
  styleUrls: ['./register-livreur.component.scss']
})
export class RegisterLivreurComponent implements OnInit {

  user$ = this.usersService.currentUserProfile$;
  userUid = this.auth.currentUser.uid;
  crenaux: Crenau[] = [];
  astreintes: Crenau[] = [];
  datePicker = new Date;
  private refreshDatePicker: any = setInterval(() => {
    this.datePicker = new Date;
  }, 10000);
  defaultDatePicker: Date;
  typeChoice: string = 'creneau';
  ccE: string = "+33";
  societes: Societe[] = [
    // {value: 'rocket', viewValue: 'Rocket'},
    {value: 'rosebaie', viewValue: 'RoseBaie'},
    {value: 'kyo', viewValue: 'Kyo-shushi'},
  ];
  selectSocieteValue: string = 'kyo';
  showSpinner : boolean = true;

  constructor(private usersService: UsersService, private crenauservice: CrenauService, private astreinteservice: AstreinteService, private auth: Auth, public datePipe : DatePipe, private toast: HotToastService, public dialog: MatDialog, private twilioservice: TwilioService) {
    this.defaultDatePicker = this.datePicker;
  }
  ngOnInit(): void {
    // tous les crenaux
    // this.crenauservice.getCrenaux().subscribe((res: Crenau[]) => {
    //   this.crenaux = res;
    // })
    this.afficherCrenauParDate();
    this.afficherAstreinteParDate();
  }

  getPlaceRestante(inscritMax: number, inscrit: number){
    let calc = inscritMax - inscrit;
    return calc;
  }

  // crenaux par date (datepicker) et par societe
  afficherCrenauParDate(){
    this.showSpinner = true;
    let date = this.datePipe.transform(this.defaultDatePicker, 'dd/MM/yyyy');
    this.crenauservice.getCrenauxValableByDateandSociete(date, this.datePicker, this.selectSocieteValue).subscribe((res: Crenau[]) => {
      this.showSpinner = false;
      this.crenaux = res;
    })

  this.refreshDatePicker;
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

  // astreintes par date (datepicker) et par societe
  afficherAstreinteParDate(){
    this.showSpinner = true;
    let date = this.datePipe.transform(this.defaultDatePicker, 'dd/MM/yyyy');
    this.astreinteservice.getAstreintesValableByDateandSociete(date, this.datePicker, this.selectSocieteValue).subscribe((res: Crenau[]) => {
      this.showSpinner = false;
      this.astreintes = res;
    })

  this.refreshDatePicker;
  }

  async inscriptionLivreur(crenau: Crenau, user: ProfileUser){
    this.toast.close();
    
    // verifier si l'utilisateur n'est pas deja inscrit à un autre créneau sur le meme horaire
    let verifCreneauInscrit = await this.verifierCreneauUserInscritHeure(crenau);
    let verifAstreinteInscrit = await this.verifierAstreinteUserInscritHeure(crenau);
    if(!verifCreneauInscrit || !verifAstreinteInscrit){
      this.toast.error('Vous avez déjà reservé au autre créneau au même horaire');
      return
    }

    // verifier si user vehicule est égale à crenau vehicule
    let userVehicule: any =  await this.usersService.userVehicule$;
    if(!userVehicule.includes(crenau.vehicule) && crenau.vehicule != ''){
      this.toast.error('Ce créneau de livraison doit être effectué en '+ crenau.vehicule);
      return
    }

    // ajouter user id au crenau/astreinte
    if(this.typeChoice == 'creneau'){
      this.crenauservice.addLivreur(crenau, this.userUid);
      await this.usersService.addCrenauToUser(this.userUid, crenau.id)
      // ajouter 1 au inscrit
      this.crenauservice.incrementInscrit(crenau)
      // envoyer sms de rappel
      let minutesDiff = this.calculDifferenceDate(new Date(crenau.date.seconds * 1000));
      if(minutesDiff > 120){ // si inscription au moins 2heures avant le créneau
        this.send_sms_to(crenau, user, 'creneau');
      }else{
        console.log('trop tard pour le sms')
      }
  
      this.toast.success('Crénau reservé', {duration: 3000});
    }else{
      this.astreinteservice.addLivreur(crenau, this.userUid);
      await this.usersService.addAstreinteToUser(this.userUid, crenau.id)
      // ajouter 1 au inscrit
      this.astreinteservice.incrementInscrit(crenau)
      // envoyer sms de rappel
      let minutesDiff = this.calculDifferenceDate(new Date(crenau.date.seconds * 1000));
      if(minutesDiff > 120){ // si inscription au moins 2heures avant le créneau
        this.send_sms_to(crenau, user, 'astreinte');
      }else{
        console.log('trop tard pour le sms')
      }
  
      this.toast.success('Astreinte reservé', {duration: 3000});
    }
    
  }

  async deleteCreneauUser(crenauId: string){
    let tabCrenauInscrit: any =  await this.tabCrenauInscrit;
    var newArray = tabCrenauInscrit.filter((item: any) => item.idCrenau !== crenauId);
    this.usersService.updateCrenauInscrit(this.userUid, newArray)
  }

  async deleteAstreinteUser(crenauId: string){
    let tabAstreinteInscrit: any =  await this.tabAstreinteInscrit;
    var newArray = tabAstreinteInscrit.filter((item: any) => item.idCrenau !== crenauId);
    this.usersService.updateAstreinteInscrit(this.userUid, newArray)
  }

  async desinscriptionCreneauLivreur(crenau: Crenau){
    this.toast.close();
    this.crenauservice.removeLivreur(crenau.id, this.userUid);
    this.deleteCreneauUser(crenau.id)
    // retirer 1 au inscrit
    this.crenauservice.decrementInscrit(crenau.id)
    // annuler le sms de rappel
    let tabCrenauInscrit: any = await this.tabCrenauInscrit;
    for(let crenauInscrit of tabCrenauInscrit){
      if(crenauInscrit.idCrenau === crenau.id && crenauInscrit.smsId){
        this.cancelSms(crenauInscrit.smsId)
      }
    }
    // envoyer sms à tous les livreurs pour informer que le créneau est disponible
    let tabPhones = await this.twilioservice.livreursPhone$;

    let req = {
      typeMission: 'creneau',
      role: crenau.societe,
      date: crenau.dateString,
      phoneTab: tabPhones,
      heureDebut: crenau.heureDebut.viewValue,
      heureFin: crenau.heureFin.viewValue
    }
    this.twilioservice.send_smsGroupe2(req);

    this.toast.success('Crénau retiré de votre planning', {duration: 3000});
  }

  async desinscriptionAstreinteLivreur(crenau: Crenau){
    this.toast.close();
    this.astreinteservice.removeLivreur(crenau.id, this.userUid);
    this.deleteAstreinteUser(crenau.id)
    // retirer 1 au inscrit
    this.astreinteservice.decrementInscrit(crenau.id)
    // annuler le sms de rappel
    let tabAstreinteInscrit: any = await this.tabAstreinteInscrit;
    for(let astreinteInscrit of tabAstreinteInscrit){
      if(astreinteInscrit.idCrenau === crenau.id && astreinteInscrit.smsId){
        this.cancelSms(astreinteInscrit.smsId)
      }
    }
    // envoyer sms à tous les livreurs pour informer que l'astreinte est disponible
    let tabPhones = await this.twilioservice.livreursPhone$;
    let req = {
      typeMission: 'astreinte',
      role: crenau.societe,
      date: crenau.dateString,
      phoneTab: tabPhones,
      heureDebut: crenau.heureDebut.viewValue,
      heureFin: crenau.heureFin.viewValue
    }
    this.twilioservice.send_smsGroupe2(req);
    
    this.toast.success('Astreinte retiré de votre planning', {duration: 3000});
  }

  // verifier si l'utilisateur n'est pas deja inscrit à un autre créneau sur le meme horaire
  verifierCreneauUserInscritHeure(crenau: Crenau){
    return new Promise(resolve => {
      this.crenauservice.getCrenauxInscritCurrentUserByDate3(this.userUid, crenau.dateString).subscribe((res) => {
        let dejaInscrit = true;
        res.map(creneauRes => {
          if(crenau.heureDebut.value < creneauRes.heureFin.value && crenau.heureFin.value > creneauRes.heureDebut.value){
            dejaInscrit = false;
          }
        })
        resolve(dejaInscrit);
      })
    });
  }

  // verifier si l'utilisateur n'est pas deja inscrit à une autre astreinte sur le meme horaire
  verifierAstreinteUserInscritHeure(crenau: Crenau){
    return new Promise(resolve => {
      this.astreinteservice.getAstreintesInscritCurrentUserByDate(this.userUid, crenau.dateString).subscribe((res) => {
        let dejaInscrit = true;
        res.map(astreinteRes => {
          if(crenau.heureDebut.value < astreinteRes.heureFin.value && crenau.heureFin.value > astreinteRes.heureDebut.value){
            dejaInscrit = false;
          }
        })
        resolve(dejaInscrit);
      })
    });
  }

  calculDifferenceDate(date: any){
    var diff_temps = date.getTime() - this.datePicker.getTime();
    var diff_hour = diff_temps / (1000 * 3600 / 60);
    return Math.round(diff_hour);
  }

  // ouvrir popup confirmation suppression du créneau
  openDialogModal(crenau: Crenau) {
    const dialogRef = this.dialog.open(ModalDeleteCrenauComponent);
    dialogRef.componentInstance.confirmMessage = "Êtes-vous sûr de vouloir enlever ce créneau de votre planning ?"
    dialogRef.afterClosed().subscribe(result => {
      if(result == true) {
        this.desinscriptionCreneauLivreur(crenau);      
      }    
    });
  }

  // ouvrir popup confirmation suppression de l'astreinte
  openDialogModal2(crenau: Crenau) {
    const dialogRef = this.dialog.open(ModalDeleteCrenauComponent);
    dialogRef.componentInstance.confirmMessage = "Êtes-vous sûr de vouloir enlever cette astreinte de votre planning ?"
    dialogRef.afterClosed().subscribe(result => {
      if(result == true) {
        this.desinscriptionAstreinteLivreur(crenau);      
      }    
    });
  }

  // envoyer sms au livreur quand il reserve
  send_sms_to(crenau: Crenau, user: ProfileUser, typeMission: string) {
    let crenauDate = new Date(crenau.date.seconds * 1000);
    // 1h avant
    let crenauDateRappel = new Date(crenauDate.getTime() - 60 * 60000);

    let phoneFormat = user.phone.replace(/ /g, ""); // supprimer tous les espaces      
    if(phoneFormat.indexOf("+330") == 0){ // enlever +330 ou +33 phone expediteur
      phoneFormat = phoneFormat.substring(4);
    }else if(phoneFormat.indexOf("+33") == 0){
      phoneFormat = phoneFormat.substring(3);
    }
    phoneFormat = this.ccE + phoneFormat; // rajouter +33

    let urlRB = "";
    if(crenau.idDemandeCreneauRB){
      urlRB = crenau.idDemandeCreneauRB;
    }

    let req = {
      crenauDate: crenauDateRappel,
      crenauHeureDebut: crenau.heureDebut.viewValue,
      crenauHeureFin: crenau.heureFin.viewValue,
      phone: phoneFormat,
      nom: user.firstName,
      societe: crenau.societe,
      urlMission: urlRB,
      typeMission: typeMission
    };
    this.twilioservice.send_sms(req, crenau.id, user.uid, typeMission);
  }

  // send_sms_to2() {
  //   let crenauDate = new Date('2022-04-16T12:00:00');
  //   let req = {
  //     crenauDate: crenauDate,
  //     crenauHeureDebut: "12",
  //     crenauHeureFin: "12",
  //     phone: "+33687262395",
  //     nom: "max"
  //   };
    
  //   this.twilioservice.send_sms(req,"KEwFKktMYUXQCBUtBGJi");
  // }

  cancelSms(messageId: string){
    let req = {
      // messageId: 'SM69b9052e1ca542bc813b73294be472c8'
      messageId: messageId
    }
    this.twilioservice.cancel_sms(req);
  }

}