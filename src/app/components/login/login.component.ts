import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  loginForm: FormGroup;
  loginFormSend: boolean;
  constructor(private authService: AuthService, private router: Router, private toast: HotToastService) { }

  ngOnInit(): void {
    this.validateform();
    this.loginFormSend = false;
  }

  // init validator
  validateform() {
    this.loginForm = new FormGroup(
      {
        email: new FormControl("", [Validators.required, Validators.email]),
        password: new FormControl("", [Validators.required, Validators.minLength(6)]),
      });
  }

  submit() {
    this.toast.close();
    this.loginFormSend = true;
    if (!this.loginForm.valid) {
      this.toast.error('Formulaire invalide');
      return;
    }

    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).pipe(
      this.toast.observe({
        success: 'Connexion réussie',
        loading: 'Connexion...',
        error: ({ message }) => `There was an error: ${message} `
      })
    ).subscribe(() => {
      this.router.navigate(['/register']);
    });

  }

  // getter for mat-error
  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

}
