import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Crenau } from 'src/app/models/crenau.model';
import { CrenauService } from 'src/app/services/crenau.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-heures-livreurs',
  templateUrl: './heures-livreurs.component.html',
  styleUrls: ['./heures-livreurs.component.scss']
})
export class HeuresLivreursComponent implements OnInit {

  crenaux: Crenau[] = [];
  defaultDatePicker: Date;
  jours: number[]= [1, 2, 3, 4, 5, 6, 0];
  livreursSemaine: any[]= [];
  joursSemaine: string[]= [];
  showSpinner : boolean = true;

  constructor(private crenauService: CrenauService, private usersService: UsersService, public datePipe : DatePipe) { 
    this.defaultDatePicker = new Date;
  }

  async ngOnInit(): Promise<void> {
    this.newPlanning();
    this.defaultDatePicker = new Date;
  }

  // retourner le lundi de chaque semaine séléctionnée(datepicker)
  setToMonday(date: Date) {
    var day = date.getDay() || 7;
    if( day !== 1 )
    date.setHours(-24 * (day - 1));
    return date;
  }

  createSemaineTab(date: Date){
    let currentDateString = this.datePipe.transform(date, 'dd/MM/yyyy');
    let tab = [currentDateString];
    for(let i = 0; i < 6; i++){
      date.setHours(+24);
      let dateString = this.datePipe.transform(date, 'dd/MM/yyyy');
      tab.push(dateString);
    }
    return tab
  }

  joursSemaineAffiche(){
    let dateLundi = this.setToMonday(this.defaultDatePicker);
    let tab = this.createSemaineTab(dateLundi);

    tab.forEach(function(jour, index) {
      tab[index] = jour.substring(0, jour.length - 5);;
    });

    this.joursSemaine = tab;
  }

  // crenaux par semaine (datepicker)
  async afficherCrenauParSemaine(){
    return new Promise(resolve => {
      let dateLundi = this.setToMonday(this.defaultDatePicker);
      let tab = this.createSemaineTab(dateLundi);
      this.crenauService.getCrenauxBySemaineAndSociete('kyo',tab).subscribe((res: Crenau[]) => {
        resolve(this.crenaux = res);
        this.tabUsersParSemaine();
        this.joursSemaineAffiche();
      })
    })
  }

  tabUsersParSemaine(){
    this.crenaux.map(creneau => {
      creneau.users.map(user => {
        if(!this.livreursSemaine.includes(user.idUser) && user.finService){
          this.livreursSemaine.push(user.idUser)
        }      
      })
    })
  }

  async newPlanning(){
    this.showSpinner = true;
    this.livreursSemaine = [];
    await this.afficherCrenauParSemaine();
    this.showSpinner = false;
  }
}
