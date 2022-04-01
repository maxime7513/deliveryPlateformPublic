import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { AdressesService } from 'src/app/services/adresses.service';

@Component({
  selector: 'app-modal-create-adresse',
  templateUrl: './modal-create-adresse.component.html',
  styleUrls: ['./modal-create-adresse.component.scss']
})
export class ModalCreateAdresseComponent implements OnInit {
  options : Options ={
    componentRestrictions: { country: 'FR' },
    bounds: undefined,
    types: ['geocode', 'establishment'],
    // fields: ['address_components'],
    fields: ['formatted_address'],
    strictBounds: false,
    origin: undefined
  }
  adressForm: FormGroup;
  nomAdresse: string;

  constructor(public dialogRef: MatDialogRef<ModalCreateAdresseComponent>, private adresseservice: AdressesService, private toast: HotToastService) { }

  ngOnInit(): void {
    // init formulaire
    this.validateform();
  }

  // init validator
  validateform() {
    this.adressForm = new FormGroup(
      {
        nom: new FormControl(this.nomAdresse, Validators.required),
        adresse: new FormControl('', Validators.required),
        phone: new FormControl(""),
      }
    );
  }

  // getter for mat error
  get nom() {
    return this.adressForm.get('nom');
  }  
  get adresse() {
    return this.adressForm.get('adresse');
  }
  get phone() {
    return this.adressForm.get('phone');
  }

  // AddressChange(googleAddress: any) {
  //   //setting address from API to local variable
  //   let numero = googleAddress.address_components[0].short_name,
  //   rue = googleAddress.address_components[1].short_name,
  //   cp = googleAddress.address_components[6].short_name,
  //   ville = googleAddress.address_components[2].short_name,
  //   adressFormat = numero + ' ' + rue + ', ' + cp + ' ' + ville;

  //   this.adresse.setValue(adressFormat);
  // }

  AddressChange(googleAddress: any) {
    let adresseFormat = googleAddress.formatted_address.substring(0, googleAddress.formatted_address.length - 8)
    this.adresse.setValue(adresseFormat);
  }

  // envoi du formulaire
  onSubmit() {
    this.toast.close();
    if (!this.adressForm.valid) {
      this.toast.error('Formulaire invalide');
      return;
    }

    this.adresseservice.addAdressse(this.adressForm.value)
    this.toast.success('Ajouter à vos adresses');
    this.dialogRef.close(this.adresse.value);
  }

}
