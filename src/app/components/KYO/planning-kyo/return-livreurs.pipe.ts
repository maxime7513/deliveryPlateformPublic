import { Pipe, PipeTransform } from "@angular/core";
import { UsersService } from "src/app/services/users.service";

@Pipe({
    name: 'returnLivreurs',
    pure: true
})

export class ReturnLivreursPipe implements PipeTransform {
  
  constructor(private userservice: UsersService){}

  transform(value: string):any {
    return this.getUserInscrit(value);
  }

  getUserInscrit(userId: string){
    return new Promise(resolve => {
        this.userservice.getUserByID(userId).subscribe((res:any) => {          
          resolve(res.lastName + ' ' + res.firstName);
        })
    });
  }

}