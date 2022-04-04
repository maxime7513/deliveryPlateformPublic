import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { concatMap } from 'rxjs';
import { DemandecrenauRB } from 'src/app/models/demandeCrenauRB.model';
import { DemandeCrenauRBService } from 'src/app/services/demande-crenau-rb.service';
import { ImageUploadService } from 'src/app/services/image-upload.service';

@Component({
  selector: 'app-mission-rosebaie',
  templateUrl: './mission-rosebaie.component.html',
  styleUrls: ['./mission-rosebaie.component.scss']
})
export class MissionRosebaieComponent implements OnInit {

  missionRB: any;
  id: string;
  showMission: boolean;
  dateNow = new Date().getTime();
  private refreshdateNow: any = setInterval(() => {
    this.dateNow = new Date().getTime();
  }, 10000);

  constructor(private route: ActivatedRoute, private demandeCrenauRbService: DemandeCrenauRBService, private imageUploadService: ImageUploadService, private toast: HotToastService, private router: Router) { }

  async ngOnInit(): Promise<void> {
    this.showMission = false;
    this.id = await this.route.snapshot.params['id'];
    // console.log(this.id);

    this.demandeCrenauRbService.getDemandeCrenauRBByID(this.id).subscribe(res => {
      this.missionRB = res;
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
    this.demandeCrenauRbService.updateAdresseEnlevement(this.id, new Date);
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
    tabAdresseLivraison[indice].urlBonLivraison = photoURL;
    tabAdresseLivraison[indice].dateLivraisonEffectue = new Date;
    // console.log(tabAdresseLivraison);
    this.demandeCrenauRbService.updateUrlBonLivraison(this.id, tabAdresseLivraison);
    if(this.parcourirTabLivraison(tabAdresseLivraison)){
      this.demandeCrenauRbService.setStatusLivre(this.id);
    }
  }

  parcourirTabLivraison(tabLivraison: any){
    for(let liv of tabLivraison){
      if(!liv.urlBonLivraison){
        return false
      }
    }
    return true
  }

}
