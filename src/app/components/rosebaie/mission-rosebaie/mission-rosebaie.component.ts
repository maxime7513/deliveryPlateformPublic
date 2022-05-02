import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { concatMap } from 'rxjs';
import { DemandecrenauRB } from 'src/app/models/demandeCrenauRB.model';
import { BonLivraisonRosebaieService } from 'src/app/services/bon-livraison-rosebaie.service';
import { DemandeCrenauRBService } from 'src/app/services/demande-crenau-rb.service';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { ModalIncidentMissionComponent } from '../../modal/modal-incident-mission/modal-incident-mission.component';

@Component({
  selector: 'app-mission-rosebaie',
  templateUrl: './mission-rosebaie.component.html',
  styleUrls: ['./mission-rosebaie.component.scss']
})
export class MissionRosebaieComponent implements OnInit {

  missionRB: any;
  idMission: string;
  showMission: boolean;
  dateNow = new Date().getTime();
  private refreshdateNow: any = setInterval(() => {
    this.dateNow = new Date().getTime();
  }, 10000);
  showSpinner : boolean = true;

  constructor(private route: ActivatedRoute, private demandeCrenauRbService: DemandeCrenauRBService, private imageUploadService: ImageUploadService, private bonLivraisonRosebaieService: BonLivraisonRosebaieService, private toast: HotToastService, public dialog: MatDialog) { }

  async ngOnInit(): Promise<void> {
    this.showMission = false;
    this.idMission = await this.route.snapshot.params['id'];
    // console.log(this.idMission);

    this.demandeCrenauRbService.getDemandeCrenauRBByID(this.idMission).subscribe(res => {
      this.missionRB= res;
      this.showSpinner = false;
    });

    this.refreshdateNow;
  }

  async returnGoogleItinary() {
  
    const success = async (position: any) => {
      this.toast.close();
      const lat  = await position.coords.latitude,
      lng = await position.coords.longitude;
            
      let adresseItinary = "";
      for(let adresse of this.missionRB.adresseLivraison){
        adresseItinary += '/' + adresse.location;
      }
      let urlItinary = "https://www.google.com/maps/dir/" + lat + "," + lng + "/" + this.missionRB.adresseEnlevement.location + adresseItinary;
      let formatUrl = urlItinary.replace(/ /g, "+")

      window.open(formatUrl, '_blank');
    }
  
    const error = () => {
      this.toast.close()
      this.toast.error('Impossible de trouver votre position')
    }
  
    if(!navigator.geolocation) {
      this.toast.error("La geolocation n'est pas supporté par votre navigateur")
    }else{
      navigator.geolocation.getCurrentPosition(success, error);
      this.toast.loading('Récupération de votre position')
    }
  
  }

  colisRecupere(){
    this.demandeCrenauRbService.updateAdresseEnlevement(this.idMission, new Date);
  }

  uploadBonLivraison(event: any, indice: number) { 
    let time = new Date().getTime();      
    this.imageUploadService
      .uploadImage(event.target.files[0], `/images/bonLivraisonRosebaie/bondelivraison-${time}`)
      .pipe(
        this.toast.observe({
          loading: "Envoie du bon de livraison ...",
          success: 'Bon de livraison envoyé avec succes',
          error: "Une erreur c'est produite lors de l'envoie",
        }),
        concatMap((photoURL) =>
          this.updateBonLivraison(indice, photoURL)
        )
      )
      .subscribe(
      );
  }

  async updateBonLivraison(indice: number, photoURL: string){
    let tabAdresseLivraison = this.missionRB.adresseLivraison;
    tabAdresseLivraison[indice].urlBonLivraisonSigne = photoURL;
    tabAdresseLivraison[indice].dateLivraisonEffectue = new Date;
    this.demandeCrenauRbService.updateAdresseLivraison(this.idMission, tabAdresseLivraison);
    // if(this.parcourirTabLivraison(tabAdresseLivraison)){
    //   this.demandeCrenauRbService.setStatusLivraison(this.idMission, "livre");
    // }
    if(this.parcourirTabLivraison(tabAdresseLivraison) == 'livre'){
      this.demandeCrenauRbService.setStatusLivraison(this.idMission, "livre");
    }else if(this.parcourirTabLivraison(tabAdresseLivraison) == 'livre avec incident'){
      this.demandeCrenauRbService.setStatusLivraison(this.idMission, "livre avec incident");
    }
    
    // ajouter url bon de livraison signé à bonLivraisonRosebaie dans firebase
    this.bonLivraisonRosebaieService.setBonLivraisonSigne(tabAdresseLivraison[indice].id, photoURL)
  }

  setBonLivraisonSigne(idBonLivraison: string){

  }
  // parcourirTabLivraison(tabLivraison: any){
  //   for(let liv of tabLivraison){
  //     if(!liv.urlBonLivraisonSigne && !liv.incident){
  //       return false
  //     }
  //   }
  //   return true
  // }

  parcourirTabLivraison(tabLivraison: any){
    let status;
    for(let liv of tabLivraison){
      if(!liv.urlBonLivraisonSigne && !liv.incident){
        return false
      }else if(liv.incident){
        status = 'livre avec incident'
      }
    }
    if(status == 'livre avec incident'){
      return status
    }else{
      return 'livre'
    }
  }

  openDialogModal(livraison: any, tabLivraison: any[], index: number) {
    const dialogRef = this.dialog.open(ModalIncidentMissionComponent);
    dialogRef.componentInstance.livraison = livraison;
    dialogRef.componentInstance.tabLivraison = tabLivraison;
    dialogRef.componentInstance.indexTab = index;
    dialogRef.componentInstance.idMission = this.idMission;
  }

}
