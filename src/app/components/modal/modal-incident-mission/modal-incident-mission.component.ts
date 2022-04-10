import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { ProfileUser } from 'src/app/models/user.profil';
import { DemandeCrenauRBService } from 'src/app/services/demande-crenau-rb.service';
import { MessageService } from 'src/app/services/message.service';
import { RBAdresseAttenteService } from 'src/app/services/rb-adresse-attente.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-modal-incident-mission',
  templateUrl: './modal-incident-mission.component.html',
  styleUrls: ['./modal-incident-mission.component.scss']
})
export class ModalIncidentMissionComponent implements OnInit {

  constructor(private usersService: UsersService, private demandeCrenauRbService: DemandeCrenauRBService, private messageService: MessageService, private rbAdresseAttenteService: RBAdresseAttenteService, public dialogRef: MatDialogRef<ModalIncidentMissionComponent>, private toast: HotToastService) { }

  problemeMissionForm: FormGroup;
  user$ = this.usersService.currentUserProfile$;
  user: ProfileUser;
  livraison: any;
  tabLivraison: any[];
  indexTab: number;
  idMission: string;
  incidentList: string[] = ['Etablissement Fermée', 'Problème bon livraison', 'autres'];

  async ngOnInit(): Promise<void> {
    this.validateform();
    
    // return user
    this.usersService.currentUserProfile$
    .pipe()
    .subscribe((user) => {
      this.user = user;
    });
  }

  // init validator
  validateform() {
    this.problemeMissionForm = new FormGroup(
      {
        incident: new FormControl('', Validators.required),
        message: new FormControl('', Validators.required)
      }
    );
  }

  parcourirTabLivraison(tabLivraison: any){
    for(let liv of tabLivraison){
      if(!liv.urlBonLivraisonSigne && !liv.incident){
        return false
      }
    }
    return true
  }
  
  onSubmit(){
    if (!this.problemeMissionForm.valid) {
      this.toast.error('Formulaire invalide');
      return;
    }

    // ajouter incident à firebase
    this.tabLivraison[this.indexTab].incident = this.problemeMissionForm.value.incident;
    this.demandeCrenauRbService.updateAdresseLivraison(this.idMission, this.tabLivraison);

    if(this.user.photoURL == null){
      this.user.photoURL = '';
    }

    const contenue = 'Client : ' + this.livraison.nom + `\n` +
    'Adresse : ' + this.livraison.location + `\n` +
    'Incident : ' + this.problemeMissionForm.value.incident + `\n` +
    'Messsage :' + `\n` + this.problemeMissionForm.value.message;

    const message= {
      date: new Date,
      nom: this.user.lastName,
      prenom: this.user.firstName,
      photoUrl : this.user.photoURL,
      urlBonLivraison: this.livraison.urlBonLivraison,
      contenue : contenue,
      lu: false,
      traite: false
    }

    if(this.parcourirTabLivraison(this.tabLivraison)){
      this.demandeCrenauRbService.setStatusLivraison(this.idMission, "livre avec incident");
    }

    // supprimer incident avant de remmettre l'adresse dans livraison adresse en attente
    delete this.livraison.incident;
    // remettre l'adresse dans livraison adresse en attente
    this.rbAdresseAttenteService.addLivraisonAttente(this.livraison);

    this.toast.success('Incident enregistré')
    this.messageService.addMessage(message);
    this.dialogRef.close();
  }
}
