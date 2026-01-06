import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Or } from './or';

describe('Or', () => {
  let component: Or;
  let fixture: ComponentFixture<Or>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Or]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Or);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
