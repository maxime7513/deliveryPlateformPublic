import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { map, Observable, startWith } from 'rxjs';
import { ProfileUser } from 'src/app/models/user.profil';
import { DemandeCrenauRBService } from 'src/app/services/demande-crenau-rb.service';
import { MessageService } from 'src/app/services/message.service';
import { UsersService } from 'src/app/services/users.service';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { AdressesService } from 'src/app/services/adresses.service';
import { ModalCreateAdresseComponent } from '../modal-create-adresse/modal-create-adresse.component';
import { MatDialog } from '@angular/material/dialog';
import { CrenauService } from 'src/app/services/crenau.service';
import { Crenau } from 'src/app/models/crenau.model';

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
  // mat autocomplete
  options: Adresse[] = [];
  filteredOptions: Observable<Adresse[]>[] = [];
  // mat autocomplete depot
  optionsDepot: Adresse[] = [];
  filteredOptionsDepot: Observable<Adresse[]>;

  constructor(private fb: FormBuilder, private demandeCrenauRB: DemandeCrenauRBService, private messageService: MessageService, public dialog: MatDialog, private usersService: UsersService, private crenauservice: CrenauService, private imageUploadService: ImageUploadService, private adresseservice: AdressesService, private toast: HotToastService, public datePipe : DatePipe, private router: Router) { }

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
    await this.nomAdress$;   
    // Build the account Auto Complete values
    this.ManageNameControl(0);

    // recuperer adresse de depot pour mat autocomplete
    await this.nomAdressDepot$;
    this.filteredOptionsDepot = this.rbForm.get('adresseEnlevement').valueChanges.pipe(
      startWith(''),
      map(value => this._filter2(value)),
    );

    // ajouter adresse de depot par default si il y en a que une d'enregistré
    if(this.optionsDepot.length == 1){
      this.adresseEnlevement.setValue(this.optionsDepot[0].value)
    }
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

  get nomAdressDepot$(){
    let tab: Adresse[] = [];
    return new Promise(resolve => {
      this.adresseservice.getAdresseDepot().subscribe((res) => {
        res.map(element =>{
          tab.push({value: element.adresse, viewValue: element.nom})
        });
        resolve(this.optionsDepot = tab)
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
        location: ['', [Validators.required]],
      }));
    
    return formArray;
  }

  ManageNameControl(index: any) {
    var arrayControl = this.rbForm.get('adresseLivraison') as FormArray;
    this.filteredOptions[index] = arrayControl.at(index).get('location').valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.viewValue),
      map(viewValue => viewValue ? this._filter(viewValue) : this.options.slice())
      );
  }

  private _filter(name: string): Adresse[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.viewValue.toLowerCase().includes(filterValue));
  }

  private _filter2(name: string): Adresse[] {
    const filterValue = name.toLowerCase();
    return this.optionsDepot.filter(option => option.viewValue.toLowerCase().includes(filterValue));
  }

  addNewAdresse() {
    const controls = <FormArray>this.rbForm.controls['adresseLivraison'];
    let formGroup = this.fb.group({
      location: ['', [Validators.required]],
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

  openDialogModal(nom: string, index: number) {
    const dialogRef = this.dialog.open(ModalCreateAdresseComponent);
    dialogRef.componentInstance.nomAdresse = nom;
    dialogRef.afterClosed().subscribe(result => {
      this.arrayAdresseLivraison.controls[index].setValue({location: result})
      // this.arrayAdresseLivraison.controls[index].setValue({adresse: result})
    });
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
  
  // recuperer telephone entreprise avec l'adresse
  getPhoneAdresse(adresse: any){
    return new Promise(resolve => {
      let phone: any;
      this.adresseservice.getByAdresse(adresse).subscribe(res => {
        res.map((element : any) =>{
          phone = element.phone;
        });
        resolve(phone);
      })
    });
  }

  calculTempsItineraire(origin: any, wayptsTab: any){
    return new Promise(async resolve=> {
      const directionsService = new google.maps.DirectionsService();
      const destination = "14 Rue d'Anthoine, 13002 Marseille";
      const waypts: google.maps.DirectionsWaypoint[] = wayptsTab;

      const request = {
        origin: origin,
        destination: destination,
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
      }
    
      directionsService.route(request,callback);

      function callback(response: any, status: any) {
        if(status === 'OK'){
          let time = 0;
          for (let i = 0; i < response.routes[0].legs.length; i++) {
            time += response.routes[0].legs[i].duration.value;
          }
          console.log("time calculTempsItineraire =>" + time / (60 * 60) + "heures");
          resolve (time / (60 * 60))
        }
      }
    });
  }

  calculDistanceItineraire(origin: any, wayptsTab: any){
    return new Promise(async resolve=> {
      const directionsService = new google.maps.DirectionsService();
      const destination = "14 Rue d'Anthoine, 13002 Marseille";
      const waypts: google.maps.DirectionsWaypoint[] = wayptsTab;

      const request = {
        origin: origin,
        destination: destination,
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
      }
    
      const callback = (response: any, status: any) => {
        if(status === 'OK'){
          let distance = 0;
          let time = 0;
          for (let i = 0; i < response.routes[0].legs.length - 1; i++) {
            distance += response.routes[0].legs[i].distance.value;
            time += response.routes[0].legs[i].duration.value;
          }
          console.log("distance sans le retour => "+ distance / 1000 + "km");
          console.log('time sans le retour => '+ time / 60 + "minutes");
          resolve (distance / 1000)
        }else{
          this.toast.close();
          this.toast.error("Une des adresses de livraison n'est pas reconnue");
          return
        }
      }

      directionsService.route(request, callback);

    });
  }

  async newTabOrdering(origin: any, wayptsTab: any){
    return new Promise(async resolve=> {
      const directionsService = new google.maps.DirectionsService();
      const destination = "14 Rue d'Anthoine, 13002 Marseille";
      const waypts: google.maps.DirectionsWaypoint[] = wayptsTab;

      const request = {
        origin: origin,
        destination: destination,
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
      }

      const callback = async (response: any, status: any) => {
        if(status === 'OK'){
          let tab = [];
          for (let i = 0; i < response.routes[0].waypoint_order.length; i++) {
            let indiceOrder = response.routes[0].waypoint_order[i];
            let adresseFormat = waypts[indiceOrder].location;
            let adresseNom = await this.getNomAdresse(adresseFormat);
            let adressePhone = await this.getPhoneAdresse(adresseFormat);
            if(!adresseFormat){
              this.toast.error('Problème survenue avec une des adresses de livraison');
              return
            }

            if(!adresseNom){
              adresseNom = " n/a"
            }

            if(!adressePhone){
              adressePhone = " n/a"
            }

            tab.push({'location': adresseFormat, 'nom': adresseNom, 'phone': adressePhone, 'urlBonLivraison': null})
          }
          resolve(tab)
        }
      }

      directionsService.route(request, callback);
    });
  }

  async addCreneau(idDemandeCreneauRB: any, tabAdresseLivraison: any){
    // calculer le nombre d'heure par rapport à la tournée
    let time: any = await this.calculTempsItineraire(this.rbForm.value.adresseEnlevement.location, tabAdresseLivraison);
    let heuresEnlevementColis = 0.5; // 30min
    let tempsLivraison = tabAdresseLivraison.length * (10/60); // 10min par livraison
    const nombreCrenau = Math.ceil(time + heuresEnlevementColis + tempsLivraison);
    console.log('time creneau =>'+ time + 'h')
    console.log('nombre creneau =>'+ nombreCrenau + 'h')

    this.rbForm.value.date.setHours(this.rbForm.value.heureEnlevement); // setHours de la date avec la valeur de heureDebut du formulaire   

    const req: Crenau ={
      date: this.rbForm.value.date,
      dateString: this.datePipe.transform(this.rbForm.value.date, 'dd/MM/yyyy'),
      heureDebut: this.rbForm.value.heureEnlevement,
      heureFin: this.rbForm.value.heureEnlevement + nombreCrenau,
      inscrit: 0,
      inscritMax: 1,
      vehicule: "voiture",
      societe: "rosebaie",
      idDemandeCreneauRB: idDemandeCreneauRB
    }

    this.crenauservice.addCrenau(req); // ajouter creneau(x) à firebase
    
  }
  // async addCreneau(idDemandeCreneauRB: any, tabAdresseLivraison: any){
  //   // calculer le nombre d'heure par rapport à la tournée
  //   let time: any = await this.calculTempsItineraire(this.rbForm.value.adresseEnlevement.location, tabAdresseLivraison);
  //   let heuresEnlevementColis = 0.5; // 30min
  //   let tempsLivraison = tabAdresseLivraison.length * (10/60); // 10min par livraison
  //   const nombreCrenau = Math.ceil(time + heuresEnlevementColis + tempsLivraison);
  //   console.log('time creneau =>'+ time + 'h')
  //   console.log('nombre creneau =>'+ nombreCrenau + 'h')

  //   for(let i = 0; i < nombreCrenau; i++){      
  //     this.rbForm.value.date.setHours(this.rbForm.value.heureEnlevement + i); // setHours de la date avec la valeur de heureDebut du formulaire   

  //     const req: Crenau ={
  //       date: this.rbForm.value.date,
  //       dateString: this.datePipe.transform(this.rbForm.value.date, 'dd/MM/yyyy'),
  //       heureDebut: this.rbForm.value.heureEnlevement + i,
  //       heureFin: this.rbForm.value.heureEnlevement + i + 1,
  //       inscrit: 0,
  //       inscritMax: 1,
  //       vehicule: "voiture",
  //       societe: "rosebaie",
  //       idDemandeCreneauRB: idDemandeCreneauRB
  //     }

  //     this.crenauservice.addCrenau(req); // ajouter creneau(x) à firebase
  //   }
  // }

  async onSubmit(){
    this.toast.close();

    if (!this.rbForm.valid) {
      this.toast.error('Formulaire invalide');
      return;
    }

    this.toast.loading('Demande en cours');

    // ajouter recuperer false a adresseEnlevement
    this.rbForm.value.adresseEnlevement = {location: this.rbForm.value.adresseEnlevement, recupere: false};

    this.rbForm.value.km = await this.calculDistanceItineraire(this.rbForm.value.adresseEnlevement.location, this.rbForm.value.adresseLivraison);
    this.rbForm.value.km = this.rbForm.value.km.toFixed(3);
    
    // setHours de la date avec la valeur de heureDebut du formulaire
    this.rbForm.value.date.setHours(this.rbForm.value.heureEnlevement);

    // copie tu tableau de livraison avant modification(newTabOrdering)
    const copyTabLivraison = this.rbForm.value.adresseLivraison.slice();

    // remmetre tableau adresseLivraison dans l'ordre de livraison
    this.rbForm.value.adresseLivraison = await this.newTabOrdering(this.rbForm.value.adresseEnlevement.location, this.rbForm.value.adresseLivraison);

    // ajout de la demande de creneau a firebase et recuperation de l'id)
    const idDemandeCreneauRB = await this.demandeCrenauRB.addDemandeCrenauRB(this.rbForm.value);

    // ajouter creneau a firebase avec l'id de addDemandeCrenauRB en parametre
    this.addCreneau(idDemandeCreneauRB, copyTabLivraison);

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
    
    this.toast.close();
    const toastValid = this.toast.success('Demande de livraison prise en compte',{duration: 2500});
    
    toastValid.afterClosed.subscribe((e) => {
      this.router.navigate(['/livraisonRB']);
    });
  }

}
