import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  user$ = this.usersService.currentUserProfile$;
  
  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
  }

}
