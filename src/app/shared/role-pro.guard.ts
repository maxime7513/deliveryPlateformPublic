import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsersService } from '../services/users.service';

@Injectable({
  providedIn: 'root'
})
export class RoleProGuard implements CanActivate {

  constructor(private userservice: UsersService) { }

  async canActivate(){
    const userRole = await this.userservice.canAccess$;
    console.log(userRole);
    if( userRole == 'rocket' || userRole == 'woozoo' || userRole == 'rosebaie'){
      console.log('canAcces => accept');
      return true;
    }else{
      console.log('canAcces => refused');
      return false;
    }
  }
  
}
