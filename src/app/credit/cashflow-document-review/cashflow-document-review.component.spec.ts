import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashflowDocumentReviewComponent } from './cashflow-document-review.component';

describe('CashflowDocumentReviewComponent', () => {
  let component: CashflowDocumentReviewComponent;
  let fixture: ComponentFixture<CashflowDocumentReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashflowDocumentReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashflowDocumentReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
