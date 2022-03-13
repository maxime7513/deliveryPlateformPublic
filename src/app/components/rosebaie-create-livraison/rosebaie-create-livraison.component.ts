import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { getAuth } from 'firebase/auth';
import { concatMap, Observable } from 'rxjs';
import { ProfileUser } from 'src/app/models/user.profil';
import { DemandeCrenauRBService } from 'src/app/services/demande-crenau-rb.service';
import { MessageService } from 'src/app/services/message.service';
import { UsersService } from 'src/app/services/users.service';
import { ImageUploadService } from 'src/app/services/image-upload.service';

interface Heure {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-rosebaie-create-livraison',
  templateUrl: './rosebaie-create-livraison.component.html',
  styleUrls: ['./rosebaie-create-livraison.component.scss']
})
export class RosebaieCreateLivraisonComponent implements OnInit {
  datePicker = new Date;
  dateTimeStamp= new Date().getTime();
  rbForm: FormGroup;
  heures: Heure[] = [
    {value: 7, viewValue: '07h'},
    {value: 8, viewValue: '08h'},
    {value: 9, viewValue: '09h'},
    {value: 10, viewValue: '10h'},
    {value: 11, viewValue: '11h'},
    {value: 12, viewValue: '12h'},
    {value: 13, viewValue: '13h'},
    {value: 14, viewValue: '14h'},
    {value: 15, viewValue: '15h'},
    {value: 16, viewValue: '16h'},
    {value: 17, viewValue: '17h'},
    {value: 18, viewValue: '18h'},
    {value: 19, viewValue: '19h'},
    {value: 20, viewValue: '20h'},
    {value: 21, viewValue: '21h'},
    {value: 22, viewValue: '22h'},
    {value: 23, viewValue: '23h'},
  ];
  user$ = this.usersService.currentUserProfile$;
  user: ProfileUser;

  constructor(private demandeCrenauRB: DemandeCrenauRBService, private messageService: MessageService, private usersService: UsersService, private imageUploadService: ImageUploadService, private toast: HotToastService, public datePipe : DatePipe, private router: Router) { }

  ngOnInit(): void {
    this.validateform();

    this.usersService.currentUserProfile$
    .pipe()
    .subscribe((user) => {
      this.user = user;
    });

  }
  
  // init validator
  validateform() {
    this.rbForm = new FormGroup(
      {
        date: new FormControl('', Validators.required),
        heureEnlevement: new FormControl('', Validators.required),
        adresseEnlevement: new FormControl('', Validators.required),
        urlBonLivraison: new FormControl('', Validators.required),
        // adresseLivraison: new FormArray([]),
        adresseLivraison: new FormArray([
          new FormControl('', Validators.required), 
        ]),
      }
    );
  }

  // getter for mat error
  get date() {
    return this.rbForm.get('date');
  }
  get vehicule() {
    return this.rbForm.get('vehicule');
  }
  get adresseEnlevement() {
    return this.rbForm.get('adresseEnlevement');
  }
  get heureEnlevement() {
    return this.rbForm.get('adresseEnlevement');
  }

  get arrayAdresseLivraison() {
    return this.rbForm.get('adresseLivraison') as FormArray;
  }

  addAdresse() {
    this.arrayAdresseLivraison.push(new FormControl('', Validators.required));
  }
  removeAdresse(index: number) {
    this.arrayAdresseLivraison.removeAt(index);
  }

  uploadImage(event: any) {
    this.imageUploadService
      .uploadImage(event.target.files[0], `/images/bonLivraisonRosebaie/bondelivraison-${this.dateTimeStamp}`)
      .pipe(
        this.toast.observe({
          loading: "Téléchargement du bon de livraison ...",
          success: 'Bon de livraison téléchargé avec succes',
          error: "Une erreur c'est produite lors du téléchargement",
        }),
        concatMap((photoURL) =>
          this.rbForm.value.urlBonLivraison = photoURL
        )
      )
      .subscribe();
  }

  onSubmit(){
    this.toast.close();

    if (!this.rbForm.valid) {
      console.log('formulaire invalid');
      this.toast.error('Formulaire invalide');
      return;
    }

    // ajout de la demande de creneau a firebase
    this.demandeCrenauRB.addDemandeCrenauRB(this.rbForm.value);
    const toastValid = this.toast.success('Demande de livraison prise en compte',{duration: 2500});
  
    // envoie du message dans la boite mail woozoo
    let date = this.datePipe.transform(this.rbForm.value.date, 'dd/MM/yyyy');
    let contenue = "RoseBaie viens de programmer une livraison pour le " + date + ".";
    if(this.user.photoURL == null){
      this.user.photoURL = '';
    }

    const message= {
      date: new Date,
      nom: this.user.lastName,
      prenom: this.user.firstName,
      photoUrl : this.user.photoURL,
      bonLivraisonUrl : this.rbForm.value.urlBonLivraison,
      contenue : contenue,
      lu: false,
      traite: false
    }

    this.messageService.addMessage(message);

    toastValid.afterClosed.subscribe((e) => {
      this.router.navigate(['/planning']);
    });
  }

  // onSubmit(){
  //   this.toast.close();

  //   if (!this.rbForm.valid) {
  //     console.log('formulaire invalid');
  //     this.toast.error('Formulaire invalide');
  //     return;
  //   }

  //   let adressesLivraison = "";
  //   this.rbForm.value.adresseLivraison.forEach(function (value: string, index: any) {
  //     adressesLivraison += `\n` + 'Adresse ' + (index + 1) + ': ' + value;
  //   });
  //   adressesLivraison = adressesLivraison.slice(1);

  //   let date = this.datePipe.transform(this.rbForm.value.date, 'dd/MM/yyyy');

  //   const contenue = this.user.role + ' vient de programmer une livraison.' + `\n` + 
  //   'Date livraison : ' + date + `\n` +
  //   'Heure d\'enlévement : ' + this.rbForm.value.heureEnlevement + 'h' + `\n` +
  //   'Adresse d\'enlévement : ' + this.rbForm.value.adresseEnlevement + `\n` + 
  //   'Adresse de livraison :' + `\n` 
  //   + adressesLivraison;

  //   if(this.user.photoURL == null){
  //     this.user.photoURL = '';
  //   }

  //   const message= {
  //     date: new Date,
  //     nom: this.user.lastName,
  //     prenom: this.user.firstName,
  //     photoUrl : this.user.photoURL,
  //     contenue : contenue,
  //     lu: false,
  //     traite: false
  //   }

  //   this.messageService.addMessage(message);
  //   const toastValid = this.toast.success('Demande de livraison prise en compte',{duration: 2500});
  
  //   toastValid.afterClosed.subscribe((e) => {
  //     this.router.navigate(['/planning']);
  //   });
  // }

}
