import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RosebaieCreateLivraisonComponent } from './rosebaie-create-livraison.component';

describe('RosebaieCreateLivraisonComponent', () => {
  let component: RosebaieCreateLivraisonComponent;
  let fixture: ComponentFixture<RosebaieCreateLivraisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RosebaieCreateLivraisonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RosebaieCreateLivraisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
