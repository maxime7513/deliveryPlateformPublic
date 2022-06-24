import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { RegisterLivreurComponent } from './components/register-livreur/register-livreur.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CreateCrenauComponent } from './components/create-crenau/create-crenau.component';
import { DahsboardLivreurComponent } from './components/dahsboard-livreur/dahsboard-livreur.component';
import { ListeLivreurComponent } from './components/liste-livreur/liste-livreur.component';
import { MessagesComponent } from './components/messages/messages.component';
import { CarnetAdressesComponent } from './components/carnet-adresses/carnet-adresses.component';
import { RosebaieLivraisonComponent } from './components/rosebaie/rosebaie-livraison/rosebaie-livraison.component';
import { MissionRosebaieComponent } from './components/rosebaie/mission-rosebaie/mission-rosebaie.component';
import { RosebaieCreateLivraisonAttenteComponent } from './components/rosebaie/rosebaie-create-livraison-attente/rosebaie-create-livraison-attente.component';
import { RosebaieListLivraisonAttenteComponent } from './components/rosebaie/rosebaie-list-livraison-attente/rosebaie-list-livraison-attente.component';
import { ListeBonLivraisonComponent } from './components/rosebaie/liste-bon-livraison/liste-bon-livraison.component';
import { PlanningKYOComponent } from './components/KYO/planning-kyo/planning-kyo.component';
import { HeuresLivreursComponent } from './components/KYO/heures-livreurs/heures-livreurs.component';
import { DahsboardSocieteComponent } from './components/dahsboard-societe/dahsboard-societe.component';

import { RoleWoozooGuard } from './shared/role-woozoo.guard';
import { RoleLivreurGuard } from './shared/role-livreur.guard';
import { RoleProGuard } from './shared/role-pro.guard';
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
  { path: 'signup', component: SignUpComponent, ...canActivate(redirectUnauthorizedToLogin), canActivate:[RoleWoozooGuard] },
  { path: 'register', component: RegisterLivreurComponent, ...canActivate(redirectUnauthorizedToLogin), canActivate:[RoleLivreurGuard] },
  { path: 'profil', component: ProfileComponent, ...canActivate(redirectUnauthorizedToLogin)},
  { path: 'crenau', component: CreateCrenauComponent, ...canActivate(redirectUnauthorizedToLogin), canActivate:[RoleProGuard]},
  { path: 'dashboardSociete', component: DahsboardSocieteComponent, ...canActivate(redirectUnauthorizedToLogin), canActivate:[RoleProGuard] },
  { path: 'dashboardlivreur', component: DahsboardLivreurComponent, ...canActivate(redirectUnauthorizedToLogin), canActivate:[RoleLivreurGuard] },
  { path: 'listLivreur', component: ListeLivreurComponent, ...canActivate(redirectUnauthorizedToLogin), canActivate:[RoleWoozooGuard]},
  { path: 'createRosebaie', component: RosebaieCreateLivraisonAttenteComponent, ...canActivate(redirectUnauthorizedToLogin), canActivate:[RoleProGuard]},
  { path: 'messages', component: MessagesComponent, ...canActivate(redirectUnauthorizedToLogin), canActivate:[RoleWoozooGuard]},
  { path: 'carnetAdresses', component: CarnetAdressesComponent, ...canActivate(redirectUnauthorizedToLogin), canActivate:[RoleProGuard]},
  { path: 'listLivraisonAttenteRB', component: RosebaieListLivraisonAttenteComponent, ...canActivate(redirectUnauthorizedToLogin), canActivate:[RoleProGuard]},
  { path: 'livraisonRB', component: RosebaieLivraisonComponent, ...canActivate(redirectUnauthorizedToLogin)},
  { path: 'missionRoseBaie/:id', component: MissionRosebaieComponent, ...canActivate(redirectUnauthorizedToLogin)},
  { path: 'bonLivraisonRoseBaie', component: ListeBonLivraisonComponent, ...canActivate(redirectUnauthorizedToLogin), canActivate:[RoleProGuard]},
  { path: 'planningKYO', component: PlanningKYOComponent, ...canActivate(redirectUnauthorizedToLogin), canActivate:[RoleProGuard]},
  { path: 'heuresLivreursKYO', component: HeuresLivreursComponent, ...canActivate(redirectUnauthorizedToLogin), canActivate:[RoleProGuard]},
];

@NgModule({
  // imports: [RouterModule.forRoot(routes, { useHash: true })],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
