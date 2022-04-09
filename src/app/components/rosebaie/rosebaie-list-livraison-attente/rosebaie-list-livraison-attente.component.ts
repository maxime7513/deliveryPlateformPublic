import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { HotToastService } from '@ngneat/hot-toast';
import { rbLivraisonAttente } from 'src/app/models/rbLivraisonAttente';
import { RBAdresseAttenteService } from 'src/app/services/rb-adresse-attente.service';
import { ModalDeleteCrenauComponent } from '../../modal/modal-delete-crenau/modal-delete-crenau.component';
import { ModalRbValiderLivraisonComponent } from '../../modal/modal-rb-valider-livraison/modal-rb-valider-livraison.component';

@Component({
  selector: 'app-rosebaie-list-livraison-attente',
  templateUrl: './rosebaie-list-livraison-attente.component.html',
  styleUrls: ['./rosebaie-list-livraison-attente.component.scss']
})
export class RosebaieListLivraisonAttenteComponent implements OnInit {

  livraisonAttente: rbLivraisonAttente[] = [];
  checkbox : boolean[] = [] ;
  showSpinner : boolean = true;
  lowValueSlice: number = 0;
  highValueSlice: number = 10;
  colis: number[] = [];
  nombreColis = [1,2,3,4,5,6,7,8,9,10];

  constructor(private rbAdresseAttenteService: RBAdresseAttenteService, public dialog: MatDialog, private toast: HotToastService) { }

  ngOnInit(): void {
    this.rbAdresseAttenteService.getLivraisonsAttente().subscribe((res: rbLivraisonAttente[]) => {
      this.livraisonAttente = res;
      this.showSpinner = false;
    })
  }

  // pagination
  public getPaginatorData(event: PageEvent): PageEvent {
    this.lowValueSlice = event.pageIndex * event.pageSize;
    this.highValueSlice = this.lowValueSlice + event.pageSize;
    return event;
  }

  openDialogModal(tabAdress: rbLivraisonAttente[]) {
    const dialogRef = this.dialog.open(ModalRbValiderLivraisonComponent);
    dialogRef.componentInstance.tabAdresse = tabAdress;
  }

  // checkChekbox(){
  //   for(let check of this.checkbox){
  //     if(check == true){
  //       return false;
  //     }
  //   }
  //   return true
  // }
  checkChekbox(){
    for(let i = 0; i < this.checkbox.length; i++){
      if(this.checkbox[i] == true && this.colis[i]){
        return false;
      }
    }
    return true
  }
  
  // ouvrir popup confirmation suppression adresse
  openDialogModalDelete(id: string) {
    const dialogRef = this.dialog.open(ModalDeleteCrenauComponent);
    dialogRef.componentInstance.confirmMessage = "Êtes-vous sûr de vouloir supprimer cette livraison ?"
    dialogRef.afterClosed().subscribe(async result => {
      if(result == true) {
        await this.rbAdresseAttenteService.deleteLivraisonsAttente(id);
        this.toast.success('Adresse supprimée');
      }    
    });
  }

  async valider(){
    this.toast.close();
    let tabAdresseChecked : rbLivraisonAttente[] = [];
    for(let i=0; i < this.livraisonAttente.length; i++){
      if(this.checkbox[i] == true && !this.colis[i]){
        this.toast.error('Renseigner le nombre de colis')
        return
      }else if(this.checkbox[i] == true && this.colis[i]){
        tabAdresseChecked.push(this.livraisonAttente[i]);
        this.livraisonAttente[i].nombreColis = this.colis[i];
      }
    }
    this.openDialogModal(tabAdresseChecked);
  }

}
