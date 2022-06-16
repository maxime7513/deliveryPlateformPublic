import { Pipe, PipeTransform } from "@angular/core";
import { Crenau } from "src/app/models/crenau.model";

@Pipe({
    name: 'totalHeureLivreurs',
    pure: true
})

export class TotalHeureLivreursPipe implements PipeTransform {
  
  constructor(){}

  transform(value: Crenau[], arg1 : string):any {
    return this.calculHeureTotal(value, arg1);
  }

  getDay(day: any){
    var date = day.toDate();
    var day = date.getDay();
    return day
  }

  calculHeureTotal(crenaux: Crenau[], userId: string){
    let x = 0;
    let res;
    for(let crenau of crenaux){
        // if(jour == this.getDay(crenau.date)){
          if(crenau.users){
            crenau.users.map(user => {
              if(user.idUser == userId){
                if(user.priseService && user.finService){
                  let diffDate = this.getDiffDate(user.finService.toDate(), user.priseService.toDate());
                  let diffDateminutes = diffDate/60000;
                  x += diffDateminutes;
                  let hourDiff = Math.floor(x / 60);
                  let minRestante = Math.floor(x) % 60;
                  if(minRestante < 10){
                    res = hourDiff + 'h0'+ minRestante
                  }else{
                    res = hourDiff + 'h' + minRestante;
                  }
                }
              }
            })
          }
        // }
    }
    return res
  }

  getDiffDate(date1:any, date2:any){
    let dateOne = date1.getTime();
    let dateTwo = date2.getTime();
    return dateOne - dateTwo
  }

}