import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { User } from 'firebase/auth';
import { concatMap, switchMap } from 'rxjs';
import { ProfileUser } from 'src/app/models/user.profil';
import { AuthService } from 'src/app/services/auth.service';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { UsersService } from 'src/app/services/users.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TwilioService } from 'src/app/services/twilio.service';


@UntilDestroy()
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user$ = this.usersService.currentUserProfile$;
  userMail: string;
  profileForm: FormGroup;
  profileFormSend: boolean;
  vehiculeList: string[] = ['velo', 'scooter', 'voiture', 'camion'];

  constructor(private imageUploadService: ImageUploadService, private usersService: UsersService, private authService: AuthService, private toast: HotToastService,) { }

  ngOnInit(): void {
    this.profileFormSend = false;
    this.usersService.currentUserProfile$
      .pipe(untilDestroyed(this))
      .subscribe((user) => {
        this.profileForm.patchValue({ ...user });
    });
    
    // init formulaire
    this.validateform();
    
    this.usersService.currentUserProfile$.subscribe((res) => {
      this.userMail = res.email;
    })
  }

  // init validator
  validateform() {
    this.profileFormSend = true;

    this.profileForm = new FormGroup(
      {
        uid: new FormControl(''),
        firstName: new FormControl('', Validators.required),
        lastName: new FormControl('', Validators.required),
        phone: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        vehicule: new FormControl(' ', Validators.required),
      }
    );
  }

  // getter for mat-error
  get firstName() {
    return this.profileForm.get('firstName');
  }
  get lastName() {
    return this.profileForm.get('lastName');
  }
  get phone() {
    return this.profileForm.get('phone');
  }
  get email() {
    return this.profileForm.get('email');
  }
  get vehicule() {
    return this.profileForm.get('vehicule');
  }

  uploadImage(event: any, user: ProfileUser) {
    this.imageUploadService
      .uploadImage(event.target.files[0], `/images/profil/${user.uid}`)
      .pipe(
        this.toast.observe({
          loading: "T??l??chargement de l'image ...",
          success: 'Image de profil modifi?? avec succ??s',
          error: "Une erreur c'est produite lors du t??l??chargement",
        }),
        concatMap((photoURL) =>
          this.usersService.updateUser({ uid: user.uid, photoURL })
        )
      )
      .subscribe();
  }

  async saveProfile() {
    this.toast.close();
    if (!this.profileForm.valid) {
      this.toast.error('Formulaire invalide');
      return;
    }

    const profileData = this.profileForm.value;
    this.usersService
      .updateUser(profileData)
      .pipe(
        this.toast.observe({
          loading: 'Modification des informations ...',
          success: 'Mofidication du profil effectu??e',
          error: "Une erreur c'est produite",
        })
      )
      .subscribe();
      
      // changer email de connexion firebase
      // if(this.profileForm.value.email != this.userMail){
        this.authService.updateEmail(this.profileForm.value.email)
      // }
  }
  
  resetPassword(){
    this.authService.resetPassword(this.userMail);
  }
}
