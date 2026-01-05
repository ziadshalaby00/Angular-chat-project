import { inject, Injectable, Injector } from '@angular/core';
import { UserSharedUtils } from './user-shared-utils';

@Injectable({
  providedIn: 'root',
})
export class PasswordReset {
  private readonly injector = inject(Injector);
  private get userShared(): UserSharedUtils { return this.injector.get(UserSharedUtils); }
  
  private readonly passwordResetURL = `${this.userShared.config.apiUrl}/api/auth/password-reset-link/`;
  private readonly passwordResetConfirmURL = `${this.userShared.config.apiUrl}/api/auth/password-reset-confirm/`;

  passwordReset(body: {email: string}, successFn: () => void) {
    this.userShared.shared.http.post(this.passwordResetURL, body).subscribe({
      next: (res: any) => {
        this.userShared.shared.alertService.addAlert({
          message: res.message,
          type: 'success'
        })
        this.userShared.passwordResetLoading.set(false);
        if(successFn) successFn();
      },
      error: (err: any) => {
        this.userShared.shared.setErrors(err.error);
        this.userShared.passwordResetLoading.set(false);
      }
    })
  }

  passwordResetConfirm(body: any) {
    this.userShared.shared.http.post(this.passwordResetConfirmURL, body).subscribe({
      next: (res: any) => {
        this.userShared.shared.alertService.addAlert({
          message: res.message,
          type: 'success'
        })
        this.userShared.router.navigate(['/login']);
        this.userShared.passwordResetConfirmLoading.set(false);
      },
      error: (err: any) => {
        this.userShared.shared.setErrors(err.error);
        this.userShared.passwordResetConfirmLoading.set(false);
      }
    })
  }
}
