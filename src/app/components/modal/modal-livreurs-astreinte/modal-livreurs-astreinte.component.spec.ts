import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLivreursAstreinteComponent } from './modal-livreurs-astreinte.component';

describe('ModalLivreursAstreinteComponent', () => {
  let component: ModalLivreursAstreinteComponent;
  let fixture: ComponentFixture<ModalLivreursAstreinteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalLivreursAstreinteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalLivreursAstreinteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
