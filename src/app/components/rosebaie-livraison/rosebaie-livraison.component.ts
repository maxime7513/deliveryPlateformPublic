import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { DemandeCrenauRBService } from 'src/app/services/demande-crenau-rb.service';

@Component({
  selector: 'app-rosebaie-livraison',
  templateUrl: './rosebaie-livraison.component.html',
  styleUrls: ['./rosebaie-livraison.component.scss']
})
export class RosebaieLivraisonComponent implements OnInit {

  creneauxRB: any[] = [];
  showDetails: boolean;
  // pagination
  lowValueSlice: number = 0;
  highValueSlice: number = 10;
  
  showSpinner : boolean = true;

  constructor(private demandeCrenauRBService: DemandeCrenauRBService) {
    this.showDetails = false;
  }

  ngOnInit(): void {
    this.demandeCrenauRBService.getDemandeCrenauRB().subscribe(res => {
      this.creneauxRB = res;
      this.showSpinner = false;
    })
  }

  formatTime(time: number){
    let heure = Math.floor(time),
    minutes = parseInt((time * 60).toFixed(0)),
    nbminuteRestante = (minutes % 60),
    res;
    if(nbminuteRestante < 10){
      res = 'Temps de livraison estimé : ' + heure + 'h0' + nbminuteRestante;
    }else{
      res = 'Temps de livraison estimé : ' + heure + 'h' + nbminuteRestante;
    }
    return res
  }

  // pagination
  public getPaginatorData(event: PageEvent): PageEvent {
    this.lowValueSlice = event.pageIndex * event.pageSize;
    this.highValueSlice = this.lowValueSlice + event.pageSize;
    return event;
  }

}
