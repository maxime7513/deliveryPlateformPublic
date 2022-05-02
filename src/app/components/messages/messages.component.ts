import { Message } from 'src/app/models/message.model';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';
import { HotToastService } from '@ngneat/hot-toast';
import { MatDialog } from '@angular/material/dialog';
import { ModalMessageComponent } from '../modal/modal-message/modal-message.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  messages: Message[] = [];
  lowValueSlice: number = 0;
  highValueSlice: number = 10;
  nombreMessageNonLu : number;
  showSpinner : boolean = true;

  constructor(private messageService: MessageService, public dialog: MatDialog, private toast: HotToastService) { }

  ngOnInit(): void {
    this.messageService.getMessages().subscribe((res: Message[]) => {
      this.messages = res;
      this.showSpinner = false;
    })

    // retourner message non lu
    this.messageService.getMessagesNonLu().subscribe((res: Message[]) => {
      this.nombreMessageNonLu = res.length;
    })
  }

  // ouvrir popup message
  openDialogModal(message: Message) {
    this.toast.loading('Chargement');

    this.toast.close();

    const dialogRef = this.dialog.open(ModalMessageComponent);
    dialogRef.componentInstance.message = message;
    
    if(!message.lu){ // si message non lu marque comme lu
      this.updateLu(message, true);
    }
  }

  updateLu(message: Message, el2: boolean){
    this.messageService.updateLuMessage(message, el2);
  }

  deleteMessage(message: Message){
    this.toast.close();
    this.messageService.deleteMessage(message);
    this.toast.success('Message supprimé');
  }

  // pagination
  public getPaginatorData(event: PageEvent): PageEvent {
      this.lowValueSlice = event.pageIndex * event.pageSize;
      this.highValueSlice = this.lowValueSlice + event.pageSize;
      return event;
  }

}
