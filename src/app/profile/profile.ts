import { Component, effect, inject, model, signal, untracked, viewChild, WritableSignal } from '@angular/core';
import { Button, Modal, Input, ChangeEventType, Form, FileInput, FileData, Checkbox, Spinner, ValidatorFn } from '@ziadshalaby/ngx-zs-component';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from '../services/config-service';
import { AuthApi, UserDataType } from '../services/auth-services/auth-api';
import { Or } from '../or/or';
import { ProfileUpdateAccount } from '../profile-update-account/profile-update-account';
import { ProfileEditUserImg } from '../profile-edit-user-img/profile-edit-user-img';
import { ProfileChangePassword } from '../profile-change-password/profile-change-password';
import { ProfileDeleteUserAccount } from '../profile-delete-user-account/profile-delete-user-account';

@Component({
  selector: 'app-profile',
  imports: [
    Button, 
    Spinner, 
    ProfileUpdateAccount, 
    ProfileEditUserImg,
    ProfileChangePassword,
    ProfileDeleteUserAccount
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  readonly router: Router = inject(Router);
  readonly authApi: AuthApi = inject(AuthApi);
  readonly config = inject(ConfigService);
  readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  readonly userId = signal<number | null>(null);
  readonly profileData = signal<UserDataType | null>(null);
  readonly isProfileForUserLoggedIn = signal<boolean>(false);

  constructor() {
    this.startSubscribe();

    effect(() => {
      const isLoggedin = this.authApi.isLoggedin()
      untracked(() => {
        const isProfileForUserLoggedIn = this.isProfileForUserLoggedIn();

        if(!isLoggedin && isProfileForUserLoggedIn) {
          this.router.navigate(['/login']);
        }
      })
    })

    effect(() => {
      const userLoggedinData = this.authApi.userData();

      untracked(() => {
        const isUserLoggedIn = this.isProfileForUserLoggedIn();
        if(isUserLoggedIn) {
          this.profileData.set(userLoggedinData);
        }
      })
    });
  }

  startSubscribe() {
    this.activatedRoute.paramMap
    .subscribe(params => {
      const userId = Number(params.get('user_id'));
      if (!userId) return;

      // لو نفس الـ userId الحالي، ما تعملش حاجة
      if (userId === this.profileData()?.id) return;

      // حدّد الـ userId الحالي
      this.userId.set(userId);

      const userLoggedinData = this.authApi.userData();
      if (userId === userLoggedinData?.id) {
        this.isProfileForUserLoggedIn.set(true);
        this.profileData.set(userLoggedinData);
        return;
      }

      // بروفايل مستخدم آخر
      this.isProfileForUserLoggedIn.set(false);

      this.authApi.getUsersProfileLoading.set(true);
      this.authApi.getUsersProfile(
        userId,
        (res) => {
          this.profileData.set(res.user_profile);
          this.authApi.getUsersProfileLoading.set(false);
        },
        () => {
          this.profileData.set(null);
          this.authApi.getUsersProfileLoading.set(false);
        }
      );
    });
  }
 
  handleCloseSc = (modalToClose?: WritableSignal<boolean>) => 
    () => {
      console.log(modalToClose)
      if(modalToClose) modalToClose.set(false);
      this.authApi.updateProfileLoading.set(false);
    }

  handleCloseFd: () => void = () => {
    this.authApi.updateProfileLoading.set(false);
  }

  readonly openUpdateAccModal = model<boolean>(false);
  readonly openEditImgModal = model<boolean>(false);
  readonly openChangePassModal = model<boolean>(false);
  readonly openDelUserAccModal = model<boolean>(false);
}