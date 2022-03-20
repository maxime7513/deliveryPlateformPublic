import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { concatMap, map, Observable, startWith } from 'rxjs';
import { ProfileUser } from 'src/app/models/user.profil';
import { DemandeCrenauRBService } from 'src/app/services/demande-crenau-rb.service';
import { MessageService } from 'src/app/services/message.service';
import { UsersService } from 'src/app/services/users.service';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { AdressesService } from 'src/app/services/adresses.service';
import { resolve } from 'dns';
import { ModalCreateAdresseComponent } from '../modal-create-adresse/modal-create-adresse.component';
import { MatDialog } from '@angular/material/dialog';

interface Heure {
  value: number;
  viewValue: string;
}
interface Adresse {
  value: string;
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
  options: Adresse[] = [];
  filteredOptions: Observable<Adresse[]>[] = [];

  constructor(private fb: FormBuilder, private demandeCrenauRB: DemandeCrenauRBService, private messageService: MessageService, public dialog: MatDialog, private usersService: UsersService, private imageUploadService: ImageUploadService, private adresseservice: AdressesService, private toast: HotToastService, public datePipe : DatePipe, private router: Router) { }

  async ngOnInit(): Promise<void> {
    // init form
    this.validateform();

    // return user
    this.usersService.currentUserProfile$
    .pipe()
    .subscribe((user) => {
      this.user = user;
    });
    
    // recuperer nom et adresse pour mat autocomplete
    // this.nomAdresse();
    await this.nomAdress$;
    
    // Build the account Auto Complete values
    this.ManageNameControl(0);
  }
  
  get nomAdress$(){
    let tab: Adresse[] = [];
    return new Promise(resolve => {
      this.adresseservice.getAdresses().subscribe((res) => {
        res.map(element =>{
          tab.push({value: element.adresse, viewValue: element.nom})
        });
        resolve(this.options = tab)
      })
    });
  }

  validateform() {
    this.rbForm = this.fb.group({
      date: [{ value: ''}, [Validators.required]],
      heureEnlevement: ['', [Validators.required]],
      adresseEnlevement: ['', [Validators.required]],
      // urlBonLivraison: ['', [Validators.required]],
      adresseLivraison: this.initItems()
    });
  }

  // validateform() {
  //   this.rbForm = new FormGroup(
  //     {
  //       date: new FormControl('', Validators.required),
  //       heureEnlevement: new FormControl('', Validators.required),
  //       adresseEnlevement: new FormControl('', Validators.required),
  //       urlBonLivraison: new FormControl('', Validators.required),
  //       // adresseLivraison: new FormArray([]),
  //       adresseLivraison: new FormArray([
  //         new FormControl('', Validators.required), 
  //       ]),
  //     }
  //   );
  // }

  initItems() {
    var formArray = this.fb.array([]);
    
      formArray.push(this.fb.group({
        adresse: ['', [Validators.required]],
      }));
    
    return formArray;
  }

  ManageNameControl(index: any) {
    var arrayControl = this.rbForm.get('adresseLivraison') as FormArray;
    this.filteredOptions[index] = arrayControl.at(index).get('adresse').valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.viewValue),
      map(viewValue => viewValue ? this._filter(viewValue) : this.options.slice())
      );
  }

  private _filter(name: string): Adresse[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.viewValue.toLowerCase().includes(filterValue));
  }

  addNewAdresse() {
    const controls = <FormArray>this.rbForm.controls['adresseLivraison'];
    let formGroup = this.fb.group({
      adresse: ['', [Validators.required]],
    });
    controls.push(formGroup);
    // Build the account Auto Complete values
    this.ManageNameControl(controls.length - 1);
  }

  // addAdresse() {
  //   this.arrayAdresseLivraison.push(new FormControl('', Validators.required));
  // }

  removeAdresse(index: number) {
    const controls = <FormArray>this.rbForm.controls['adresseLivraison'];
    controls.removeAt(index);
    // remove filteredOptions too
    this.filteredOptions.splice(index, 1);

  }

  // removeAdresse(index: number) {
  //   this.arrayAdresseLivraison.removeAt(index);
  // }

  // getter
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

  // uploadImage(event: any) {
  //   this.imageUploadService
  //     .uploadImage(event.target.files[0], `/images/bonLivraisonRosebaie/bondelivraison-${this.dateTimeStamp}`)
  //     .pipe(
  //       this.toast.observe({
  //         loading: "Téléchargement du bon de livraison ...",
  //         success: 'Bon de livraison téléchargé avec succes',
  //         error: "Une erreur c'est produite lors du téléchargement",
  //       }),
  //       concatMap((photoURL) =>
  //         this.rbForm.value.urlBonLivraison = photoURL
  //       )
  //     )
  //     .subscribe();
  // }

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
      // bonLivraisonUrl : this.rbForm.value.urlBonLivraison,
      contenue : contenue,
      lu: false,
      traite: false
    }

    this.messageService.addMessage(message);

    toastValid.afterClosed.subscribe((e) => {
      this.router.navigate(['/planning']);
    });
  }

  openDialogModal(nom: string, index: number) {
    const dialogRef = this.dialog.open(ModalCreateAdresseComponent);
    dialogRef.componentInstance.nomAdresse = nom;
    dialogRef.afterClosed().subscribe(result => {
      this.arrayAdresseLivraison.controls[index].setValue({adresse: result})
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
