import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  user$ = this.authService.currentUser$;
  
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

}
