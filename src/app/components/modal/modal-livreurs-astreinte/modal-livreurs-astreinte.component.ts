import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ProfileUser } from 'src/app/models/user.profil';

@Component({
  selector: 'app-modal-livreurs-astreinte',
  templateUrl: './modal-livreurs-astreinte.component.html',
  styleUrls: ['./modal-livreurs-astreinte.component.scss']
})
export class ModalLivreursAstreinteComponent implements OnInit {

  users: ProfileUser[];

  constructor(public dialogRef: MatDialogRef<ModalLivreursAstreinteComponent>) { }

  ngOnInit(): void {
  }

  formatPhone(phone: string){
    return phone.replace(/(.{2})(?=.)/g,"$1 ")
  }

}
