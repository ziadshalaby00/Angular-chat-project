import { inject, Injectable, Injector, signal } from '@angular/core';
import { UserSharedUtils } from './user-shared-utils';

@Injectable({
  providedIn: 'root',
})
export class VerifyEmail {
  private readonly injector = inject(Injector);
  private get userShared(): UserSharedUtils { return this.injector.get(UserSharedUtils); }
  
  private readonly verifyEmailURL = `${this.userShared.config.apiUrl}/api/auth/verify-email/`;
  public readonly verifyEmailError = signal<boolean>(false);

  verifyEmail(body: {uid: string, token: string}, sf?: () => void) {
    this.userShared.shared.http.post(this.verifyEmailURL, body).subscribe({
      next: (res: any) => {
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
}
