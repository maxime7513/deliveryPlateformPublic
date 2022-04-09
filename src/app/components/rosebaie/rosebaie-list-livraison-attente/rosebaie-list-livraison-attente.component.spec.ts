import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RosebaieListLivraisonAttenteComponent } from './rosebaie-list-livraison-attente.component';

describe('RosebaieListLivraisonAttenteComponent', () => {
  let component: RosebaieListLivraisonAttenteComponent;
  let fixture: ComponentFixture<RosebaieListLivraisonAttenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RosebaieListLivraisonAttenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RosebaieListLivraisonAttenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
