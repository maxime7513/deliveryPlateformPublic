import { Component, OnInit } from '@angular/core';
import { Crenau } from 'src/app/models/crenau.model';
import { CrenauService } from 'src/app/services/crenau.service';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.scss']
})
export class PlanningComponent implements OnInit {

  crenaux: Crenau[] = [];

  constructor(private crenauservice: CrenauService) { }

  ngOnInit(): void {
    this.crenauservice.getCrenaux().subscribe((res: Crenau[]) => {
      this.crenaux = res;
    })
  }

}
