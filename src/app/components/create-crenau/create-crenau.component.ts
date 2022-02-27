import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Crenau } from 'src/app/models/crenau.model';
import { CrenauService } from 'src/app/services/crenau.service';
import { ModalDeleteCrenauComponent } from '../modal-delete-crenau/modal-delete-crenau.component';

interface Heure {
  value: number;
  viewValue: string;
}
interface inscritMax {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-create-crenau',
  templateUrl: './create-crenau.component.html',
  styleUrls: ['./create-crenau.component.scss']
})
export class CreateCrenauComponent implements OnInit {

  crenauForm: FormGroup;
  submitCrenauForm : boolean;
  datePicker = new Date;
  defaultDatePicker: Date;
  showCrenaux: boolean;
  heures: Heure[] = [
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
    {value: 24, viewValue: '24h'},
  ];
  inscritsMax: inscritMax[] = [
    {value: 1, viewValue: '1 livreur'},
    {value: 2, viewValue: '2 livreur'},
    {value: 3, viewValue: '3 livreur'},
    {value: 4, viewValue: '4 livreur'},
    {value: 5, viewValue: '5 livreur'},
    {value: 6, viewValue: '6 livreur'},
    {value: 7, viewValue: '7 livreur'},
    {value: 8, viewValue: '8 livreur'},
  ];

  constructor(private crenauservice: CrenauService, private toast: HotToastService, private router: Router, public datePipe : DatePipe,  public dialog: MatDialog) {
    this.defaultDatePicker = this.datePicker;
    this.showCrenaux = false;
  }

  crenaux: Crenau[] = [];

  ngOnInit(): void {
    // init formulaire
    this.validateform();
    this.submitCrenauForm = false;
    // afficher crenaux par date
    this.afficherCrenauParDate();
  }

  // init validator
  validateform() {
    this.crenauForm = new FormGroup(
      {
        date: new FormControl('', Validators.required),
        heureDebut: new FormControl("", Validators.required),
        heureFin: new FormControl("", Validators.required),
        inscrit: new FormControl(0),
        inscritMax: new FormControl('', Validators.required),
      }
    );
  }

  // getter for mat error
  get date() {
    return this.crenauForm.get('date');
  }  
  get heureDebut() {
    return this.crenauForm.get('heureDebut');
  }
  get heureFin() {
    return this.crenauForm.get('heureFin');
  }
  get inscritMax() {
    return this.crenauForm.get('inscritMax');
  }

  // crenaux par date (datepicker)
  afficherCrenauParDate(){
    let date = this.datePipe.transform(this.defaultDatePicker, 'dd/MM/yyyy');
    this.crenauservice.getCrenauxByDate(date).subscribe((res: Crenau[]) => {
      // trier par heure
      this.crenaux = res.sort(function (a:any, b:any) {
      return a.heureDebut - b.heureDebut
      });
    })
  }

  calculDifferenceHeure(heureDebut: number, heureFin: number){
    var diff_temps = heureFin - heureDebut;
    return Math.round(diff_temps);
  }

  // envoi du formulaire
  onSubmit() {
    this.toast.close();
    // this.toast.loading('Ajout du crénau ...');
    this.submitCrenauForm = true;
    if (!this.crenauForm.valid) {
      console.log('formulaire invalid');
      this.toast.error('Formulaire invalide');
      return;
    }

    // date au format string
    this.crenauForm.value.dateString = this.datePipe.transform(this.crenauForm.value.date, 'dd/MM/yyyy');

    const nombreCrenau = this.calculDifferenceHeure(this.crenauForm.value.heureDebut, this.crenauForm.value.heureFin);
    const heureDebutStorage = this.crenauForm.value.heureDebut;
    for(let i = 0; i < nombreCrenau; i++){
      this.crenauForm.value.heureDebut = heureDebutStorage + i;
      this.crenauForm.value.heureFin = this.crenauForm.value.heureDebut + 1;
      
      // setHours de la date avec la valeur de heureDebut du formulaire
      this.crenauForm.value.date.setHours(this.crenauForm.value.heureDebut);
      
      // ajouter creneau(x) à firebase
      this.crenauservice.addCrenau(this.crenauForm.value);
    }
    
    // this.crenauservice.addCrenau(this.crenauForm.value);

    const toastValid = this.toast.success('Crénau ajouter',
      {
        // dismissible: true,
        duration: 2500
      }
    );
    // toastValid.afterClosed.subscribe((e) => {
    //   this.router.navigate(['/planning']);
    // });
  }

  // ouvrir popup confirmation suppression du créneaux
  openDialogModal(crenau: Crenau) {
    const dialogRef = this.dialog.open(ModalDeleteCrenauComponent);
    dialogRef.componentInstance.confirmMessage = "Êtes-vous sûr de vouloir supprimer ce créneau ?"
    dialogRef.afterClosed().subscribe(result => {
      if(result == true) {
        this.crenauservice.deleteCrenau(crenau).then(() => 
          this.toast.success('Crénau supprimé',{duration: 2500})
        );
      }    
    });
  }

}