import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UsersService } from '../services/users.service';

@Injectable({
  providedIn: 'root'
})
export class RoleWoozooGuard implements CanActivate {
  
  constructor(private userservice: UsersService) { }

  async canActivate(){
    const userRole = await this.userservice.canAccess$;
    console.log(userRole);
    if( userRole == 'woozoo'){
      return true;
    }else{
      return false;
    }
  }
  
}
