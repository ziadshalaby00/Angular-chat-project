import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileChangePassword } from './profile-change-password';

describe('ProfileChangePassword', () => {
  let component: ProfileChangePassword;
  let fixture: ComponentFixture<ProfileChangePassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileChangePassword]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileChangePassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
