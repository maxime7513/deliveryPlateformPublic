import { Pipe, PipeTransform } from "@angular/core";
import { Crenau } from "src/app/models/crenau.model";
import { CrenauService } from "src/app/services/crenau.service";

@Pipe({
    name: 'checkFinService',
    pure: true
})

export class CheckFinServicePipe implements PipeTransform {
  
  constructor(private crenauService: CrenauService){}

  transform(value: Crenau, arg1: string, arg2: string):any {
    return this.checkFinService(value, arg1, arg2);
  }

  returnCrenauSuivant(crenau: Crenau){
    return new Promise<Crenau[]>(resolve => {
      this.crenauService.getCrenauxByDate2(crenau.dateString, crenau.heureFin.value, 'kyo').subscribe(res => {
        resolve(res)
      })
    });
  }

  returnCrenauPrecedent(crenau: Crenau){
    return new Promise<Crenau[]>(resolve => {
      this.crenauService.getCrenauxByDate3(crenau.dateString, crenau.heureDebut.value, 'kyo').subscribe(res => {
        resolve(res)
      })
    });
  }

  // checker si le livreur à plusieurs créneaux d'affilés
  async checkFinService(crenau: Crenau, userId: any, choix: string){
    let res,
    creneauSuivant;
    if(choix == 'suivant'){
      creneauSuivant = await this.returnCrenauSuivant(crenau);
    }else{
      creneauSuivant = await this.returnCrenauPrecedent(crenau);
    }

    if(creneauSuivant.length != 0){
      creneauSuivant.map(creneau => {
      for(let user of creneau.users){
        if(userId == user.idUser){
          res = false
          break
        }else{
          res = true
        }
      }
    })
    return res
    }else{
      return true
    }
  }

}