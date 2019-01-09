import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FairApplicationComponent } from './fair-application.component';

describe('FairApplicationComponent', () => {
  let component: FairApplicationComponent;
  let fixture: ComponentFixture<FairApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FairApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FairApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
