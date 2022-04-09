import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RosebaieCreateLivraisonAttenteComponent } from './rosebaie-create-livraison-attente.component';

describe('RosebaieCreateLivraisonAttenteComponent', () => {
  let component: RosebaieCreateLivraisonAttenteComponent;
  let fixture: ComponentFixture<RosebaieCreateLivraisonAttenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RosebaieCreateLivraisonAttenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RosebaieCreateLivraisonAttenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
