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
import { ListeLivreurComponent } from './components/liste-livreur/liste-livreur.component';
import { RosebaieCreateLivraisonComponent } from './components/rosebaie-create-livraison/rosebaie-create-livraison.component';
import { MessagesComponent } from './components/messages/messages.component';

import { RoleWoozooGuard } from './shared/role-woozoo.guard';
import { RoleLivreurGuard } from './shared/role-livreur.guard';
import { RoleRocketGuard } from './shared/role-rocket.guard';
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { CarnetAdressesComponent } from './components/carnet-adresses/carnet-adresses.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['register']);

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent, ...canActivate(redirectLoggedInToHome)},
  { path: 'signup', component: SignUpComponent, ...canActivate(redirectUnauthorizedToLogin), canActivate:[RoleWoozooGuard] },
  { path: 'register', component: RegisterLivreurComponent, ...canActivate(redirectUnauthorizedToLogin), canActivate:[RoleLivreurGuard] },
  { path: 'profil', component: ProfileComponent, ...canActivate(redirectUnauthorizedToLogin)},
  { path: 'crenau', component: CreateCrenauComponent, ...canActivate(redirectUnauthorizedToLogin), canActivate:[RoleRocketGuard]},
  { path: 'planning', component: PlanningComponent, ...canActivate(redirectUnauthorizedToLogin), canActivate:[RoleRocketGuard] },
  { path: 'dashboardlivreur', component: DahsboardLivreurComponent, ...canActivate(redirectUnauthorizedToLogin), canActivate:[RoleLivreurGuard] },
  { path: 'listLivreur', component: ListeLivreurComponent, ...canActivate(redirectUnauthorizedToLogin), canActivate:[RoleWoozooGuard]},
  { path: 'createRosebaie', component: RosebaieCreateLivraisonComponent, ...canActivate(redirectUnauthorizedToLogin), canActivate:[RoleRocketGuard]},
  { path: 'messages', component: MessagesComponent, ...canActivate(redirectUnauthorizedToLogin), canActivate:[RoleWoozooGuard]},
  { path: 'carnetAdresses', component: CarnetAdressesComponent, ...canActivate(redirectUnauthorizedToLogin)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
