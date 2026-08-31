import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeEmail } from './change-email';

describe('ChangeEmail', () => {
  let component: ChangeEmail;
  let fixture: ComponentFixture<ChangeEmail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeEmail]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ChangeEmail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
