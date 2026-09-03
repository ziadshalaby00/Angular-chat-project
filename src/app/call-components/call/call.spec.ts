import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Call } from './call';

describe('Call', () => {
  let component: Call;
  let fixture: ComponentFixture<Call>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Call]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Call);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
