import { Pipe, PipeTransform } from "@angular/core";
import { Crenau } from "src/app/models/crenau.model";

@Pipe({
    name: 'returnCompletLivreur',
    pure: true
})

export class ReturnCompletLivreurPipe implements PipeTransform {
  heures: number[] = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

  transform(value: Crenau[], arg1 : number, arg2 : number):any {
    return this.returnComplet(value, arg1, arg2);
  }

  returnComplet(crenaux: Crenau[], jour: number, heure: number){
    let res;
    for(let crenau of crenaux){
      let nombreCreneau = crenau.heureFin - crenau.heureDebut;

      if(crenau.societe != 'rosebaie'){
        if(jour == this.getDay(crenau.date) && this.heures[heure] == crenau.heureDebut ){
          if(60 < this.calculDifferenceDate(crenau.date.toDate(), new Date)){
            res = "event_busy";
          }else if(this.calculDifferenceDate(crenau.date.toDate(), new Date) <= -60){
            res = "assignment_turned_in";
          }else if(-60 < this.calculDifferenceDate(crenau.date.toDate(), new Date) && this.calculDifferenceDate(crenau.date.toDate(), new Date) <= 0){
            res = "hourglass_bottom";
          }
        }
      }else{
        for(let i = 0; i < nombreCreneau; i++){
          if(jour == this.getDay(crenau.date) && this.heures[heure] == crenau.heureDebut + i){
            if(60 < this.calculDifferenceDate(crenau.date.toDate(), new Date)){
              res = "event_busy";
            }else if(this.calculDifferenceDate(crenau.date.toDate(), new Date) <= -60){
              res = "assignment_turned_in";
            }else if(-60 < this.calculDifferenceDate(crenau.date.toDate(), new Date) && this.calculDifferenceDate(crenau.date.toDate(), new Date) <= 0){
              res = "hourglass_bottom";
            }
          }
        }
      }
    }
    return res
  }

  getDay(day: any){
    var date = day.toDate();
    var day = date.getDay();
    return day
  }
  
  calculDifferenceDate(date1: any, date2: any){
    var diff_temps = date1.getTime() - date2.getTime();
    var diff_hour = diff_temps / (1000 * 3600 / 60);
    return Math.round(diff_hour);
  }

}