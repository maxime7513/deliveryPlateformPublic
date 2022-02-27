import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { switchMap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';


interface Role {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})

export class SignUpComponent implements OnInit {
  
  signUpForm: FormGroup;
  signUpFormSend: boolean;
  roles: Role[] = [
    {value: 'livreur', viewValue: 'Livreur'},
    {value: 'woozoo', viewValue: 'WooZoo'},
    {value: 'rocket', viewValue: 'Rocket'},
  ];
  constructor(private authService: AuthService, private usersService: UsersService, private router: Router, private toast: HotToastService) { }

  ngOnInit(): void {
    this.signUpFormSend = false;
    this.validateform();
  }

  // init validator
  validateform() {
    this.signUpForm = new FormGroup(
      {
        lastName: new FormControl('', Validators.required),
        firstName: new FormControl('', Validators.required),
        phone: new FormControl('', Validators.required),
        email: new FormControl("", [Validators.required, Validators.email]),
        password: new FormControl("", [Validators.required, Validators.minLength(6)]),
        confirmPassword: new FormControl('', Validators.required),
        role: new FormControl('', Validators.required),
      },
      { validators: this.passwordsMatchValidator() 
      }
    );
  }
  
  passwordsMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;
  
      if (password && confirmPassword && password !== confirmPassword) {
        return { passwordsDontMatch: true };
      } else {
        return null;
      }
    };
  }

  // getter for mat-error
  get lastName() {
    return this.signUpForm.get('lastName');
  }
  get firstName() {
    return this.signUpForm.get('firstName');
  }
  get phone() {
    return this.signUpForm.get('phone');
  }
  get email() {
    return this.signUpForm.get('email');
  }
  get password() {
    return this.signUpForm.get('password');
  }
  get confirmPassword() {
    return this.signUpForm.get('confirmPassword');
  }
  get role() {
    return this.signUpForm.get('role');
  }

  submit() {
    this.toast.close();
    this.signUpFormSend = true;
    if (!this.signUpForm.valid) {
      this.toast.error('Formulaire invalide');
      return;
    }

    const {lastName, firstName, phone, email, password, role } = this.signUpForm.value;
    this.authService.signUp(email, password).pipe(
      switchMap(({ user: { uid }})=> 
        this.usersService.addUser({ uid, email, lastName, firstName, phone, role})
        ),
        this.toast.observe({
          success: 'Votre inscription est validée',
          loading: 'Inscription...',
          error: ({ message }) => `${message}`,
        })
      ).subscribe(() => {
        this.router.navigate(['/register']);
      });
  }
}
