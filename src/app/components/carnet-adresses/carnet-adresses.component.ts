import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { HotToastService } from '@ngneat/hot-toast';
import { Adresse } from 'src/app/models/adresse.model';
import { AdressesService } from 'src/app/services/adresses.service';
import { ModalCreateAdresseComponent } from '../modal/modal-create-adresse/modal-create-adresse.component';
import { ModalDeleteCrenauComponent } from '../modal/modal-delete-crenau/modal-delete-crenau.component';

@Component({
  selector: 'app-carnet-adresses',
  templateUrl: './carnet-adresses.component.html',
  styleUrls: ['./carnet-adresses.component.scss']
})
export class CarnetAdressesComponent implements OnInit {
  adresses: Adresse[] = [];
  lowValueSlice: number = 0;
  highValueSlice: number = 10;

  constructor(private adresseservice: AdressesService, private toast: HotToastService, public dialog: MatDialog) { }

  ngOnInit(): void {
    // retourner les adresses
    this.adresseservice.getAdresses().subscribe((res: Adresse[]) => {
      // this.adresses = res;
      this.adresses = res.sort(function(a, b){ // retourner par ordre alphabetique
        let x = a.nom.toLowerCase();
        let y = b.nom.toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
      });
    })
  }

  openDialogModal() {
    this.dialog.open(ModalCreateAdresseComponent);
  }

  // ouvrir popup confirmation suppression adresse
  openDialogModalDelete(id: string) {
    const dialogRef = this.dialog.open(ModalDeleteCrenauComponent);
    dialogRef.componentInstance.confirmMessage = "Êtes-vous sûr de vouloir supprimer cette adresse ?"
    dialogRef.afterClosed().subscribe(async result => {
      if(result == true) {
        await this.adresseservice.deleteAdresse(id);
        this.toast.success('Adresse supprimée');
      }    
    });
  }

  toggleDepot(adresse: Adresse){
    if(adresse.status){
      this.adresseservice.deleteStatusDepot(adresse.id)
    }else{
      this.adresseservice.setStatusDepot(adresse.id)
    }
  }


  // pagination
  public getPaginatorData(event: PageEvent): PageEvent {
    this.lowValueSlice = event.pageIndex * event.pageSize;
    this.highValueSlice = this.lowValueSlice + event.pageSize;
    return event;
  }

}
