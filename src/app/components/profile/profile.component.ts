import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { User } from 'firebase/auth';
import { concatMap, switchMap } from 'rxjs';
import { ProfileUser } from 'src/app/models/user.profil';
import { AuthService } from 'src/app/services/auth.service';
import { ImageUploadService } from 'src/app/services/image-upload.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user$ = this.authService.currentUser$;

  constructor(private authService: AuthService, private imageUploadService: ImageUploadService, private toast: HotToastService,) { }

  ngOnInit(): void {
  }

  uploadImage(event: any, user: User) {
    this.imageUploadService
      .uploadImage(event.target.files[0], `/images/profil/${user.uid}`)
      .pipe(
        this.toast.observe({
          loading: "Téléchargement de l'image ...",
          success: 'Image de profil modifié avec succès',
          error: "Une erreur c'est produite lors du téléchargement",
        }),
        concatMap((photoURL) =>
          this.authService.updateProfileData({ photoURL })
        )
      )
      .subscribe();
  }

}
