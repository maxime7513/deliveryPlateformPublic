import { Pipe, PipeTransform } from "@angular/core";
import { UsersService } from "src/app/services/users.service";

@Pipe({
    name: 'returnUserProfil',
    pure: true
})

export class ReturnUserProfilPipe implements PipeTransform {
  
  constructor(private usersService: UsersService){}

  transform(value: string):any {
    return this.getUserInscrit(value);
  }

  getUserInscrit(userId: string){
    return new Promise(resolve => {
        this.usersService.getUserByID(userId).subscribe((res:any) => {     
          resolve(res.lastName + ' ' + res.firstName);
        })
    });
  }

}