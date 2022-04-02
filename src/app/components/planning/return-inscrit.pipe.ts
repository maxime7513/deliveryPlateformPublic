import { Pipe, PipeTransform } from "@angular/core";
import { Crenau } from "src/app/models/crenau.model";

@Pipe({
    name: 'returnInscrit',
    pure: true
})

export class ReturnInscritPipe implements PipeTransform {

  heures: number[] = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

  constructor(){}

  transform(value: Crenau[], arg1 : number, arg3: number): any{
    return this.returnInscrit(value, arg1, arg3);
  }

  getDay(day: any){
    var date = day.toDate();
    var day = date.getDay();
    return day
  }
  
  returnInscrit(crenaux: Crenau[], jour: number, heure: number){
    for(let crenau of crenaux){
        if(jour == this.getDay(crenau.date) && this.heures[heure] == crenau.heureDebut && crenau.inscrit > 0){
            return true
        }
    }
    return false
  }
  
}