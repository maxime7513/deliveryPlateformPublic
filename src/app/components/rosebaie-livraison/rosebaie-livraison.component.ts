import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { DemandecrenauRB } from 'src/app/models/demandeCrenauRB.model';
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

  constructor(private demandeCrenauRBService: DemandeCrenauRBService) {
    this.showDetails = false;
  }

  ngOnInit(): void {
    this.demandeCrenauRBService.getDemandeCrenauRB().subscribe(res => {
      this.creneauxRB = res;
    })
  }

  // pagination
  public getPaginatorData(event: PageEvent): PageEvent {
    this.lowValueSlice = event.pageIndex * event.pageSize;
    this.highValueSlice = this.lowValueSlice + event.pageSize;
    return event;
  }

}
