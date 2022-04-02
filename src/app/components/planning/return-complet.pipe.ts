import { Pipe, PipeTransform } from "@angular/core";
import { Crenau } from "src/app/models/crenau.model";

@Pipe({
    name: 'returnComplet',
    pure: true
})

export class ReturnCompletPipe implements PipeTransform {

  heures: number[] = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

  constructor(){}

  transform(value: Crenau[], arg1 : number, arg3: number): any{
    return this.returnComplet(value, arg1, arg3);
  }

  getDay(day: any){
    var date = day.toDate();
    var day = date.getDay();
    return day
  }
  
  returnComplet(crenaux: Crenau[], jour: number, heure: number){
    for(let crenau of crenaux){
      let nombreCreneau = crenau.heureFin - crenau.heureDebut;
      
      if(jour == this.getDay(crenau.date)){
        if(nombreCreneau == 1){
          if(this.heures[heure] == crenau.heureDebut ){
            if(crenau.inscritMax - crenau.inscrit == 0){
              return true
            }
          }
        }else{
          for(let i = 0; i < nombreCreneau; i++){
            if(this.heures[heure] == crenau.heureDebut + i ){
              if(crenau.inscritMax - crenau.inscrit == 0){
                return true
              }
            }
          }
        }
      }
    }
    return false
  }
  
}