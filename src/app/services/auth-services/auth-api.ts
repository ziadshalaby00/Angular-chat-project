import { PasswordReset } from './password-reset';
import { inject, Injectable, Injector } from '@angular/core';
import { UserSharedUtils } from './user-shared-utils';
import { User } from './user';
import { Logout } from './logout';
import { GoogleAuth } from './google-auth';
import { Auth } from './auth';
import { AccessVerification } from './access-verification';
export type { UserDataType } from './user-shared-utils'

@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  // ====== LAZY INJECTS ======
  private readonly injector = inject(Injector);

  private get userShared(): UserSharedUtils {
    return this.injector.get(UserSharedUtils);
  }
  private get passwordResetS(): PasswordReset {
    return this.injector.get(PasswordReset);
  }
  private get user(): User {
    return this.injector.get(User);
  }
  private get logoutS(): Logout {
    return this.injector.get(Logout);
  }
  private get googleAuth(): GoogleAuth {
    return this.injector.get(GoogleAuth);
  }
  private get auth(): Auth {
    return this.injector.get(Auth);
  }
  private get accessVerification(): AccessVerification {
    return this.injector.get(AccessVerification);
  }

  // ====== RE-EXPORT SIGNALS ======
  get userData() { return this.userShared.userData; }
  get isLoggedin() { return this.userShared.isLoggedin; }

  get signupLoading() { return this.userShared.signupLoading; }
  get loginLoading() { return this.userShared.loginLoading; }

  get googleLoading() { return this.userShared.googleLoading; }
  get verifyloading() { return this.userShared.verifyloading; }

  get passwordResetConfirmLoading() { return this.userShared.passwordResetConfirmLoading; }
  get passwordResetLoading() { return this.userShared.passwordResetLoading; }

  get updateProfileLoading() { return this.userShared.updateProfileLoading; }
  get remImgProfileLoading() { return this.userShared.remImgProfileLoading; }
  get getUsersProfileLoading() { return this.userShared.getUsersProfileLoading; }

  get deleteAccLoading() { return this.userShared.deleteAccLoading; }

  // ====== RE-EXPORT METHODS ======
  me(...args: Parameters<User['me']>) { return this.user.me(...args); }
  getUsersProfile(...args: Parameters<User['getUsersProfile']>) { return this.user.getUsersProfile(...args); }
  updateProfile(...args: Parameters<User['updateProfile']>) { return this.user.updateProfile(...args); }
  deleteUserImage(...args: Parameters<User['deleteUserImage']>) { return this.user.deleteUserImage(...args); }

  passwordReset(...args: Parameters<PasswordReset['passwordReset']>) { return this.passwordResetS.passwordReset(...args); }
  passwordResetConfirm(...args: Parameters<PasswordReset['passwordResetConfirm']>) { return this.passwordResetS.passwordResetConfirm(...args); }

  logout(...args: Parameters<Logout['logout']>) { return this.logoutS.logout(...args); }

  startRequestCode(...args: Parameters<GoogleAuth['startRequestCode']>) { return this.googleAuth.startRequestCode(...args); }
  initCodeClient(...args: Parameters<GoogleAuth['initCodeClient']>) { return this.googleAuth.initCodeClient(...args); }

  signup(...args: Parameters<Auth['signup']>) { return this.auth.signup(...args); }
  login(...args: Parameters<Auth['login']>) { return this.auth.login(...args); }
  googleExchange(...args: Parameters<Auth['googleExchange']>) { return this.auth.googleExchange(...args); }
  getCsrfToken(...args: Parameters<Auth['getCsrfToken']>) { return this.auth.getCsrfToken(...args); }
  deleteAcc(...args: Parameters<Auth['deleteAcc']>) { return this.auth.deleteAcc(...args); }

  verifyAccess(...args: Parameters<AccessVerification['verifyAccess']>) { return this.accessVerification.verifyAccess(...args); }
}
