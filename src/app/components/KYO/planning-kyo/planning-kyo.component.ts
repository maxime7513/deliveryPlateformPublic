import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { Crenau } from 'src/app/models/crenau.model';
import { ProfileUser } from 'src/app/models/user.profil';
import { AstreinteService } from 'src/app/services/astreinte.service';
import { CrenauService } from 'src/app/services/crenau.service';
import { TwilioService } from 'src/app/services/twilio.service';
import { UsersService } from 'src/app/services/users.service';
import { ModalLivreursAstreinteComponent } from '../../modal/modal-livreurs-astreinte/modal-livreurs-astreinte.component';

@Component({
  selector: 'app-planning-kyo',
  templateUrl: './planning-kyo.component.html',
  styleUrls: ['./planning-kyo.component.scss']
})
export class PlanningKYOComponent implements OnInit {

  crenaux: Crenau[] = [];
  astreintes: Crenau[] = [];
  datePicker = new Date;
  defaultDatePicker: Date;
  showSpinner : boolean = true;
  showSpinner2 : boolean = false;
  userRole: any;
  astreinteAffiche: Crenau[];

  constructor(private crenauservice: CrenauService, private astreinteservice: AstreinteService, private usersService: UsersService, private twilioService: TwilioService, public dialog: MatDialog, public datePipe : DatePipe, private toast: HotToastService) {
    this.defaultDatePicker = this.datePicker;
  }
  
  async ngOnInit(): Promise<void> {
    this.afficherCrenauParDate();
    this.userRole = await this.usersService.canAccess$;
    this.creneauNowAstreinte();
  }

  returnCrenauSuivant(crenau: Crenau){
    return new Promise<Crenau[]>(resolve => {
      this.crenauservice.getCrenauxByDate2(crenau.dateString, crenau.heureFin, 'kyo').subscribe(res => {
        resolve(res)
      })
    });
  }

  returnCrenauPrecedent(crenau: Crenau){
    return new Promise<Crenau[]>(resolve => {
      this.crenauservice.getCrenauxByDate3(crenau.dateString, crenau.heureDebut, 'kyo').subscribe(res => {
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
  
  // auto valider prise de service/fin de service si la date est dépassé et si le livreur à une course dans le créneau precedent/suivant
  autoValideFinService(){
    this.crenaux.map( creneau => {
      let dateDebutService = creneau.date.toDate(),
      dateFinService = new Date(creneau.date.toDate().setHours(creneau.heureFin));
      
      if(this.dateDebutDepasse(creneau)){
        creneau.users.map(async user => {
          if(await this.checkFinService(creneau, user.idUser, 'precedent') == false && await this.checkIfPrecedentPs(creneau, user.idUser) == true && !user.priseService){
            this.updateCreneauService(user.idUser, creneau, 'priseService', dateDebutService);
          }
        })
      }
      if(this.dateFinDepasse(creneau)){
        creneau.users.map(async user => {
          if(await this.checkFinService(creneau, user.idUser, 'suivant') == false && user.priseService && !user.finService){
            this.updateCreneauService(user.idUser, creneau, 'finService', dateFinService);
          }
        })
      }
    })
  }

  afficherCrenauParDate(){
    this.showSpinner = true; // loading
    let date = this.datePipe.transform(this.defaultDatePicker, 'dd/MM/yyyy');
    this.crenauservice.getCrenauxByDateandSociete("kyo", date).subscribe((res: Crenau[]) => {
      // trier par heure
      this.crenaux = res.sort(function (a:any, b:any) {
      return a.heureDebut - b.heureDebut
      });
      this.autoValideFinService();
      this.showSpinner = false; // loading
    })
    this.astreinteservice.getAstreinteByDateandSociete("kyo", date).subscribe((res: Crenau[]) => {
      // trier par heure
      this.astreintes = res.sort(function (a:any, b:any) {
      return a.heureDebut - b.heureDebut
      });
    })
  }

  getUserInscrit(userId: string){
    return new Promise(resolve => {
      this.usersService.getUserByID(userId).subscribe((res:any) => {
        resolve(res.crenauInscrit);
      })
    });
  }
  getUserAstreinteInscrit(userId: string){
    return new Promise(resolve => {
      this.usersService.getUserByID(userId).subscribe((res:any) => {
        resolve(res.astreinteInscrit);
      })
    });
  }

  getUsersCreneau(creneauId: string){
    return new Promise(resolve => {
      this.crenauservice.getCrenauByID(creneauId).subscribe((res:any) => {
        resolve(res.users);
      })
    });
  }

  getUsersAstreinte(astreinteId: string){
    return new Promise(resolve => {
      this.astreinteservice.getAstreinteByID(astreinteId).subscribe((res:any) => {
        resolve(res.users);
      })
    });
  }
  
  async updateCreneauService(userId: string, creneau: Crenau, choix: string, heure: any){
    this.showSpinner2 = true;
    // ajouter priseServiceKYO ou finServiceKYO à table user
    let tabCrenauInscrit: any = await this.getUserInscrit(userId);
    if(heure == 'now'){
      heure = new Date;
    }

    for(let creneauInscrit of tabCrenauInscrit){
      if(creneauInscrit.idCrenau === creneau.id){
        if(choix === 'priseService'){
          creneauInscrit.priseServiceKYO = heure;
        }else{
          creneauInscrit.finServiceKYO = heure;
        }
      }
    }
    this.usersService.updateCrenauInscrit(userId, tabCrenauInscrit);
    
    // ajouter priseService ou finService à table crenau
    let tabUsersCreneau: any = await this.getUsersCreneau(creneau.id);
    for(let users of tabUsersCreneau){
      if(users.idUser === userId){
        if(choix === 'priseService'){
          users.priseService = heure;
        }else{
          users.finService = heure;
        }
      }
    }
    this.crenauservice.updatePriseService(creneau.id, tabUsersCreneau).then(() => {
      if(choix == 'priseService'){
        this.toast.success('Prise de service validée')
      }else{
        this.toast.success('Fin de service validée')
      }
      setTimeout(() => {
        this.showSpinner2 = false;
      },1000)
    });
  }

  async updateAstreinteService(userId: string, astreinte: Crenau, choix: string){
    // ajouter priseServiceKYO ou finServiceKYO à table user
    let tabAstreinteInscrit: any = await this.getUserAstreinteInscrit(userId);
    for(let astreinteInscrit of tabAstreinteInscrit){
      if(astreinteInscrit.idCrenau === astreinte.id){
        if(choix === 'priseService'){
          astreinteInscrit.priseServiceKYO = new Date;
        }else{
          astreinteInscrit.finServiceKYO = new Date;
        }
      }
    }
    this.usersService.updateAstreinteInscrit(userId, tabAstreinteInscrit);
    
    // ajouter priseService ou finService à table astreinte
    let tabUsersAstreinte: any = await this.getUsersAstreinte(astreinte.id);
    for(let user of tabUsersAstreinte){
      if(user.idUser === userId){
        if(choix === 'priseService'){
          user.priseService = new Date;
        }else{
          user.finService = new Date;
        }
      }
    }
    this.astreinteservice.updatePriseService(astreinte.id, tabUsersAstreinte);
  }



  dateDebutDepasse(crenau: Crenau){
    let dateDebutService = crenau.date.toDate();
    if(new Date > dateDebutService){
      return true
    }else{
      return false
    }
  }

  dateFinDepasse(crenau: Crenau){
    let dateFinService = new Date(crenau.date.toDate().setHours(crenau.heureFin));
    if(new Date > dateFinService){
      return true
    }else{
      return false
    }
  }
  
  async callAstreinte(astreinte: Crenau, user: ProfileUser){
    for(let astreinteUser of astreinte.users){
      if(astreinteUser.idUser === user.uid){
        astreinteUser.call = true;
      }
    }
    this.astreinteservice.updateAstreinte(astreinte.id, astreinte.users);
    
    // envoyer sms au livreur
    let phoneFormat = user.phone.replace(/ /g, ""); // supprimer tous les espaces      
    if(phoneFormat.indexOf("+330") == 0){ // enlever +330 ou +33 phone expediteur
      phoneFormat = phoneFormat.substring(4);
    }else if(phoneFormat.indexOf("+33") == 0){
      phoneFormat = phoneFormat.substring(3);
    }
    phoneFormat = '+33' + phoneFormat;
    let req = {
      nom: user.firstName,
      phone: phoneFormat,
      role: astreinte.societe
    }

    this.twilioService.send_smsAstreinte(req);

    this.toast.success("Livreur appelé en renfort")
  }

  // ouvrir popup avec livreur disponible en astreinte
  async openDialogModal() {
    this.toast.loading('Chargement');

    if(this.astreinteAffiche.length == 0){
      this.toast.close();
      this.toast.error('Aucun livreur de disponible pour cette horaire')
      return
    }
    const users = await this.usersAstreinte(this.astreinteAffiche[0]);
    this.toast.close()
    const dialogRef = this.dialog.open(ModalLivreursAstreinteComponent);
    dialogRef.componentInstance.users = users;

    dialogRef.afterClosed().subscribe(result => {
      if(result != ''){
        this.callAstreinte(this.astreinteAffiche[0], result)
      }
    });
  }

  // return usersAstreinte(Promise pour attendre les données users avant d'ouvrir la popup)
  usersAstreinte(astreinte: Crenau){
    return new Promise<ProfileUser[]>(resolve => {
      let usersAstreinte: any[] = [];
      astreinte.users.map((element: any)=>{
        if(!element.call){
          usersAstreinte.push(element.idUser)
        }
      });
      let tab: any[] = [];
      for(let user of usersAstreinte){
        this.usersService.getUserByID(user).subscribe((res) => {
          tab.push(res)
        })
      }
      resolve(tab)
    });
  }

  creneauNowAstreinte(){
    let dateNow = new Date;
    let hourDateNow = dateNow.getHours();
    let dayDateNow = dateNow.getDate();
    let monthDateNow = (dateNow.getMonth() + 1).toString();
    let yearDateNow = dateNow.getFullYear();
    if(monthDateNow.length < 2){
      monthDateNow = "0" + monthDateNow;
    }
    let dateString =  dayDateNow + '/' + monthDateNow + '/' + yearDateNow;
    let dateTest = '03/06/2022'
    let heureTest = 12
    this.astreinteservice.getAstreintesByDate2(dateString, hourDateNow, this.userRole).subscribe((res: Crenau[]) => {
    // this.astreinteservice.getAstreintesByDate2(dateTest, heureTest, this.userRole).subscribe((res: Crenau[]) => {
      this.astreinteAffiche = res;
    })
  }

}
