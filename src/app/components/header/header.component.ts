import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { MessageService } from 'src/app/services/message.service';
import { Message } from 'src/app/models/message.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user$ = this.usersService.currentUserProfile$;
  nombreMessageNonLu: number;

  constructor( public authService: AuthService, private router: Router, private usersService: UsersService, private messageService: MessageService) {}

  async ngOnInit(): Promise<void> {
    // retourner message non lu
    this.returnNombreMessagesNonLu();
  }

  returnNombreMessagesNonLu(){
    this.messageService.getMessagesNonLu().subscribe((res: Message[]) => {
      this.nombreMessageNonLu = res.length;
    });
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }

}
