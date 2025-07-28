import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateResidentComponent } from './create-resident.component';

describe('CreateComponent', () => {
  let component: CreateResidentComponent;
  let fixture: ComponentFixture<CreateResidentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateResidentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateResidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
