import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileDeleteUserAccount } from './profile-delete-user-account';

describe('ProfileDeleteUserAccount', () => {
  let component: ProfileDeleteUserAccount;
  let fixture: ComponentFixture<ProfileDeleteUserAccount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileDeleteUserAccount]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileDeleteUserAccount);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
