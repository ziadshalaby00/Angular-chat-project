import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileUpdateAccount } from './profile-update-account';

describe('ProfileUpdateAccount', () => {
  let component: ProfileUpdateAccount;
  let fixture: ComponentFixture<ProfileUpdateAccount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileUpdateAccount]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileUpdateAccount);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
