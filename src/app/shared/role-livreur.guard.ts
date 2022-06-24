import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UsersService } from '../services/users.service';

@Injectable({
  providedIn: 'root'
})
export class RoleLivreurGuard implements CanActivate {

  constructor(private userservice: UsersService, private router: Router) { }

  async canActivate(){
    const userRole = await this.userservice.canAccess$;
    console.log(userRole);
    if( userRole == 'livreur'){
      return true;
    }else if(userRole == 'kyoSushi'){
      this.router.navigate(['/crenau']);
      return false;
    }else if(userRole == 'rosebaie'){
      this.router.navigate(['/listLivraisonAttenteRB']);
      return false;
    }else{
      this.router.navigate(['/dashboardSociete']);
      return false;
    }
  }
  
}
