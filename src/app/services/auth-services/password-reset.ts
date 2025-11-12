import { inject, Injectable, Injector } from '@angular/core';
import { SharedUtils } from './shared-utils';

@Injectable({
  providedIn: 'root',
})
export class PasswordReset {
  private readonly injector = inject(Injector);
  private get shared(): SharedUtils { return this.injector.get(SharedUtils); }
  
  private readonly passwordResetURL = `${this.shared.config.apiUrl}/api/auth/password-reset-link/`;
  private readonly passwordResetConfirmURL = `${this.shared.config.apiUrl}/api/auth/password-reset-confirm/`;

  passwordReset(body: {email: string}, successFn: () => void) {
    this.shared.http.post(this.passwordResetURL, body).subscribe({
      next: (res: any) => {
        this.shared.alertService.addAlert({
          message: res.message,
          type: 'success'
        })
        this.shared.passwordResetLoading.set(false);
        if(successFn) successFn();
      },
      error: (err: any) => {
        this.shared.setErrors(err.error);
        this.shared.passwordResetLoading.set(false);
      }
    })
  }

  passwordResetConfirm(body: any) {
    this.shared.http.post(this.passwordResetConfirmURL, body).subscribe({
      next: (res: any) => {
        this.shared.alertService.addAlert({
          message: res.message,
          type: 'success'
        })
        this.shared.router.navigate(['/login']);
        this.shared.passwordResetConfirmLoading.set(false);
      },
      error: (err: any) => {
        this.shared.setErrors(err.error);
        this.shared.passwordResetConfirmLoading.set(false);
      }
    })
  }
}
