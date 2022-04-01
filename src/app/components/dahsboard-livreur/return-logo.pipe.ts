import { Pipe, PipeTransform } from "@angular/core";
import { Crenau } from "src/app/models/crenau.model";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Pipe({
    name: 'returnLogo',
    pure: true
})

export class ReturnLogoPipe implements PipeTransform {

  heures: number[] = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

  constructor(private sanitizer: DomSanitizer){}

  transform(value: Crenau[], arg1 : number, arg2 : number):any {
    return this.returnLogo(value, arg1, arg2);
  }

  returnLogo(crenaux: Crenau[], jour: number, heure: number){
    let res: SafeHtml;
    for(let i = 0; i < crenaux.length; i++){
      let nombreCreneau = crenaux[i].heureFin - crenaux[i].heureDebut;
      let heureDebut = crenaux[i].heureDebut;
      let societe = crenaux[i].societe;

      if(jour == this.getDay(crenaux[i].date)){
        if(nombreCreneau == 1){
          if(this.heures[heure] == crenaux[i].heureDebut){
            res = this.sanitizer.bypassSecurityTrustHtml(
              `<img class="logo_societe" src="/assets/images/icone_`+ crenaux[i].societe +`.png">`
            );
          }
        }else{
          for(let i = 0; i < nombreCreneau; i++){
            if(this.heures[heure] == heureDebut + i){
              res = this.sanitizer.bypassSecurityTrustHtml(
                `<img class="logo_societe" src="/assets/images/icone_`+ societe +`.png">`
              );
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