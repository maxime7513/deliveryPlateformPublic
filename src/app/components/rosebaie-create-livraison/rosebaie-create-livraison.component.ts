import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';

interface Heure {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-rosebaie-create-livraison',
  templateUrl: './rosebaie-create-livraison.component.html',
  styleUrls: ['./rosebaie-create-livraison.component.scss']
})
export class RosebaieCreateLivraisonComponent implements OnInit {
  datePicker = new Date;
  rbForm: FormGroup;
  heures: Heure[] = [
    {value: 7, viewValue: '07h'},
    {value: 8, viewValue: '08h'},
    {value: 9, viewValue: '09h'},
    {value: 10, viewValue: '10h'},
    {value: 11, viewValue: '11h'},
    {value: 12, viewValue: '12h'},
    {value: 13, viewValue: '13h'},
    {value: 14, viewValue: '14h'},
    {value: 15, viewValue: '15h'},
    {value: 16, viewValue: '16h'},
    {value: 17, viewValue: '17h'},
    {value: 18, viewValue: '18h'},
    {value: 19, viewValue: '19h'},
    {value: 20, viewValue: '20h'},
    {value: 21, viewValue: '21h'},
    {value: 22, viewValue: '22h'},
    {value: 23, viewValue: '23h'},
  ];

  constructor(private toast: HotToastService) { }

  ngOnInit(): void {
    this.validateform();
  }
  
  // init validator
  validateform() {
    this.rbForm = new FormGroup(
      {
        date: new FormControl('', Validators.required),
        heureEnlevement: new FormControl('', Validators.required),
        adresseEnlevement: new FormControl('', Validators.required),
        // adresseLivraison: new FormArray([]),
        adresseLivraison: new FormArray([
          new FormControl('', Validators.required), 
        ]),
      }
    );
  }

  // getter for mat error
  get date() {
    return this.rbForm.get('date');
  }
  get adresseEnlevement() {
    return this.rbForm.get('adresseEnlevement');
  }
  get heureEnlevement() {
    return this.rbForm.get('adresseEnlevement');
  }

  get arrayAdresseLivraison() {
    return this.rbForm.get('adresseLivraison') as FormArray;
  }

  addAdresse() {
    this.arrayAdresseLivraison.push(new FormControl('', Validators.required));
  }
  removeAdresse(index: number) {
    this.arrayAdresseLivraison.removeAt(index);
  }

  onSubmit(){
    this.toast.close();
    console.log(this.rbForm.value)
    if (!this.rbForm.valid) {
      console.log('formulaire invalid');
      this.toast.error('Formulaire invalide');
      return;
    }
  }
}
