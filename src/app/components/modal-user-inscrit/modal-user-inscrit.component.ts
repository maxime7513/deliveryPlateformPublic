import { Component, OnInit } from '@angular/core';
import { Crenau } from 'src/app/models/crenau.model';
import { ProfileUser } from 'src/app/models/user.profil';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-modal-user-inscrit',
  templateUrl: './modal-user-inscrit.component.html',
  styleUrls: ['./modal-user-inscrit.component.scss']
})
export class ModalUserInscritComponent implements OnInit {
  
  users: ProfileUser[];
  // crenau: Crenau;
  
  constructor() {}

  ngOnInit(): void {
    // this.userservice.getUserInscritByCrenau(this.crenau.id).subscribe((res: ProfileUser[]) => {
    //   this.users = res;
    // })
  }

  formatPhone(phone: string){
    return phone.replace(/(.{2})(?=.)/g,"$1 ")
  }
}
