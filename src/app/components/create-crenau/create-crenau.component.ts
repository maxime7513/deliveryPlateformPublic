import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Crenau } from 'src/app/models/crenau.model';
import { ProfileUser } from 'src/app/models/user.profil';
import { AstreinteService } from 'src/app/services/astreinte.service';
import { CrenauService } from 'src/app/services/crenau.service';
import { MessageService } from 'src/app/services/message.service';
import { TwilioService } from 'src/app/services/twilio.service';
import { UsersService } from 'src/app/services/users.service';
import { ModalDeleteCrenauComponent } from '../modal/modal-delete-crenau/modal-delete-crenau.component';

interface Heure {
  value: number;
  viewValue: string;
}
interface inscritMax {
  value: number;
  viewValue: string;
}
interface Vehicule {
  value: string;
  viewValue: string;
}
interface Societe {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-create-crenau',
  templateUrl: './create-crenau.component.html',
  styleUrls: ['./create-crenau.component.scss']
})
export class CreateCrenauComponent implements OnInit {

  crenauForm: FormGroup;
  submitCrenauForm : boolean;
  datePicker = new Date;
  defaultDatePicker: Date;
  crenaux: Crenau[] = [];
  astreintes: Crenau[] = [];
  showCrenaux: boolean = false;
  showAstreinte: boolean = false;
  userRole: any;
  user: ProfileUser;
  heures: Heure[] = [
    {value: 8, viewValue: '08h'},
    {value: 8.5, viewValue: '08h30'},
    {value: 9, viewValue: '09h'},
    {value: 9.5, viewValue: '09h30'},
    {value: 10, viewValue: '10h'},
    {value: 10.5, viewValue: '10h30'},
    {value: 11, viewValue: '11h'},
    {value: 11.5, viewValue: '11h30'},
    {value: 12, viewValue: '12h'},
    {value: 12.5, viewValue: '12h30'},
    {value: 13, viewValue: '13h'},
    {value: 13.5, viewValue: '13h30'},
    {value: 14, viewValue: '14h'},
    {value: 14.5, viewValue: '14h30'},
    {value: 15, viewValue: '15h'},
    {value: 15.5, viewValue: '15h30'},
    {value: 16, viewValue: '16h'},
    {value: 16.5, viewValue: '16h30'},
    {value: 17, viewValue: '17h'},
    {value: 17.5, viewValue: '17h30'},
    {value: 18, viewValue: '18h'},
    {value: 18.5, viewValue: '18h30'},
    {value: 19, viewValue: '19h'},
    {value: 19.5, viewValue: '19h30'},
    {value: 20, viewValue: '20h'},
    {value: 20.5, viewValue: '20h30'},
    {value: 21, viewValue: '21h'},
    {value: 21.5, viewValue: '21h30'},
    {value: 22, viewValue: '22h'},
    {value: 22.5, viewValue: '22h30'},
    {value: 23, viewValue: '23h'},
    {value: 23.5, viewValue: '23h30'},
    {value: 24, viewValue: '24h'},
  ];
  inscritsMax: inscritMax[] = [
    {value: 1, viewValue: '1 livreur'},
    {value: 2, viewValue: '2 livreur'},
    {value: 3, viewValue: '3 livreur'},
    {value: 4, viewValue: '4 livreur'},
    {value: 5, viewValue: '5 livreur'},
    {value: 6, viewValue: '6 livreur'},
    {value: 7, viewValue: '7 livreur'},
    {value: 8, viewValue: '8 livreur'},
  ];
  vehicules: Vehicule[] = [
    {value: 'velo', viewValue: 'vélo'},
    {value: 'scooter', viewValue: 'scooter'},
    {value: 'voiture', viewValue: 'voiture'},

  ];
  societes: Societe[] = [
    {value: 'rosebaie', viewValue: 'RoseBaie'},
    {value: 'kyoSushi', viewValue: 'Kyo Sushi'},
    {value: 'woozoo', viewValue: 'WooZoo'},
  ];
  ccE: string = "+33";
  typeChoice: string = 'creneau';

  constructor(private crenauservice: CrenauService, private astreinteservice: AstreinteService, private messageService: MessageService, private toast: HotToastService, private router: Router, public datePipe : DatePipe,  public dialog: MatDialog, private twilioservice: TwilioService, private usersservice: UsersService) {
    this.defaultDatePicker = this.datePicker;
  }

  async ngOnInit(): Promise<void> {
    // init formulaire
    this.validateform();
    this.submitCrenauForm = false;
    this.userRole =  await this.usersservice.canAccess$;
    this.setValidators();
    // afficher crenaux par date
    this.afficherCrenauParDate();
    this.afficherAstreinteParDate();
    // return user
    this.usersservice.currentUserProfile$
    .pipe()
    .subscribe((user) => {
      this.user = user;
    });
  }

  // init validator
  async validateform() {
    this.crenauForm = new FormGroup(
      {
        typeMission: new FormControl('creneau', Validators.required),
        date: new FormControl('', Validators.required),
        heureDebut: new FormControl("", Validators.required),
        heureFin: new FormControl("", Validators.required),
        inscritMax: new FormControl('', Validators.required),
        vehicule: new FormControl(''),
        societe: new FormControl(''),
      }
    );
  }

  setValidators() {
    if(this.userRole === 'woozoo') {
      this.societe.setValidators([Validators.required]);
      // salaryControl.setValidators(null);
    }
        
    this.societe.updateValueAndValidity();
  }

  // getter
  get date() {
    return this.crenauForm.get('date');
  }
  get heureDebut() {
    return this.crenauForm.get('heureDebut');
  }
  get heureFin() {
    return this.crenauForm.get('heureFin');
  }
  get inscritMax() {
    return this.crenauForm.get('inscritMax');
  }
  get societe() {
    return this.crenauForm.get('societe');
  }

  calculDifferenceDate(date: any){
    var diff_temps = date.getTime() - this.datePicker.getTime();
    var diff_hour = diff_temps / (1000 * 3600 / 60);
    return Math.round(diff_hour);
  }

  // crenaux par date (datepicker)
  async afficherCrenauParDate(){
    let date = this.datePipe.transform(this.defaultDatePicker, 'dd/MM/yyyy');
    if(this.userRole != 'woozoo'){
      this.crenauservice.getCrenauxByDateandSociete(this.userRole, date).subscribe((res: Crenau[]) => {
        // trier par heure
        this.crenaux = res.sort(function (a:any, b:any) {
        return a.heureDebut.value - b.heureDebut.value
        });
      })
    }else{
      this.crenauservice.getCrenauxByDate(date).subscribe((res: Crenau[]) => {
        this.crenaux = res;
      })
    }
  }

  // astreinte par date (datepicker)
  async afficherAstreinteParDate(){
    let date = this.datePipe.transform(this.defaultDatePicker, 'dd/MM/yyyy');
    if(this.userRole != 'woozoo'){
      this.astreinteservice.getAstreintesByDateandSociete(this.userRole, date).subscribe((res: Crenau[]) => {
        console.log(res)
        this.astreintes = res.sort(function (a:any, b:any) {
        return a.heureDebut.value - b.heureDebut.value
        });
      })
    }else{
      this.astreinteservice.getAstreintesByDate(date).subscribe((res: Crenau[]) => {
        this.astreintes = res;
      })
    }
  }

  // envoi du formulaire
  async onSubmit() {
    this.toast.close();
    this.submitCrenauForm = true;

    if(!this.typeChoice){
      this.toast.error('Renseigner créneau ou astreinte');
      return;
    }
    if(!this.crenauForm.valid) {
      console.log('formulaire invalid');
      this.toast.error('Formulaire invalide');
      return;
    }
    if(this.crenauForm.value.heureFin.value - this.crenauForm.value.heureDebut.value < 1){
      this.toast.error("Veuillez renseigner un créneau de 1 heure minimum");
      return;
    }

    // date au format string
    this.crenauForm.value.dateString = this.datePipe.transform(this.crenauForm.value.date, 'dd/MM/yyyy');

    // setHours de la date avec la valeur de heureDebut du formulaire
    this.crenauForm.value.date.setHours(this.crenauForm.value.heureDebut.value);
    // setMinutes si créneau par demi-heure
    if(this.crenauForm.value.heureDebut.value % 1 != 0){
      this.crenauForm.value.date.setMinutes(30);
    }else{
      this.crenauForm.value.date.setMinutes(0);
    }

    this.crenauForm.value.inscrit = 0;

    if(this.userRole != 'woozoo'){ // si role n'est pas woozoo
      this.crenauForm.value.societe = this.userRole; // donner a societe la valeur du role de l'utilisateur connecté
    }

    // verifier si creneau/astreinte deja crée
    if(this.typeChoice == 'creneau'){
      let verifCrenau = await this.crenauservice.getAcceptAddCrenau2(this.crenauForm.value.societe,this.crenauForm.value.date);
      if(verifCrenau > 0){
        this.toast.error('un créneau existe déjà pour '+ this.crenauForm.value.heureDebut.viewValue);
        return
      }
      // ajouter creneau à firebase
      this.crenauservice.addCrenau(this.crenauForm.value);
    }else{
      let verifCrenau = await this.astreinteservice.getAcceptAddAstreinte(this.crenauForm.value.societe,this.crenauForm.value.dateString, this.crenauForm.value.heureDebut.value);
      if(verifCrenau > 0){
        this.toast.error('une astreinte existe déjà pour '+ this.crenauForm.value.heureDebut.viewValue);
        return
      }
      // ajouter astreinte à firebase
      this.astreinteservice.addAstreinte(this.crenauForm.value);
    }
    
    const toastValid = this.toast.success(this.typeChoice + ' ajouter',
      {
        // dismissible: true,
        duration: 2500
      }
    );

    // envoie du message dans la boite mail woozoo
    let date = this.datePipe.transform(this.crenauForm.value.date, 'dd/MM/yyyy');
    let contenue = this.crenauForm.value.societe + " viens de programmer une livraison." + `\n` +
    'Type de mission: ' + this.typeChoice + `\n` +
    'Date: ' + date + ' de ' + this.crenauForm.value.heureDebut.viewValue + ' à ' + this.crenauForm.value.heureFin.viewValue + `\n` +
    'Nombre de livreurs: ' + this.crenauForm.value.inscritMax;

    if(this.user.photoURL == null){
      this.user.photoURL = '';
    }

    const message= {
      date: new Date,
      nom: this.user.lastName,
      prenom: this.user.firstName,
      photoUrl : this.user.photoURL,
      contenue : contenue,
      lu: false,
      traite: false
    }
    this.messageService.addMessage(message);
    
    // envoyer sms à tous les livreurs pour informer creneau ajouter
    let minutesDiff = this.calculDifferenceDate(new Date(this.crenauForm.value.date));
    if(minutesDiff < 10080){ // si inférieur à 7 jours
      this.send_smsGrouper(this.typeChoice, this.crenauForm.value.dateString);
    }    
    // toastValid.afterClosed.subscribe((e) => {
    //   this.router.navigate(['/planning']);
    // });
  }

  // ouvrir popup confirmation suppression du créneaux
  openDialogModal(crenau: Crenau) {
    const dialogRef = this.dialog.open(ModalDeleteCrenauComponent);
    dialogRef.componentInstance.confirmMessage = "Êtes-vous sûr de vouloir supprimer ce créneau ?"
    dialogRef.afterClosed().subscribe(result => {
      if(result == true) {
        this.crenauservice.deleteCrenau(crenau).then(() => 
          this.toast.success('Crénau supprimé',{duration: 2500})
        );
      }    
    });
  }

  // ouvrir popup confirmation suppression du créneaux
  openDialogModal2(crenau: Crenau) {
    const dialogRef = this.dialog.open(ModalDeleteCrenauComponent);
    dialogRef.componentInstance.confirmMessage = "Êtes-vous sûr de vouloir supprimer cette astreinte ?"
    dialogRef.afterClosed().subscribe(result => {
      if(result == true) {
        this.astreinteservice.deleteAstreinte(crenau).then(() => 
          this.toast.success('Astreinte supprimé',{duration: 2500})
        );
      }    
    });
  }

  // envoyer sms à tous les livreurs
  async send_smsGrouper(typeChoice: string, dateCrenau: string) {
    let userRole;
    if(this.userRole == 'woozoo'){
      userRole = this.crenauForm.value.societe;
    }else{
      userRole = await this.usersservice.canAccess$; // donner a societe la valeur du role de l'utilisateur connecté
    }
    
    let tabPhones = await this.twilioservice.livreursPhone$;

    let req = {
      typeMission: typeChoice,
      role: userRole,
      date: dateCrenau,
      phoneTab: tabPhones
    }

    // requete twilio
    this.twilioservice.send_smsGroupe(req);
  }

}