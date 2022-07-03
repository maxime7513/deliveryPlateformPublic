import { Component, OnInit } from '@angular/core';
import { ProfileUser } from 'src/app/models/user.profil';

@Component({
  selector: 'app-modal-user-inscrit',
  templateUrl: './modal-user-inscrit.component.html',
  styleUrls: ['./modal-user-inscrit.component.scss']
})
export class ModalUserInscritComponent implements OnInit {
  
  users: ProfileUser[];
  date: any;
  heureDebut: string;
  heureFin: string;
  
  constructor() {}

  ngOnInit(): void { }

  formatPhone(phone: string){
    return phone.replace(/(.{2})(?=.)/g,"$1 ")
  }
}
