import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { user } from 'rxfire/auth';
import { Observable } from 'rxjs';
import { UsersService } from '../services/users.service';

@Injectable({
  providedIn: 'root'
})
export class RoleLivreurGuard implements CanActivate {

  constructor(private userservice: UsersService, private router: Router) { }

  async canActivate(){
    const userRole = await this.userservice.canAccess();
    console.log(userRole);
    if( userRole == 'livreur'){
      console.log('canAcces => accept');
      return true;
    }else{
      console.log('canAcces => refused');
      this.router.navigate(['/planning']);
      return false;
    }
  }
  
}
