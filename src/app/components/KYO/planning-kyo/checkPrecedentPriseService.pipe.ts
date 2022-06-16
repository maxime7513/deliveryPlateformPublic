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
      this.crenauService.getCrenauxByDate3(crenau.dateString, crenau.heureDebut.value, 'kyo').subscribe(res => {
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
      for(let user of creneau.users){
        if(userId == user.idUser && user.priseService){
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