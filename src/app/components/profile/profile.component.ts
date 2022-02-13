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

@UntilDestroy()
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user$ = this.usersService.currentUserProfile$;
  profileForm: FormGroup;
  
  constructor(private authService: AuthService, private imageUploadService: ImageUploadService, private usersService: UsersService, private toast: HotToastService,) { }

  ngOnInit(): void {
    this.usersService.currentUserProfile$
      .pipe(untilDestroyed(this))
      .subscribe((user) => {
        this.profileForm.patchValue({ ...user });
    });
    
    // init formulaire
    this.validateform();
  }

  // init validator
  validateform() {
    this.profileForm = new FormGroup(
      {
        uid: new FormControl(''),
        displayName: new FormControl("", Validators.required),
        firstName: new FormControl(""),
        lastName: new FormControl(''),
        phone: new FormControl(''),
      }
    );
  }

  get displayName() {
    return this.profileForm.get('displayName');
  }

  uploadImage(event: any, user: ProfileUser) {
    this.imageUploadService
      .uploadImage(event.target.files[0], `/images/profil/${user.uid}`)
      .pipe(
        this.toast.observe({
          loading: "Téléchargement de l'image ...",
          success: 'Image de profil modifié avec succès',
          error: "Une erreur c'est produite lors du téléchargement",
        }),
        concatMap((photoURL) =>
          this.usersService.updateUser({ uid: user.uid, photoURL })
        )
      )
      .subscribe();
  }

  saveProfile() {
    if (!this.profileForm.valid) {
      console.log('formulaire invalid');
      return;
    }

    const profileData = this.profileForm.value;
    this.usersService
      .updateUser(profileData)
      .pipe(
        this.toast.observe({
          loading: 'Modification des informations ...',
          success: 'Mofidication du profil effectuée',
          error: "Une erreur c'est produite",
        })
      )
      .subscribe();
  }

}
