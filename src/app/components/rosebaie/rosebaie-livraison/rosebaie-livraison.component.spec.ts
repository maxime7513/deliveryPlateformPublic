import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RosebaieLivraisonComponent } from './rosebaie-livraison.component';

describe('RosebaieLivraisonComponent', () => {
  let component: RosebaieLivraisonComponent;
  let fixture: ComponentFixture<RosebaieLivraisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RosebaieLivraisonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RosebaieLivraisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
