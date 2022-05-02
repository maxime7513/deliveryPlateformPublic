import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ProfileUser } from 'src/app/models/user.profil';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-liste-livreur',
  templateUrl: './liste-livreur.component.html',
  styleUrls: ['./liste-livreur.component.scss']
})
export class ListeLivreurComponent implements OnInit {

  adminUsers: ProfileUser[] = [];
  livreurs: ProfileUser[] = [];
  lowValueSliceLivreur: number = 0;
  highValueSliceLivreur: number = 5;
  lowValueSliceAdmin: number = 0;
  highValueSliceAdmin: number = 5;
  showSpinner : boolean = true;

  constructor(private userservice: UsersService) {

   }

  ngOnInit(): void {
    this.userservice.getUsersByRole('livreur').subscribe((res: ProfileUser[]) => {
      this.livreurs = res;
      this.showSpinner = false;
    })

    this.userservice.getUsersAdmin().subscribe((res: ProfileUser[]) => {
      this.adminUsers = res;
    })
    
  }

  formatPhone(phone: string){
    return phone.replace(/(.{2})(?=.)/g,"$1 ")
  }

  // pagination
  public getPaginatorData(event: PageEvent, table: string): PageEvent {
    if(table == 'livreur'){
      this.lowValueSliceLivreur = event.pageIndex * event.pageSize;
      this.highValueSliceLivreur = this.lowValueSliceLivreur + event.pageSize;
      return event;
    }else{
      this.lowValueSliceAdmin = event.pageIndex * event.pageSize;
      this.highValueSliceAdmin = this.lowValueSliceAdmin + event.pageSize;
      return event;
    }
  }

}
