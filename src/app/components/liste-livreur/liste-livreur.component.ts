import { Component, OnInit } from '@angular/core';
import { ProfileUser } from 'src/app/models/user.profil';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-liste-livreur',
  templateUrl: './liste-livreur.component.html',
  styleUrls: ['./liste-livreur.component.scss']
})
export class ListeLivreurComponent implements OnInit {

  users: ProfileUser[] = [];

  constructor(private userservice: UsersService) { }

  ngOnInit(): void {
    this.userservice.getUsers().subscribe((res: ProfileUser[]) => {
      this.users = res;
    })
  }

}
