import { ifStmt } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UsersService } from '../services/users.service';

@Injectable({
  providedIn: 'root'
})
export class RoleWoozooGuard implements CanActivate {
  
  constructor(private userservice: UsersService, private router: Router) { }

  async canActivate(){
    const userRole = await this.userservice.canAccess$;
    console.log(userRole);
    if( userRole == 'woozoo'){
      console.log('canAcces => accept');
      return true;
    }else{
      console.log('canAcces => refused');
      return false;
    }
  }
  
}
