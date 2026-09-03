import { inject, Injectable, Injector, signal } from '@angular/core';
import { UserSharedUtils } from './user-shared-utils';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class VerifyEmail {
  private readonly injector = inject(Injector);
  private get userShared(): UserSharedUtils { return this.injector.get(UserSharedUtils); }
  private get user(): User { return this.injector.get(User); }

  private readonly verifyEmailURL = `${this.userShared.config.apiUrl}/api/auth/verify-email/`;
  private readonly resendVerifyEmailURL = `${this.userShared.config.apiUrl}/api/auth/resend-verification-email/`;
  public readonly verifyEmailError = signal<boolean>(false);

  verifyEmail(body: {uid: string, token: string}, sf?: () => void) {
    this.userShared.shared.http.post(this.verifyEmailURL, body).subscribe({
      next: (res: any) => {
        this.user.me();

        this.userShared.shared.alertService.addAlert({
          message: res.detail,
          type: 'success'
        })

        this.userShared.verifyEmailLoading.set(false);
        this.verifyEmailError.set(false);
        if(sf) sf();
      },
      error: (err: any) => {
        this.userShared.shared.setErrors(err.error);
        this.userShared.verifyEmailLoading.set(false);
        this.verifyEmailError.set(true);
      }
    })
  }

  resendVerifyEmail(email: string) {
    this.userShared.shared.http.post(this.resendVerifyEmailURL, { email }).subscribe({
      next: (res: any) => {
        this.userShared.shared.alertService.addAlert({
          message: res.detail,
          type: 'success'
        })
        this.userShared.resendverifyEmailLoading.set(false);
      },
      error: (err: any) => {
        this.userShared.shared.setErrors(err.error);
        this.userShared.resendverifyEmailLoading.set(false);
      }
    })
  }
}
