import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeBonLivraisonComponent } from './liste-bon-livraison.component';

describe('ListeBonLivraisonComponent', () => {
  let component: ListeBonLivraisonComponent;
  let fixture: ComponentFixture<ListeBonLivraisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeBonLivraisonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeBonLivraisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
