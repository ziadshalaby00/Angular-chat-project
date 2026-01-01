import { Component, computed, effect, inject, model, signal, untracked, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Button, Spinner } from '@ziadshalaby/ngx-zs-component';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from '../services/config-service';
import { AuthApi, UserDataType } from '../services/auth-services/auth-api';
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

  readonly profileData = signal<UserDataType | null>(null);
  readonly isProfileForUserLoggedIn = signal<boolean>(false);

  readonly paramMapSig = toSignal(
    this.activatedRoute.paramMap,
    { initialValue: null }
  );
  readonly routeUserId = computed(() => {
    const params = this.paramMapSig();
    const id = params?.get('user_id');
    return id ? Number(id) : null;
  });

  constructor() {
    effect(() => {
      const userId = this.routeUserId();

      if (!userId) return;
      if (userId === this.profileData()?.id) return;

      const userLoggedinData = this.authApi.userData();

      // بروفايل المستخدم الحالي
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
 
  handleCloseSuccess = (modalToClose?: WritableSignal<boolean>): void => {
    modalToClose?.set(false);
    this.authApi.updateProfileLoading.set(false);
    this.authApi.remImgProfileLoading.set(false);
  };


  handleCloseFail: () => void = () => {
    this.authApi.updateProfileLoading.set(false);
    this.authApi.remImgProfileLoading.set(false);
  }

  readonly openUpdateAccModal = model<boolean>(false);
  readonly openEditImgModal = model<boolean>(false);
  readonly openChangePassModal = model<boolean>(false);
  readonly openDelUserAccModal = model<boolean>(false);
}