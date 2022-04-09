import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRbValiderLivraisonComponent } from './modal-rb-valider-livraison.component';

describe('ModalRbValiderLivraisonComponent', () => {
  let component: ModalRbValiderLivraisonComponent;
  let fixture: ComponentFixture<ModalRbValiderLivraisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalRbValiderLivraisonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRbValiderLivraisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
