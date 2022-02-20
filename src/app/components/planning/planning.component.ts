import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Crenau } from 'src/app/models/crenau.model';
import { ProfileUser } from 'src/app/models/user.profil';
import { CrenauService } from 'src/app/services/crenau.service';
import {MatDialog} from '@angular/material/dialog';
import { UsersService } from 'src/app/services/users.service';
import { ModalUserInscritComponent } from '../modal-user-inscrit/modal-user-inscrit.component';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})
export class PlanningComponent implements OnInit {

  crenaux: Crenau[] = [];
  datePicker = new Date;
  defaultDatePicker: Date;
  getScreenWidth: any;
  valeurSlice: number;
  valeurSlice2: number;
  responsive: string;

  constructor(private crenauservice: CrenauService, public datePipe : DatePipe, public dialog: MatDialog) {
    this.getScreenWidth = window.innerWidth;
    console.log(this.getScreenWidth );
    this.defaultDatePicker = this.datePicker;
  }

  ngOnInit(): void {
    // responsive table
    if(this.getScreenWidth < 760){
      this.responsive = "petit";
      this.valeurSlice = 4;
      this.valeurSlice2 = 8;
    }else if(this.getScreenWidth < 1400){
      this.responsive = "moyen";
      this.valeurSlice = 6;
      this.valeurSlice2 = 12;
    }else {
      this.responsive = "grand";
      this.valeurSlice = 12;
    }
    // this.crenauservice.getCrenaux().subscribe((res: Crenau[]) => {
    //   this.crenaux = res;
    // })

    // crenaux par date
    this.afficherCrenauParDate();
  }

  // crenaux par date (datepicker)
  afficherCrenauParDate(){
    let date = this.datePipe.transform(this.defaultDatePicker, 'dd/MM/yyyy');
    this.crenauservice.getCrenauxByDate(date).subscribe((res: Crenau[]) => {
      // this.crenaux = res;
      // trier par heure
      this.crenaux = res.sort(function (a:any, b:any) {
      return a.heureDebut - b.heureDebut
      });
    })
  }

  // ouvrir popup avec livreur pour chaque créneaux
  openDialogModal(crenau: Crenau) {
    const activeModal = this.dialog.open(ModalUserInscritComponent);
    activeModal.componentInstance.crenau = crenau;
  }

}