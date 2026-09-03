import { Component, computed, effect, HostListener, inject, model, signal, untracked, WritableSignal, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Button, Spinner } from '@ziadshalaby/ngx-zs-component';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from '../../services/config-service/config-service';
import { AuthApi, UserDataType } from '../../services/auth-services/auth-api';
import { ProfileUpdateAccount } from '../profile-update-account/profile-update-account';
import { ProfileEditUserImg } from '../profile-edit-user-img/profile-edit-user-img';
import { ProfileChangePassword } from '../profile-change-password/profile-change-password';
import { ProfileDeleteUserAccount } from '../profile-delete-user-account/profile-delete-user-account';
import { SharedUtils } from '../../services/shared-service/shared-utils';
import { ChangeEmail } from '../change-email/change-email';

@Component({
  selector: 'app-profile',
  imports: [
    Button, 
    Spinner, 
    ProfileUpdateAccount, 
    ProfileEditUserImg,
    ProfileChangePassword,
    ProfileDeleteUserAccount,
    ChangeEmail
  ],
  templateUrl: './profile.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './profile.css',
})
export class Profile {
  readonly router: Router = inject(Router);
  readonly authApi: AuthApi = inject(AuthApi);
  readonly config = inject(ConfigService);
  readonly shared: SharedUtils = inject(SharedUtils);
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

      // Current user profile
      if (userId === userLoggedinData?.id) {
        this.isProfileForUserLoggedIn.set(true);
        this.profileData.set(userLoggedinData);
        return;
      }

      // Another user's profile
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
      const userLoggedinData = this.authApi.userData();

      untracked(() => {
        const isProfileForUserLoggedIn = this.isProfileForUserLoggedIn();
        if(isProfileForUserLoggedIn) {
          this.profileData.set(userLoggedinData);
        }
      })
    });

    effect(() => {
      console.log(this.profileData());
    })
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
  readonly openChangeEmailModal = model<boolean>(false);
  readonly openDelUserAccModal = model<boolean>(false);

  readonly isImageZoomOpen = signal(false);

  openImageZoom() {
    this.isImageZoomOpen.set(true);
  }

  closeImageZoom() {
    this.isImageZoomOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    this.closeImageZoom();
  }

  resendVerificationEmail() { 
    this.authApi.resendverifyEmailLoading.set(true);
    const email = this.profileData()?.email ?? '';
    this.authApi.resendVerifyEmail(email);
  }
}