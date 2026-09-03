import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CallingPage } from './calling-page';

describe('CallingPage', () => {
  let component: CallingPage;
  let fixture: ComponentFixture<CallingPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallingPage]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CallingPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
