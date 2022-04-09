import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { concatMap, map, Observable, startWith } from 'rxjs';
import { AdressesService } from 'src/app/services/adresses.service';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { RBAdresseAttenteService } from 'src/app/services/rb-adresse-attente.service';
import { ModalCreateAdresseComponent } from '../../modal/modal-create-adresse/modal-create-adresse.component';

interface Adresse {
  value: string;
  viewValue: string;
}

// interface nombreColis {
//   value: number;
//   viewValue: string;
// }

@Component({
  selector: 'app-rosebaie-create-livraison-attente',
  templateUrl: './rosebaie-create-livraison-attente.component.html',
  styleUrls: ['./rosebaie-create-livraison-attente.component.scss']
})
export class RosebaieCreateLivraisonAttenteComponent implements OnInit {

  rbForm: FormGroup;
  // mat autocomplete
  options: Adresse[] = [];
  filteredOptions: Observable<Adresse[]>[] = [];

  // nombreColis: nombreColis[] = [
  //   {value: 1, viewValue: '1'},
  //   {value: 2, viewValue: '2'},
  //   {value: 3, viewValue: '3'},
  //   {value: 4, viewValue: '4'},
  //   {value: 5, viewValue: '5'},
  //   {value: 6, viewValue: '6'},
  //   {value: 7, viewValue: '7'},
  //   {value: 8, viewValue: '8'},
  // ];

  constructor(private fb: FormBuilder, private adresseservice: AdressesService, private rbAdresseAttenteService: RBAdresseAttenteService, public dialog: MatDialog, private imageUploadService: ImageUploadService, private toast: HotToastService, private router: Router) { }

  async ngOnInit(): Promise<void> {
    // init form
    this.initform();

    // recuperer nom et adresse pour mat autocomplete
    await this.nomAdress$;   
    // Build the account Auto Complete values
    this.ManageNameControl(0);
  }

  initform() {
    this.rbForm = this.fb.group({
      adresseLivraison: this.initItems(),
    });
  }

  initItems() {
    var formArray = this.fb.array([]);
    
      formArray.push(this.fb.group({
        nom: ['', [Validators.required]],
        numeroBonLivraison: ['', [Validators.required]],
        urlBonLivraison: ['', [Validators.required]],
        // nombreColis: ['', [Validators.required]],
      }));
    
    return formArray;
  }

  ManageNameControl(index: any) {
    var arrayControl = this.rbForm.get('adresseLivraison') as FormArray;
    this.filteredOptions[index] = arrayControl.at(index).get('nom').valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.viewValue),
      map(viewValue => viewValue ? this._filter(viewValue) : this.options.slice())
      );
  }

  private _filter(name: string): Adresse[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.viewValue.toLowerCase().includes(filterValue));
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

  addNewAdresse() {
    const controls = <FormArray>this.rbForm.controls['adresseLivraison'];
    let formGroup = this.fb.group({
      nom: ['', [Validators.required]],
      numeroBonLivraison: ['', [Validators.required]],
      urlBonLivraison: ['', [Validators.required]],
      // nombreColis: ['', [Validators.required]],
    });
    controls.push(formGroup);
    // Build the account Auto Complete values
    this.ManageNameControl(controls.length - 1);
  }

  removeAdresse(index: number) {
    const controls = <FormArray>this.rbForm.controls['adresseLivraison'];
    controls.removeAt(index);
    // remove filteredOptions too
    this.filteredOptions.splice(index, 1);
  }

  uploadImage(event: any, index: any) {
    let time = new Date().getTime();
    this.imageUploadService
      .uploadImage(event.target.files[0], `/images/bonLivraisonOriginalRosebaie/bondelivraison-${time}`)
      .pipe(
        this.toast.observe({
          loading: "Téléchargement du bon de livraison ...",
          success: 'Bon de livraison téléchargé avec succes',
          error: "Une erreur c'est produite lors du téléchargement",
        }),
        concatMap((photoURL) =>
            this.rbForm.value.adresseLivraison[index].urlBonLivraison = photoURL
        )
      )
      .subscribe();
  }

  // recuperer nom entreprise(dans le carnet d'adresse) avec l'adresse
  getNomAdresse(adresse: any){
    return new Promise(resolve => {
      let nom: string;
      this.adresseservice.getByAdresse(adresse).subscribe(res => {
        res.map((element : any) =>{
          nom = element.nom;
        });
        resolve(nom);
      })
    });
  }

  getLocationAdresse(nom: any){
    return new Promise(resolve => {
      let location: string;
      this.adresseservice.getByNom(nom).subscribe(res => {
        res.map((element : any) =>{
          location = element.adresse;
        });
        resolve(location);
      })
    });
  }

  // recuperer telephone entreprise avec l'adresse
  getPhoneAdresse(nom: any){
    return new Promise(resolve => {
      let phone: any;
      this.adresseservice.getByNom(nom).subscribe(res => {
        res.map((element : any) =>{
          phone = element.phone;
        });
        resolve(phone);
      })
    });
  }

  // recuperer complement d'adresse
  getComplementAdresse(nom: any){
    return new Promise(resolve => {
      let complementAdresse: any;
      this.adresseservice.getByNom(nom).subscribe(res => {
        res.map((element : any) =>{
          complementAdresse = element.complementAdresse;
        });
        resolve(complementAdresse);
      })
    });
  }

  openDialogModal(nom: string) {
    const dialogRef = this.dialog.open(ModalCreateAdresseComponent);
    dialogRef.componentInstance.nomAdresse = nom;
  }

  // getter
  get arrayAdresseLivraison() {
    return this.rbForm.get('adresseLivraison') as FormArray;
  }

  async onSubmit(){
    this.toast.close();

    if (!this.rbForm.valid) {
      this.toast.error('Formulaire invalide');
      return;
    }

    for(let adresse of this.rbForm.value.adresseLivraison){
      let location = await this.getLocationAdresse(adresse.nom);
      let phone = await this.getPhoneAdresse(adresse.nom);
      let complementAdresse = await this.getComplementAdresse(adresse.nom);
      
      if(!location){
        location = adresse.nom;
        adresse.nom = ' n/a'
      }
      if(!phone){
        phone = " n/a"
      }
      if(complementAdresse){
        adresse.complementAdresse = complementAdresse
      }
      
      adresse.location = location;
      adresse.phone = phone;
      adresse.date = new Date;
      this.rbAdresseAttenteService.addLivraisonAttente(adresse);
    }

    const toastValid = this.toast.success('livraison en attente programmé',{duration: 1500});

    toastValid.afterClosed.subscribe((e) => {
      this.router.navigate(['/listLivraisonAttenteRB']);
    });

  }

}
