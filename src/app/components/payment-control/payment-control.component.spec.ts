import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentControlComponent } from './payment-control.component';

describe('PaymentControlComponent', () => {
  let component: PaymentControlComponent;
  let fixture: ComponentFixture<PaymentControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
