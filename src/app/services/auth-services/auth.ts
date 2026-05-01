import { inject, Injectable, Injector } from '@angular/core';
import { UserSharedUtils } from './user-shared-utils';
import { User } from './user';
import { Token } from './token';
import { firstValueFrom } from 'rxjs';
import { Logout } from './logout';

export interface RegBody {
  fullname: string,
  username: string,
  email: string,
  password: string,
}

export interface logBody {
  username: string,
  password: string,
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly injector = inject(Injector);
  private get userShared(): UserSharedUtils { return this.injector.get(UserSharedUtils); }
  private get user(): User { return this.injector.get(User); }
  private get token(): Token { return this.injector.get(Token); }
  private get logout(): Logout { return this.injector.get(Logout); }

  private readonly signupURL = `${this.userShared.config.apiUrl}/api/auth/register/`;
  private readonly loginURL = `${this.userShared.config.apiUrl}/api/auth/login/`;
  private readonly googleLoginURL = `${this.userShared.config.apiUrl}/api/auth/google-login/`;
  private readonly csrfTokenURL = `${this.userShared.config.apiUrl}/api/auth/get_csrf/`;
  private readonly deleteAccURL = `${this.userShared.config.apiUrl}/api/auth/delete-user/`;

  signup(body: RegBody) {
    this.userShared.shared.http.post(this.signupURL, body).subscribe({
      next: (res: any) => {
        this.userShared.signupLoading.set(false);
        this.userShared.shared.alertService.addAlert({
          message: res.message,
          type: 'success'
        })
        this.userShared.router.navigate(['/login'])
      },
      error: (err: any) => {
        this.userShared.signupLoading.set(false);
        this.userShared.shared.setErrors(err.error);
      }
    })
  }

  login(body: logBody) {
    this.userShared.shared.http.post(this.loginURL, body, { withCredentials: true }).subscribe({
      next: (res: any) => {
        this.user.me(
          () => {
            this.userShared.loginLoading.set(false);
            this.userShared.shared.alertService.addAlert({
              message: res.message,
              type: 'success'
            })
            this.userShared.isLoggedin.set(true);
            this.token.refreshEventLoop(this.userShared.accessTokenExpire);
            this.userShared.router.navigate(['/home']);
          },
          () => this.userShared.loginLoading.set(false)
        )
      },
      error: (err: any) => {
        this.userShared.loginLoading.set(false);
        this.userShared.shared.setErrors(err.error);
      }
    })
  }

  googleExchange(code: string) {
    this.userShared.shared.http.post(this.googleLoginURL, { code }, { withCredentials: true }).subscribe({
      next: (res: any) => {
        this.user.me(
          () => {
            this.userShared.googleLoading.set(false);
            this.userShared.shared.alertService.addAlert({
              message: res.message,
              type: 'success'
            })
            this.userShared.isLoggedin.set(true);
            this.token.refreshEventLoop(this.userShared.accessTokenExpire);
            this.userShared.router.navigate(['/home']);
          },
          () => this.userShared.googleLoading.set(false)
        )
      },
      error: (err: any) => {
        this.userShared.googleLoading.set(false);
        this.userShared.shared.setErrors(err.error);
      }
    })
  }

  async getCsrfToken(): Promise<boolean> {
    try {
      const res = await firstValueFrom(
        this.userShared.shared.http.get(this.csrfTokenURL, { withCredentials: true })
      );
      console.log('CSRF token fetched', res);
      return true;
    } catch (err) {
      console.warn('CSRF token fetch failed', err);
      return false;
    }
  }

  deleteAcc(password: string) {
    this.userShared.shared.http.post(this.deleteAccURL, 
      { password }, this.userShared.shared.CredAndCsrf()).subscribe({
      next: (res: any) => {
        this.userShared.deleteAccLoading.set(false);
        this.userShared.shared.alertService.addAlert({
          message: res.message,
          type: 'success'
        })

        this.logout.logout();
      },
      error: (err: any) => {
        this.userShared.deleteAccLoading.set(false);
        this.userShared.shared.setErrors(err.error);
      }
    })
  }
}
