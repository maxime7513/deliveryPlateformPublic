import { Pipe, PipeTransform } from "@angular/core";
import { Crenau } from "src/app/models/crenau.model";

@Pipe({
    name: 'returnPlanning',
    pure: true
})

export class ReturnPlanningPipe implements PipeTransform {

  heures: number[] = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

  constructor(){}

  transform(value: Crenau[], arg1 : number, arg3: number): any{
    return this.returnPlanning(value, arg1, arg3);
  }

  getDay(day: any){
    var date = day.toDate();
    var day = date.getDay();
    return day
  }
  
  returnPlanning(crenaux: Crenau[], jour: number, heure: number){
    let res;
    for(let crenau of crenaux){
      if(jour == this.getDay(crenau.date) && this.heures[heure] == crenau.heureDebut ){
        res = crenau.inscrit + "/" + crenau.inscritMax;
      }
    }
    return res
  }
  
}