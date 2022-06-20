import { Pipe, PipeTransform } from "@angular/core";
import { Crenau } from "src/app/models/crenau.model";
import { CrenauService } from "src/app/services/crenau.service";

@Pipe({
    name: 'checkPrecedentPs',
    pure: true
})

export class CheckPrecedentPriseServicePipe implements PipeTransform {
  
  constructor(private crenauService: CrenauService){}

  transform(value: Crenau, arg1: string):any {
    return this.checkIfPrecedentPs(value, arg1);
  }

  returnCrenauPrecedent(crenau: Crenau){
    return new Promise<Crenau[]>(resolve => {
      this.crenauService.getCrenauxByDate3(crenau.dateString, crenau.heureDebut.value, 'kyoSushi').subscribe(res => {
        resolve(res)
      })
    });
  }

  // checker si la prise de service à eu lieu sur le créneau précédent
  async checkIfPrecedentPs(crenau: Crenau, userId: string){
    let creneauPrecedent = await this.returnCrenauPrecedent(crenau),
    res;
    if(creneauPrecedent.length != 0){
      creneauPrecedent.map(creneau => {
        let dateFinCreneauPrecedent = new Date(creneau.date.toDate().setHours(creneau.heureFin.value));
        if(creneau.heureFin.value % 1 != 0){
          dateFinCreneauPrecedent.setMinutes(30)
        }else{
          dateFinCreneauPrecedent.setMinutes(0)
        }
        
      for(let user of creneau.users){
        if(userId == user.idUser && (user.priseService || new Date <= dateFinCreneauPrecedent)){
        // if(userId == user.idUser){
          res = true
          break
        }else{
          res = false
        }
      }
    })
    return res
    }else{
      return false
    }
  }

}