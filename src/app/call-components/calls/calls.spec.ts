import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Calls } from './calls';

describe('Calls', () => {
  let component: Calls;
  let fixture: ComponentFixture<Calls>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Calls]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Calls);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
