import { Pipe, PipeTransform } from "@angular/core";
import { Crenau } from "src/app/models/crenau.model";

@Pipe({
    name: 'returnIcon',
    pure: true
})

export class ReturnIconPipe implements PipeTransform {
  heures: number[] = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

  transform(value: Crenau[], arg1 : number, arg2 : number, arg3: string):any {
    return this.returnIcon(value, arg1, arg2, arg3);
  }

  returnIcon(crenaux: Crenau[], jour: number, heure: number, tranche: string){
    let res;
    // let datte = new Date('2022-06-16T14:30:00')
    for(let crenau of crenaux){
      let dateFin = new Date(crenau.date.toDate().setHours(crenau.heureFin.value));
      if(crenau.heureFin.value % 1 != 0){
        dateFin.setMinutes(30)
      }else{
        dateFin.setMinutes(0)
      }
      
      if(tranche == 'heure'){
        if(jour == this.getDay(crenau.date) && this.heures[heure] == crenau.heureDebut.value ){          
          if(60 < this.calculDifferenceDate(crenau.date.toDate(), new Date)){
            res = "event_busy";
          }else if(this.calculDifferenceDate(dateFin, new Date) <= 0){
            res = "assignment_turned_in";
          }else if(0 >= this.calculDifferenceDate(crenau.date.toDate(), new Date) && this.calculDifferenceDate(dateFin, new Date) > 0){
            res = "hourglass_bottom";
          }
        } 
      }else{
        if(jour == this.getDay(crenau.date) && this.heures[heure] + 0.5 == crenau.heureDebut.value ){
          if(60 < this.calculDifferenceDate(crenau.date.toDate(), new Date)){
            res = "event_busy";
          }else if(this.calculDifferenceDate(dateFin, new Date) <= 0){
            res = "assignment_turned_in";
          }else if(0 >= this.calculDifferenceDate(crenau.date.toDate(), new Date) && this.calculDifferenceDate(dateFin,new Date) > 0){
            res = "hourglass_bottom";
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