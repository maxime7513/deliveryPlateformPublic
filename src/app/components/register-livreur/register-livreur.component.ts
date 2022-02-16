import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { Crenau } from 'src/app/models/crenau.model';
import { CrenauService } from 'src/app/services/crenau.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-register-livreur',
  templateUrl: './register-livreur.component.html',
  styleUrls: ['./register-livreur.component.scss']
})
export class RegisterLivreurComponent implements OnInit {

  user$ = this.usersService.currentUserProfile$;
  crenaux: Crenau[] = [];
  datePicker = new Date;
  defaultDatePicker: Date;

  constructor(private usersService: UsersService, private crenauservice: CrenauService, public datePipe : DatePipe, private toast: HotToastService) {
    this.defaultDatePicker = this.datePicker;
  }
  ngOnInit(): void {
    // tous les crenaux
    // this.crenauservice.getCrenaux().subscribe((res: Crenau[]) => {
    //   this.crenaux = res;
    // })

    // crenaux par date
    this.afficherCrenauParDate();
  }

  getPlaceRestante(inscritMax: number, inscrit: number){
    let calc = inscritMax - inscrit;
    return calc;
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


  inscriptionLivreur(crenau: Crenau, userUid: string){
    this.toast.close();
    this.crenauservice.addLivreur(crenau, userUid)
    // ajouter 1 au inscrit
    this.crenauservice.incrementInscrit(crenau)
    this.toast.success('Crénau reservé', {duration: 3000});
  }

  desinscriptionLivreur(crenau: Crenau, userUid: string){
    this.toast.close();
    this.crenauservice.removeLivreur(crenau, userUid)
    // retirer 1 au inscrit
    this.crenauservice.decrementInscrit(crenau)
    this.toast.success('Crénau retiré de votre planning', {duration: 3000});
  }

  verifierUserInscrit(crenau: Crenau, uid: string){
    if(crenau.users){
      return crenau.users.includes(uid)
    }else{
      return false
    }
  }

  // aj(id: string){
  //   return this.usersService.getUid(id);
  //   // console.log('object is '+ use)
  // }

  // petr(){
  //   console.log('go');
  //   return this.crenauservice.geti();
  // }


}

