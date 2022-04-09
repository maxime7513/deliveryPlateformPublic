import { Pipe, PipeTransform } from "@angular/core";
import { Crenau } from "src/app/models/crenau.model";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Pipe({
    name: 'returnMissionRB',
    pure: true
})

export class ReturnMissionRbPipe implements PipeTransform {

  heures: number[] = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

  constructor(){}

  transform(value: Crenau[], arg1 : number, arg2 : number):any {
    return this.returnMissionRB(value, arg1, arg2);
  }

  returnMissionRB(crenaux: Crenau[], jour: number, heure: number){
    let res;
    for(let crenau of crenaux){
      if(jour == this.getDay(crenau.date) && this.heures[heure] == crenau.heureDebut && crenau.societe == 'rosebaie'){
          res= "content_paste_search"
      }
    }
    return res
  }

  getDay(day: any){
    var date = day.toDate();
    var day = date.getDay();
    return day
  }
  
}