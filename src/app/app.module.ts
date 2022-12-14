import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
// heure en francais
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

// google maps
import {} from 'googlemaps'; 

// Module
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker'; 
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio'; 
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HotToastModule } from '@ngneat/hot-toast';
import { HttpClientModule } from '@angular/common/http';
import { MatPaginatorModule } from '@angular/material/paginator'; 
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { MatAutocompleteModule } from '@angular/material/autocomplete';

// 
import { ModalCreateAdresseComponent } from './components/modal/modal-create-adresse/modal-create-adresse.component';
import { RosebaieLivraisonComponent } from './components/rosebaie/rosebaie-livraison/rosebaie-livraison.component';
import { ModalRbValiderLivraisonComponent } from './components/modal/modal-rb-valider-livraison/modal-rb-valider-livraison.component';
import { ModalIncidentMissionComponent } from './components/modal/modal-incident-mission/modal-incident-mission.component';
import { ListeBonLivraisonComponent } from './components/rosebaie/liste-bon-livraison/liste-bon-livraison.component';
import { ModalUserInscritComponent } from './components/modal/modal-user-inscrit/modal-user-inscrit.component';
import { LoginComponent } from './components/login/login.component';
import { environment } from 'src/environments/environment';
import { RegisterLivreurComponent } from './components/register-livreur/register-livreur.component';
import { HeaderComponent } from './components/header/header.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CreateCrenauComponent } from './components/create-crenau/create-crenau.component';
import { DahsboardLivreurComponent } from './components/dahsboard-livreur/dahsboard-livreur.component';
import { ListeLivreurComponent } from './components/liste-livreur/liste-livreur.component';
import { ModalDeleteCrenauComponent } from './components/modal/modal-delete-crenau/modal-delete-crenau.component';
import { MessagesComponent } from './components/messages/messages.component';
import { ModalMessageComponent } from './components/modal/modal-message/modal-message.component';
import { CarnetAdressesComponent } from './components/carnet-adresses/carnet-adresses.component';
import { DashboardProComponent } from './components/dashboard-pro/dashboard-pro.component';

// Rosebaie
import { RosebaieCreateLivraisonAttenteComponent } from './components/rosebaie/rosebaie-create-livraison-attente/rosebaie-create-livraison-attente.component';
import { RosebaieListLivraisonAttenteComponent } from './components/rosebaie/rosebaie-list-livraison-attente/rosebaie-list-livraison-attente.component';
import { MissionRosebaieComponent } from './components/rosebaie/mission-rosebaie/mission-rosebaie.component';
import { ModalLivreursAstreinteComponent } from './components/modal/modal-livreurs-astreinte/modal-livreurs-astreinte.component';

// Kyosushi
import { PlanningKYOComponent } from './components/KYO/planning-kyo/planning-kyo.component';
import { HeuresLivreursComponent } from './components/KYO/heures-livreurs/heures-livreurs.component';

// Pipe
import { ReturnLogoPipe } from './components/dahsboard-livreur/return-logo.pipe';
import { ReturnIconPipe } from './components/dahsboard-livreur/return-icon.pipe';
import { ReturnStatutPipe } from './components/dahsboard-livreur/return-statut.pipe';
import { ReturnMissionRbPipe } from './components/dahsboard-livreur/return-missionRB.pipe';
import { ReturnLivreursPipe } from './components/KYO/planning-kyo/return-livreurs.pipe';
import { verifierUserInscritPipe } from './components/register-livreur/verifierUserInscrit.pipe';
import { ReturnUserProfilPipe } from './components/KYO/heures-livreurs/return-userProfil.pipe';
import { ReturnHeureLivreurPipe } from './components/KYO/heures-livreurs/return-heureLivreur.pipe';
import { TotalHeureLivreursPipe } from './components/KYO/heures-livreurs/totalHeureLivreurs.pipe';
import { CheckFinServicePipe } from './components/KYO/planning-kyo/checkCreneauSuivant.pipe';
import { CheckPrecedentPriseServicePipe } from './components/KYO/planning-kyo/checkPrecedentPriseService.pipe';
import { ReturnCreneauPipe } from './components/dashboard-pro/return-creneau.pipe';

// firebase
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

registerLocaleData(localeFr, 'fr');

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterLivreurComponent,
    HeaderComponent,
    SignUpComponent,
    ProfileComponent,
    CreateCrenauComponent,
    DahsboardLivreurComponent,
    ListeLivreurComponent,
    ModalUserInscritComponent,
    ModalDeleteCrenauComponent,
    MessagesComponent,
    ModalMessageComponent,
    CarnetAdressesComponent,
    ReturnLogoPipe,
    ReturnIconPipe,
    ReturnStatutPipe,
    ReturnMissionRbPipe,
    ReturnLivreursPipe,
    verifierUserInscritPipe,
    ReturnUserProfilPipe,
    ReturnHeureLivreurPipe,
    TotalHeureLivreursPipe,
    CheckFinServicePipe,
    CheckPrecedentPriseServicePipe,
    ReturnCreneauPipe,
    ModalCreateAdresseComponent,
    RosebaieLivraisonComponent,
    MissionRosebaieComponent,
    RosebaieCreateLivraisonAttenteComponent,
    RosebaieListLivraisonAttenteComponent,
    ModalRbValiderLivraisonComponent,
    ModalIncidentMissionComponent,
    ListeBonLivraisonComponent,
    PlanningKYOComponent,
    ModalLivreursAstreinteComponent,
    HeuresLivreursComponent,
    DashboardProComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatRadioModule,
    FormsModule,
    GooglePlaceModule,
    MatAutocompleteModule,
    HotToastModule.forRoot(),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ],
  providers: [{provide: LOCALE_ID, useValue: 'fr'}, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
