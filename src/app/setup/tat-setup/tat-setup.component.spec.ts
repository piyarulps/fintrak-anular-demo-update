import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TatSetupComponent } from './tat-setup.component';

describe('TatSetupComponent', () => {
  let component: TatSetupComponent;
  let fixture: ComponentFixture<TatSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TatSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TatSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
