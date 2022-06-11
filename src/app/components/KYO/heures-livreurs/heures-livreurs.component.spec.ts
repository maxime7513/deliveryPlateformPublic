import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeuresLivreursComponent } from './heures-livreurs.component';

describe('HeuresLivreursComponent', () => {
  let component: HeuresLivreursComponent;
  let fixture: ComponentFixture<HeuresLivreursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeuresLivreursComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeuresLivreursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
