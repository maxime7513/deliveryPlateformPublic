import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionRosebaieComponent } from './mission-rosebaie.component';

describe('MissionRosebaieComponent', () => {
  let component: MissionRosebaieComponent;
  let fixture: ComponentFixture<MissionRosebaieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MissionRosebaieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionRosebaieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
