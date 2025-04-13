import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FailedTransactionsComponent } from './failed-transactions.component';

describe('FailedTransactionsComponent', () => {
  let component: FailedTransactionsComponent;
  let fixture: ComponentFixture<FailedTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FailedTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FailedTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
