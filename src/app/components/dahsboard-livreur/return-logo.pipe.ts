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

  transform(value: Crenau[], arg1 : number, arg2 : number, arg3: string):any {
    return this.returnLogo(value, arg1, arg2, arg3);
  }

  returnLogo(crenaux: Crenau[], jour: number, heure: number, tranche: string){
    let res: SafeHtml;
    let imageAstreinte = "";

    for(let crenau of crenaux){
      let nombreCreneau = crenau.heureFin.value - crenau.heureDebut.value;

      if(crenau.typeMission == 'astreinte'){
        imageAstreinte = `<img class="astreinte" src="/assets/images/astreinte.png">`
      }

      if(jour == this.getDay(crenau.date)){
        for(let i = 0; i < nombreCreneau; i++){
          if(tranche == 'heure'){
            if(crenau.heureDebut.value % 1 == 0){
              if(this.heures[heure] == crenau.heureDebut.value + i && crenau.heureFin.value >= this.heures[heure + 1]){
                res = this.sanitizer.bypassSecurityTrustHtml(
                  `<img src="/assets/images/icone_`+ crenau.societe +`.png">` + imageAstreinte
                );
              }
            }
            else{
              if(this.heures[heure] == crenau.heureDebut.value + i + 0.5 && crenau.heureFin.value >= this.heures[heure + 1]){
                res = this.sanitizer.bypassSecurityTrustHtml(
                  `<img src="/assets/images/icone_`+ crenau.societe +`.png">` + imageAstreinte
                );
              }
            }
          }
          if(tranche == '0/30'){
              if(this.heures[heure] + 0.5 == crenau.heureFin.value){
                res = this.sanitizer.bypassSecurityTrustHtml(
                  `<div class="dashed_bas"><img src="/assets/images/icone_`+ crenau.societe +`.png">` + imageAstreinte + `</div>`
                );
              }
          }
          if(tranche == '30/60'){
              if(this.heures[heure] + 0.5 == crenau.heureDebut.value){
                res = this.sanitizer.bypassSecurityTrustHtml(
                  `<div class="dashed_haut"><img src="/assets/images/icone_`+ crenau.societe +`.png">` + imageAstreinte + `</div>`
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