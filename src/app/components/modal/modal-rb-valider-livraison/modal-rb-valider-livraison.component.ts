import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { map, Observable, startWith } from 'rxjs';
import { Crenau } from 'src/app/models/crenau.model';
import { rbLivraisonAttente } from 'src/app/models/rbLivraisonAttente';
import { ProfileUser } from 'src/app/models/user.profil';
import { AdressesService } from 'src/app/services/adresses.service';
import { BonLivraisonRosebaieService } from 'src/app/services/bon-livraison-rosebaie.service';
import { CrenauService } from 'src/app/services/crenau.service';
import { DemandeCrenauRBService } from 'src/app/services/demande-crenau-rb.service';
import { MessageService } from 'src/app/services/message.service';
import { RBAdresseAttenteService } from 'src/app/services/rb-adresse-attente.service';
import { TwilioService } from 'src/app/services/twilio.service';
import { UsersService } from 'src/app/services/users.service';

interface Heure {
  value: number;
  viewValue: string;
}
interface Adresse {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-modal-rb-valider-livraison',
  templateUrl: './modal-rb-valider-livraison.component.html',
  styleUrls: ['./modal-rb-valider-livraison.component.scss']
})
export class ModalRbValiderLivraisonComponent implements OnInit {

  tabAdresse: rbLivraisonAttente[];
  rbForm: FormGroup;
  datePicker = new Date;
  heures: Heure[] = [
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
  // mat autocomplete depot
  optionsDepot: Adresse[] = [];
  filteredOptionsDepot: Observable<Adresse[]>;
  recapLivraison: boolean = false;
  user$ = this.usersService.currentUserProfile$;
  user: ProfileUser;
  ccE: string = "+33";

  constructor(private adresseservice: AdressesService, private crenauservice: CrenauService, private demandeCrenauRB: DemandeCrenauRBService, private rbAdresseAttenteService: RBAdresseAttenteService, private bonLivraisonRosebaieService: BonLivraisonRosebaieService, private usersService: UsersService, private messageService: MessageService, private twilioservice: TwilioService, private toast: HotToastService, public dialogRef: MatDialogRef<ModalRbValiderLivraisonComponent>, public datePipe: DatePipe, private router: Router) { }

  async ngOnInit(): Promise<void> {
    this.validateform();

    // recuperer adresse de depot pour mat autocomplete
    await this.nomAdressDepot$;
    this.filteredOptionsDepot = this.rbForm.get('adresseEnlevement').valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );

    // ajouter adresse de depot par default si il y en a que une d'enregistré
    if(this.optionsDepot.length == 1){
      this.adresseEnlevement.setValue(this.optionsDepot[0].value)
    }

    // return user
    this.usersService.currentUserProfile$
    .pipe()
    .subscribe((user) => {
      this.user = user;
    });
  }

  validateform() {
    this.rbForm = new FormGroup(
      {
        date: new FormControl('', Validators.required),
        heureEnlevement: new FormControl('', Validators.required),
        adresseEnlevement: new FormControl('', Validators.required),
      }
    );
  }

  // getter
  get date() {
    return this.rbForm.get('date');
  }
  get adresseEnlevement() {
    return this.rbForm.get('adresseEnlevement');
  }
  get heureEnlevement() {
    return this.rbForm.get('heureEnlevement');
  }

  private _filter(name: string): Adresse[] {
    const filterValue = name.toLowerCase();
    return this.optionsDepot.filter(option => option.viewValue.toLowerCase().includes(filterValue));
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

  // return array telephones des livreurs (Promise for use await dans la fonction send_smsGrouper())
  get livreursPhone$(){
    let tab: any = [];
    return new Promise(resolve => {
      this.usersService.getUsersByRole('livreur').subscribe((res) => {
        res.map(user => {
          tab.push(this.ccE + user.phone)
        })
        resolve(tab);
      })
    });
  }

  formatTime(time: number){
    let heure = Math.floor(time),
    minutes = parseInt((time * 60).toFixed(0)),
    nbminuteRestante = (minutes % 60),
    res;
    if(nbminuteRestante < 10){
      res =  heure + 'h0' + nbminuteRestante;
    }else{
      res =  heure + 'h' + nbminuteRestante;
    }
    return res
  }

  calculDistanceItineraire(origin: any, wayptsTab: any){
    // console.log(wayptsTab)
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
          console.log(response)
          resolve ((distance / 1000).toFixed(1))
        }else{
          this.toast.close();
          this.toast.error("Une des adresses de livraison n'est pas reconnue");
          return
        }
      }

      directionsService.route(request, callback);

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
            let adresse = this.tabAdresse[indiceOrder];
            tab.push(adresse)
          }

          // for(let adr of tab){
          //   delete adr.id
          // }
          resolve(tab)
        }
      }

      directionsService.route(request, callback);
    });
  }

  async addCreneau(idDemandeCreneauRB: any){
    const nombreCrenau = Math.ceil(this.rbForm.value.time);
    const req: Crenau = {
      date: this.rbForm.value.date,
      dateString: this.datePipe.transform(this.rbForm.value.date, 'dd/MM/yyyy'),
      heureDebut: this.rbForm.value.heureEnlevement,
      heureFin: this.rbForm.value.heureEnlevement + nombreCrenau,
      inscrit: 0,
      inscritMax: 1,
      vehicule: "camion",
      societe: "rosebaie",
      idDemandeCreneauRB: idDemandeCreneauRB,
    }

    this.crenauservice.addCrenau(req); // ajouter creneau(x) à firebase
    
  }

  // envoyer sms à tous les livreurs
  async send_smsGrouper(dateCrenau: string) {
    let tabPhones = await this.livreursPhone$;

    let req = {
      role: 'rosebaie',
      date: dateCrenau,
      phoneTab: tabPhones
    }
    
    // requete twilio
    this.twilioservice.send_smsGroupe(req);
  }

  async onSubmit(){
    this.toast.close();
    console.log(this.tabAdresse)
    if (!this.rbForm.valid) {
      this.toast.error('Formulaire invalide');
      return;
    }

    this.toast.loading("Calcul de l'itinéraire ...");

    // ajouter recuperer false a adresseEnlevement
    this.rbForm.value.adresseEnlevement = {location: this.rbForm.value.adresseEnlevement, recupere: false};
    
    // format tableau adresse livraison pour function calcul google
    let tabLivraisonLocation = []
    for(let adr of this.tabAdresse){
      tabLivraisonLocation.push({location: adr.location})
    }

    // calcul distance livraison
    this.rbForm.value.km = await this.calculDistanceItineraire(this.rbForm.value.adresseEnlevement.location, tabLivraisonLocation);

    // // calcul temps livraison
    let timeLivraison: any = await this.calculTempsItineraire(this.rbForm.value.adresseEnlevement.location, tabLivraisonLocation);
    let heuresEnlevementColis = 0.5; // 30min
    let tempsLivraison = this.tabAdresse.length * (10/60); // 10min par livraison
    this.rbForm.value.time = (timeLivraison + heuresEnlevementColis + tempsLivraison).toFixed(2);

    // // setHours de la date avec la valeur de heureDebut du formulaire
    this.rbForm.value.date.setHours(this.rbForm.value.heureEnlevement);

    this.rbForm.value.adresseLivraison = await this.newTabOrdering(this.rbForm.value.adresseEnlevement.location, tabLivraisonLocation);
    this.recapLivraison = true;

    this.toast.close();
  }

  async onSubmit2(){
    this.toast.loading('Demande en cours');
    
    // donner numero de mission
    const numeroMission = await this.crenauservice.returnNumeroCrenau('rosebaie');
    this.rbForm.value.numeroMission = 'RB00' + (numeroMission + 1);

    // ajout de la demande de creneau a firebase et recuperation de l'id)
    const idDemandeCreneauRB = await this.demandeCrenauRB.addDemandeCrenauRB(this.rbForm.value);

    // ajouter creneau a firebase avec l'id de addDemandeCrenauRB en parametre
    this.addCreneau(idDemandeCreneauRB);

    // ajouter les bons de livraisons à firebase
    for(let adresseLivraison of this.rbForm.value.adresseLivraison){
      let req = {
        id: adresseLivraison.id,
        nom: adresseLivraison.nom,
        urlBonLivraison: adresseLivraison.urlBonLivraison,
        numeroBonLivraison: adresseLivraison.numeroBonLivraison,
        date: adresseLivraison.date
      }
      this.bonLivraisonRosebaieService.addBonLivraison(req)
    }

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
      contenue : contenue,
      lu: false,
      traite: false
    }

    // envoyer message à woozoo
    this.messageService.addMessage(message);
    // envoyer sms aux livreurs
    this.send_smsGrouper(date);

    this.toast.close();
    const toastValid = this.toast.success('Demande de livraison prise en compte',{duration: 2000});
    
    toastValid.afterClosed.subscribe((e) => {
      this.dialogRef.close();
      this.router.navigate(['/livraisonRB']);
      for(let adr of this.tabAdresse){
        this.rbAdresseAttenteService.deleteLivraisonsAttente(adr.id);
      }
    });
  }

}
