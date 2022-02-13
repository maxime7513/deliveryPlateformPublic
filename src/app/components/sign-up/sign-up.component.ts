import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { switchMap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';



@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})

export class SignUpComponent implements OnInit {
  
  signUpForm: FormGroup;
  
  constructor(private authService: AuthService, private usersService: UsersService, private router: Router, private toast: HotToastService) { }

  ngOnInit(): void {
    this.validateform();
  }

  // init validator
  validateform() {
    this.signUpForm = new FormGroup(
      {
        name: new FormControl('', Validators.required),
        email: new FormControl("", [Validators.required, Validators.email]),
        password: new FormControl("", [Validators.required, Validators.minLength(6)]),
        confirmPassword: new FormControl('', Validators.required),
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

  // getter
  get name() {
    return this.signUpForm.get('name');
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

  submit() {
    if (!this.signUpForm.valid) {
      console.log('formulaire invalid');
      return;
    }

    const {name, email, password } = this.signUpForm.value;
    this.authService.signUp(email, password).pipe(
      switchMap(({ user: { uid }})=> 
        this.usersService.addUser({ uid, email, displayName: name})
        ),
        this.toast.observe({
          success: 'Congrats! You are all signed up',
          loading: 'Signing up...',
          error: ({ message }) => `${message}`,
        })
      ).subscribe(() => {
        this.router.navigate(['/register']);
      });
  }
}
