import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Adresse } from 'src/app/models/adresse.model';
import { BonLivraisonRosebaie } from 'src/app/models/bonLivraisonRosebaie.model';
import { DemandecrenauRB } from 'src/app/models/demandeCrenauRB.model';
import { AdressesService } from 'src/app/services/adresses.service';
import { BonLivraisonRosebaieService } from 'src/app/services/bon-livraison-rosebaie.service';

@Component({
  selector: 'app-liste-bon-livraison',
  templateUrl: './liste-bon-livraison.component.html',
  styleUrls: ['./liste-bon-livraison.component.scss']
})
export class ListeBonLivraisonComponent implements OnInit {

  societes: Adresse[];
  bonLivraisons: BonLivraisonRosebaie[];
  selectSocieteValue: string;
  numeroBonLivraison: string;
  lowValueSlice: number = 0;
  highValueSlice: number = 10;
  showSpinner : boolean = true;

  constructor(private adresseService: AdressesService, private bonLivraisonRosebaieService: BonLivraisonRosebaieService) { }

  ngOnInit(): void {
    this.bonLivraisonRosebaieService.getBonLivraison().subscribe((res: any) => {
      this.bonLivraisons = res;
      this.showSpinner = false;
    })

    this.adresseService.getAdresses().subscribe((res: any) => {
      this.societes = res;
    })
  }

  getBonLivraisonBySociete(){
    this.numeroBonLivraison = '';
    this.bonLivraisonRosebaieService.getBonLivraisonByNom(this.selectSocieteValue).subscribe((res: any) => {
      this.bonLivraisons = res;
    })
  }

  getBonLivraisonByNumero(){
    this.selectSocieteValue = '';
    this.bonLivraisonRosebaieService.getBonLivraisonByNumero(this.numeroBonLivraison).subscribe((res: any) => {
      this.bonLivraisons = res;
    })
  }

  // pagination
  public getPaginatorData(event: PageEvent): PageEvent {
    this.lowValueSlice = event.pageIndex * event.pageSize;
    this.highValueSlice = this.lowValueSlice + event.pageSize;
    return event;
  }

}
