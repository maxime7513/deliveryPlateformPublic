import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { HotToastService } from '@ngneat/hot-toast';
import { Adresse } from 'src/app/models/adresse.model';
import { AdressesService } from 'src/app/services/adresses.service';

@Component({
  selector: 'app-carnet-adresses',
  templateUrl: './carnet-adresses.component.html',
  styleUrls: ['./carnet-adresses.component.scss']
})
export class CarnetAdressesComponent implements OnInit {
  adresses: Adresse[];
  lowValueSlice: number = 0;
  highValueSlice: number = 10;

  constructor(private adresseservice: AdressesService, private toast: HotToastService) { }

  ngOnInit(): void {
    // retourner les adresses
    this.adresseservice.getAdresses().subscribe((res: Adresse[]) => {
      // this.adresses = res;
      this.adresses = res.sort(function(a, b){ // retourner par ordre alphabetique
        let x = a.nom.toLowerCase();
        let y = b.nom.toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
      });
    })
  }

  // pagination
  public getPaginatorData(event: PageEvent): PageEvent {
    this.lowValueSlice = event.pageIndex * event.pageSize;
    this.highValueSlice = this.lowValueSlice + event.pageSize;
    return event;
  }

}
