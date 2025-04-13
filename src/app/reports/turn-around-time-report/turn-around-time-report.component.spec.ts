import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnAroundTimeReportComponent } from './turn-around-time-report.component';

describe('TurnAroundTimeReportComponent', () => {
  let component: TurnAroundTimeReportComponent;
  let fixture: ComponentFixture<TurnAroundTimeReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TurnAroundTimeReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnAroundTimeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
