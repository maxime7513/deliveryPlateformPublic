import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { Auth } from '@angular/fire/auth';
import { Crenau } from 'src/app/models/crenau.model';
import { CrenauService } from 'src/app/services/crenau.service';
import { UsersService } from 'src/app/services/users.service';
import { ModalDeleteCrenauComponent } from '../modal-delete-crenau/modal-delete-crenau.component';
import { TwilioService } from 'src/app/services/twilio.service';
import { ProfileUser } from 'src/app/models/user.profil';

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
  datePicker = new Date;
  private refreshDatePicker: any = setInterval(() => {
    this.datePicker = new Date;
  }, 5000);
  defaultDatePicker: Date;
  ccE: string = "+33";
  societes: Societe[] = [
    {value: 'rocket', viewValue: 'Rocket'},
    {value: 'rosebaie', viewValue: 'RoseBaie'},
  ];
  selectSocieteValue: string = 'rocket';

  constructor(private usersService: UsersService, private crenauservice: CrenauService, private auth: Auth, public datePipe : DatePipe, private toast: HotToastService, public dialog: MatDialog, private twilioservice: TwilioService) {
    this.defaultDatePicker = this.datePicker;
  }
  ngOnInit(): void {
    // tous les crenaux
    // this.crenauservice.getCrenaux().subscribe((res: Crenau[]) => {
    //   this.crenaux = res;
    // })
    this.afficherCrenauParDate();
    
    this.refreshDatePicker;
  }

  getPlaceRestante(inscritMax: number, inscrit: number){
    let calc = inscritMax - inscrit;
    return calc;
  }

  // crenaux par date (datepicker) et par societe
  afficherCrenauParDate(){
    let date = this.datePipe.transform(this.defaultDatePicker, 'dd/MM/yyyy');
    this.crenauservice.getCrenauxValableByDateandSociete(date, this.datePicker, this.selectSocieteValue).subscribe((res: Crenau[]) => {
      this.crenaux = res;
    })
  }

  async inscriptionLivreur(crenau: Crenau){
    this.toast.close();
    
    // verifier si l'utilisateur n'est pas deja inscrit à un autre créneau sur le meme horaire
    let verifInscrit = await this.verifierUserInscritHeure(crenau);
    if(verifInscrit > 0 ){
      this.toast.error('Vous avez déjà reservé au autre créneau au même horaire');
      return
    }
    // verifier si user vehicule est égale à crenau vehicule
    let userVehicule =  await this.usersService.userVehicule$;
    if(crenau.vehicule != ''){
      if(userVehicule != crenau.vehicule){
        this.toast.error('Ce créneau de livraison doit être effectué en '+ crenau.vehicule);
        return
      }
    }
  
    // ajouter user id au crenau
    this.crenauservice.addLivreur(crenau, this.userUid)
    // ajouter crenau id au user
    this.usersService.addCrenauToUser(this.userUid, crenau.id)
    // ajouter 1 au inscrit
    this.crenauservice.incrementInscrit(crenau)
    this.toast.success('Crénau reservé', {duration: 3000});
  }

  desinscriptionLivreur(crenau: Crenau){
    this.toast.close();
    this.crenauservice.removeLivreur(crenau, this.userUid)
    // retirer 1 au inscrit
    this.crenauservice.decrementInscrit(crenau)
    this.toast.success('Crénau retiré de votre planning', {duration: 3000});
  }

  // verifier si l'utilisateur est deja inscrit à ce créneau
  verifierUserInscrit(crenau: Crenau){
    if(crenau.users){
      return crenau.users.includes(this.userUid)
    }else{
      return false
    }
  }

  // verifier si l'utilisateur n'est pas deja inscrit à un autre créneau sur le meme horaire
  verifierUserInscritHeure(crenau: Crenau){
    return new Promise(resolve => {
      this.crenauservice.getCrenauxInscritCurrentUserByDate2(this.userUid, crenau.date).subscribe((res) => {
        resolve(res.length);
      })
    });
  }

  calculDifferenceDate(date: any){
    var diff_temps = date.getTime() - this.datePicker.getTime();
    var diff_hour = diff_temps / (1000 * 3600 / 60);
    return Math.round(diff_hour);
  }

  // ouvrir popup confirmation suppression du créneaux
  openDialogModal(crenau: Crenau) {
    const dialogRef = this.dialog.open(ModalDeleteCrenauComponent);
    dialogRef.componentInstance.confirmMessage = "Êtes-vous sûr de vouloir enlever ce créneau de votre planning ?"
    dialogRef.afterClosed().subscribe(result => {
      if(result == true) {
        this.desinscriptionLivreur(crenau);      
      }    
    });
  }

  // envoyer sms au livreur quand il reserve
  send_sms_to(crenau: Crenau, user: ProfileUser) {
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
    let req = {
      crenauDate: crenauDateRappel,
      crenauHeureDebut: crenau.heureDebut,
      crenauHeureFin: crenau.heureFin,
      phone: phoneFormat,
      nom: user.firstName
    };
    // this.twilioservice.send_sms(req);
  }

  send_sms_to2() {
    let req = {
      crenauDate: "12/12/2020",
      crenauHeureDebut: "12",
      crenauHeureFin: "12",
      phone: "+33687262395",
      nom: "max"
    };
    
    this.twilioservice.send_sms(req);
  }

}