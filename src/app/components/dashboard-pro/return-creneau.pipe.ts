import { Pipe, PipeTransform } from "@angular/core";
import { Crenau } from "src/app/models/crenau.model";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Pipe({
    name: 'returnCreneau',
    pure: true
})

export class ReturnCreneauPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer){ }

  transform(value: Crenau, arg1 : number, arg2: string):any {
    return this.returnCreneau(value, arg1, arg2);
  }

  returnCreneau(creneau: Crenau, jour: number, choix: string){
    let valeurAffiche;
    let res: SafeHtml;
      if(jour == this.getDay(creneau.date)){
        if(choix == 'date'){
            valeurAffiche = `<p>`+ creneau.dateString + `</p>`;
        }else if(choix == 'horaire'){
            valeurAffiche = `<p>`+ creneau.heureDebut.viewValue + '<span> &#10141; </span>' + creneau.heureFin.viewValue + `</p>`;
        }else if(choix == 'inscrit'){
          let classImg = "";
          if(!creneau.users){
            classImg = 'aucun_inscrit';
          }
          
          valeurAffiche = `<img class="`+ classImg +`" src="/assets/images/person_search.svg">`;
        }else if(choix == 'etat'){
          let dateFin = new Date(creneau.date.toDate().setHours(creneau.heureFin.value));
          if(creneau.heureFin.value % 1 != 0){
            dateFin.setMinutes(30)
          }else{
            dateFin.setMinutes(0)
          }

          if(60 <= this.calculDifferenceDate(creneau.date.toDate(), new Date)){
            valeurAffiche = `<img class="event_busy" src="/assets/images/event_busy.svg">`;
          }else if(this.calculDifferenceDate(dateFin, new Date) < 0){
            valeurAffiche = `<img src="/assets/images/assignment_turned_in.svg">`;
          }else if(0 >= this.calculDifferenceDate(creneau.date.toDate(), new Date) && this.calculDifferenceDate(dateFin, new Date) >= 0){
            valeurAffiche = `<img src="/assets/images/hourglass_bottom.svg">`;
          }else if(this.calculDifferenceDate(creneau.date.toDate(), new Date) < 60 && this.calculDifferenceDate(creneau.date.toDate(), new Date) > 0){
            valeurAffiche = `<p class="minutes_restantes"><span>`+ this.calculDifferenceDate(creneau.date.toDate(), new Date) + `</span>min</p>`;
          }
        }
        res = this.sanitizer.bypassSecurityTrustHtml(
          valeurAffiche
        );
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