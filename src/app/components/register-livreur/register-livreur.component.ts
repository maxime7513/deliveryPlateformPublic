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
  defaultDatePicker: Date;
  ccE: string = "+33";

  constructor(private usersService: UsersService, private crenauservice: CrenauService, private auth: Auth, public datePipe : DatePipe, private toast: HotToastService, public dialog: MatDialog, private twilioservice: TwilioService) {
    this.defaultDatePicker = this.datePicker;
  }
  ngOnInit(): void {
    // tous les crenaux
    // this.crenauservice.getCrenaux().subscribe((res: Crenau[]) => {
    //   this.crenaux = res;
    // })

    // crenaux par date
    this.afficherCrenauParDate();
  }

  getPlaceRestante(inscritMax: number, inscrit: number){
    let calc = inscritMax - inscrit;
    return calc;
  }

  // crenaux par date (datepicker)
  afficherCrenauParDate(){
    let date = this.datePipe.transform(this.defaultDatePicker, 'dd/MM/yyyy');
    this.crenauservice.getCrenauxByDate(date).subscribe((res: Crenau[]) => {
      // this.crenaux = res;
      // trier par heure
      this.crenaux = res.sort(function (a:any, b:any) {
      return a.heureDebut - b.heureDebut
      });
    })
  }


  inscriptionLivreur(crenau: Crenau, userUid: string){
    this.toast.close();
    // ajouter user id au crenau
    this.crenauservice.addLivreur(crenau, userUid)
    // ajouter crenau id au user
    this.usersService.addCrenauToUser(userUid, crenau.id)
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

  verifierUserInscrit(crenau: Crenau, uid: string){
    if(crenau.users){
      return crenau.users.includes(uid)
    }else{
      return false
    }
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