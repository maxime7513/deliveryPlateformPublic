import { Pipe, PipeTransform } from "@angular/core";
import { Crenau } from "src/app/models/crenau.model";

@Pipe({
    name: 'returnIcon',
    pure: true
})

export class ReturnIconPipe implements PipeTransform {
  heures: number[] = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

  transform(value: Crenau[], arg1 : number, arg2 : number):any {
    return this.returnIcon(value, arg1, arg2);
  }

  returnIcon(crenaux: Crenau[], jour: number, heure: number){
    let res;
    for(let i = 0; i < crenaux.length; i++){
      if(jour == this.getDay(crenaux[i].date) && this.heures[heure] == crenaux[i].heureDebut ){
        if(60 < this.calculDifferenceDate(crenaux[i].date.toDate(), new Date)){
          res = "event_busy";
        }else if(this.calculDifferenceDate(crenaux[i].date.toDate(), new Date) <= -60){
          res = "assignment_turned_in";
        }else if(-60 < this.calculDifferenceDate(crenaux[i].date.toDate(), new Date) && this.calculDifferenceDate(crenaux[i].date.toDate(), new Date) <= 0){
          res = "hourglass_bottom";
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