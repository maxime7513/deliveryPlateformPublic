import { Pipe, PipeTransform } from "@angular/core";
import { Console } from "console";
import { Crenau } from "src/app/models/crenau.model";

@Pipe({
    name: 'returnStatut',
    pure: true
})

export class ReturnStatutPipe implements PipeTransform {
  heures: number[] = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

  transform(value: Crenau[], arg1 : number, arg2 : number, arg3: string):any {
    return this.returnComplet(value, arg1, arg2, arg3);
  }

  returnComplet(crenaux: Crenau[], jour: number, heure: number, tranche: string){
    let res;

    for(let crenau of crenaux){
      let nombreCreneau = crenau.heureFin.value - crenau.heureDebut.value;
      // let datte = new Date('2022-06-16T15:00:00')
      if(jour == this.getDay(crenau.date)){
        for(let i = 0; i < nombreCreneau; i++){
          if(tranche == 'heure'){
            if(crenau.heureDebut.value % 1 == 0){
              if(this.heures[heure] == crenau.heureDebut.value + i && crenau.heureFin.value >= this.heures[heure + 1]){
                let dateFin = new Date(crenau.date.toDate().setHours(crenau.heureDebut.value + i + 1));
                if(120 < this.calculDifferenceDate(dateFin, new Date)){
                  res = "event_busy";
                }else if(this.calculDifferenceDate(dateFin, new Date) <= 0){
                  res = "assignment_turned_in";
                }else if(0 < this.calculDifferenceDate(dateFin, new Date) && this.calculDifferenceDate(dateFin, new Date) <= 60){
                  res = "hourglass_bottom";
                }
              }
            }
            else{
              if(this.heures[heure] == crenau.heureDebut.value + i + 0.5 && crenau.heureFin.value >= this.heures[heure + 1]){
                let dateFin = new Date(crenau.date.toDate().setHours(crenau.heureFin.value + i));
                dateFin.setMinutes(0);
                if(120 < this.calculDifferenceDate(dateFin, new Date)){
                  res = "event_busy";
                }else if(this.calculDifferenceDate(dateFin, new Date) <= 0){
                  res = "assignment_turned_in";
                }else if(0 < this.calculDifferenceDate(dateFin, new Date) && this.calculDifferenceDate(dateFin, new Date) <= 60){
                  res = "hourglass_bottom";
                }
              }
            }
          }
          if(tranche == '0/30'){
              if(this.heures[heure] + 0.5 == crenau.heureFin.value){
                let dateFin = new Date(crenau.date.toDate().setHours(crenau.heureFin.value));
                dateFin.setMinutes(30);
                if(150 < this.calculDifferenceDate(dateFin, new Date)){
                  res = "event_busy";
                }else if(this.calculDifferenceDate(dateFin, new Date) <= 0){
                  res = "assignment_turned_in";
                }else if(30 >= this.calculDifferenceDate(dateFin, new Date) && this.calculDifferenceDate(dateFin, new Date) > 0){
                  res = "hourglass_bottom";
                }
              }
          }
          if(tranche == '30/60'){
            if(this.heures[heure] + 0.5 == crenau.heureDebut.value){
              let dateFin = new Date(crenau.date.toDate().setHours(crenau.heureDebut.value));
              if(60 < this.calculDifferenceDate(dateFin, new Date)){
                res = "event_busy";
              }else if(this.calculDifferenceDate(dateFin, new Date) <= -30){
                res = "assignment_turned_in";
              }else if(-30 < this.calculDifferenceDate(dateFin, new Date) && this.calculDifferenceDate(dateFin, new Date) <= 0){
                res = "hourglass_bottom";
              }
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