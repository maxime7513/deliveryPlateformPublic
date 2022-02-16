import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { RegisterLivreurComponent } from './components/register-livreur/register-livreur.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CreateCrenauComponent } from './components/create-crenau/create-crenau.component';
import { PlanningComponent } from './components/planning/planning.component';
import { DahsboardLivreurComponent } from './components/dahsboard-livreur/dahsboard-livreur.component';
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';


const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['register']);

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent, ...canActivate(redirectLoggedInToHome)},
  { path: 'signup', component: SignUpComponent, ...canActivate(redirectUnauthorizedToLogin) },
  { path: 'register', component: RegisterLivreurComponent, ...canActivate(redirectUnauthorizedToLogin) },
  { path: 'profil', component: ProfileComponent, ...canActivate(redirectUnauthorizedToLogin)},
  { path: 'crenau', component: CreateCrenauComponent, ...canActivate(redirectUnauthorizedToLogin)},
  { path: 'planning', component: PlanningComponent, ...canActivate(redirectUnauthorizedToLogin)},
  { path: 'dashboardlivreur', component: DahsboardLivreurComponent, ...canActivate(redirectUnauthorizedToLogin)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
