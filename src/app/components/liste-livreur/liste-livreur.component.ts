import { Component, OnInit } from '@angular/core';
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

  constructor(private userservice: UsersService) { }

  ngOnInit(): void {
    this.userservice.getUsersByRole('livreur').subscribe((res: ProfileUser[]) => {
      this.livreurs = res;
    })

    this.userservice.getUsersAdmin().subscribe((res: ProfileUser[]) => {
      this.adminUsers = res;
    })
  }

  formatPhone(phone: string){
    return phone.replace(/(.{2})(?=.)/g,"$1 ")
  }

}
