import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker'; 
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { environment } from 'src/environments/environment';
import { HotToastModule } from '@ngneat/hot-toast';
import { RegisterLivreurComponent } from './components/register-livreur/register-livreur.component';
import { HeaderComponent } from './components/header/header.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CreateCrenauComponent } from './components/create-crenau/create-crenau.component';
import { PlanningComponent } from './components/planning/planning.component';
import { DahsboardLivreurComponent } from './components/dahsboard-livreur/dahsboard-livreur.component';
import { FormsModule } from '@angular/forms';

// firebase
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { ListeLivreurComponent } from './components/liste-livreur/liste-livreur.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterLivreurComponent,
    HeaderComponent,
    SignUpComponent,
    ProfileComponent,
    CreateCrenauComponent,
    PlanningComponent,
    DahsboardLivreurComponent,
    ListeLivreurComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatMenuModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    HotToastModule.forRoot(),
    FormsModule,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
