import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { HotToastService } from '@ngneat/hot-toast';
import { Crenau } from 'src/app/models/crenau.model';
import { DemandecrenauRB } from 'src/app/models/demandeCrenauRB.model';
import { CrenauService } from 'src/app/services/crenau.service';
import { DemandeCrenauRBService } from 'src/app/services/demande-crenau-rb.service';
import { RBAdresseAttenteService } from 'src/app/services/rb-adresse-attente.service';
import { UsersService } from 'src/app/services/users.service';
import { ModalDeleteCrenauComponent } from '../../modal/modal-delete-crenau/modal-delete-crenau.component';

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
  userRole: any;
  totalColis: number = 0;
  showSpinner : boolean = true;

  constructor(private demandeCrenauRBService: DemandeCrenauRBService, private crenauService: CrenauService, private usersService: UsersService, private rbAdresseAttenteService: RBAdresseAttenteService, private toast: HotToastService, public dialog: MatDialog) {
    this.showDetails = false;
  }

  async ngOnInit(): Promise<void> {
    this.demandeCrenauRBService.getDemandeCrenauRB().subscribe(res => {
      this.creneauxRB = res;
      this.showSpinner = false;
    })

    this.userRole =  await this.usersService.canAccess$;
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

  calculIncident(creneauRB: any){
    let incident = 0;
    for(let creneau of creneauRB.adresseLivraison){
      if(creneau.incident){
        incident += 1;
      }
    }
    return incident
  }

  calculNombreColis(crenauRb: any){
    let totalColis = 0;
    crenauRb.adresseLivraison.map((element: any) => {
      totalColis += element.nombreColis;
    })
    return totalColis
  }
  
  deleteLivraison(creneau: DemandecrenauRB){
    // delete demandeCrenauRB
    this.crenauService.getCrenauRB(creneau).subscribe((res: any) => {
      res.forEach((element: any) => {
        this.crenauService.deleteCrenau(element);
      });
    })
    // delete crenau
    this.demandeCrenauRBService.deleteCrenau(creneau);
    // remettre adresses dans livraison adresse en attente
    creneau.adresseLivraison.forEach((element: any) => {
      this.rbAdresseAttenteService.addLivraisonAttente(element);
    });
  }

  // ouvrir popup confirmation suppression adresse
  openDialogModalDelete(creneau: DemandecrenauRB) {
    const dialogRef = this.dialog.open(ModalDeleteCrenauComponent);
    dialogRef.componentInstance.confirmMessage = "Êtes-vous sûr de vouloir supprimer cette livraison ?"
    dialogRef.afterClosed().subscribe(async result => {
      if(result == true) {
        this.deleteLivraison(creneau);
        this.toast.success('Livraison supprimée');
      }
    });
  }

  // pagination
  public getPaginatorData(event: PageEvent): PageEvent {
    this.lowValueSlice = event.pageIndex * event.pageSize;
    this.highValueSlice = this.lowValueSlice + event.pageSize;
    return event;
  }

}
