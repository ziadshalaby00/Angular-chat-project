import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileEditUserImg } from './profile-edit-user-img';

describe('ProfileEditUserImg', () => {
  let component: ProfileEditUserImg;
  let fixture: ComponentFixture<ProfileEditUserImg>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileEditUserImg]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileEditUserImg);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
