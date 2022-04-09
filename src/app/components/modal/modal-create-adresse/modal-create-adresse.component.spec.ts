import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateAdresseComponent } from './modal-create-adresse.component';

describe('ModalCreateAdresseComponent', () => {
  let component: ModalCreateAdresseComponent;
  let fixture: ComponentFixture<ModalCreateAdresseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCreateAdresseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCreateAdresseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
