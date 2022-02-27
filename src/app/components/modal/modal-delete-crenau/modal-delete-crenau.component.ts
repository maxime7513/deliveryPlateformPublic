import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-delete-crenau',
  templateUrl: './modal-delete-crenau.component.html',
  styleUrls: ['./modal-delete-crenau.component.scss']
})
export class ModalDeleteCrenauComponent implements OnInit {

  confirmMessage: string;

  constructor(public dialogRef: MatDialogRef<ModalDeleteCrenauComponent>) { }

  ngOnInit(): void {
  }

}
