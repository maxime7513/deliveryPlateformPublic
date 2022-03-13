import { Message } from 'src/app/models/message.model';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';
import { MatDialog } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-modal-message',
  templateUrl: './modal-message.component.html',
  styleUrls: ['./modal-message.component.scss']
})
export class ModalMessageComponent implements OnInit {

  message: Message;

  constructor(private messageService: MessageService, public dialog: MatDialog, private toast: HotToastService) { }

  ngOnInit(): void {
  }

  updateTraite(message: Message, el2: boolean){
    this.toast.close();
    this.messageService.updateTraiteMessage(message, el2);
    this.toast.success('Message enregistré comme traité');
  }

}
