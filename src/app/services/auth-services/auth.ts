import { inject, Injectable, Injector } from '@angular/core';
import { SharedUtils } from './shared-utils';
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
  private get shared(): SharedUtils { return this.injector.get(SharedUtils); }
  private get user(): User { return this.injector.get(User); }
  private get token(): Token { return this.injector.get(Token); }
  private get logout(): Logout { return this.injector.get(Logout); }

  private readonly signupURL = `${this.shared.config.apiUrl}/api/auth/register/`;
  private readonly loginURL = `${this.shared.config.apiUrl}/api/auth/login/`;
  private readonly googleLoginURL = `${this.shared.config.apiUrl}/api/auth/google-login/`;
  private readonly csrfTokenURL = `${this.shared.config.apiUrl}/api/auth/get_csrf/`;
  private readonly deleteAccURL = `${this.shared.config.apiUrl}/api/auth/delete-user/`;

  signup(body: RegBody) {
    this.shared.config.http.post(this.signupURL, body).subscribe({
      next: (res: any) => {
        this.shared.signupLoading.set(false);
        this.shared.config.alertService.addAlert({
          message: res.message,
          type: 'success'
        })
        this.shared.router.navigate(['/login'])
      },
      error: (err: any) => {
        this.shared.signupLoading.set(false);
        this.shared.config.setErrors(err.error);
      }
    })
  }

  login(body: logBody) {
    this.shared.config.http.post(this.loginURL, body, { withCredentials: true }).subscribe({
      next: (res: any) => {
        this.user.me(
          () => {
            this.shared.loginLoading.set(false);
            this.shared.config.alertService.addAlert({
              message: res.message,
              type: 'success'
            })
            this.shared.isLoggedin.set(true);
            this.token.refreshEventLoop(this.shared.accessTokenExpire);
            this.shared.router.navigate(['/home']);
          },
          () => this.shared.loginLoading.set(false)
        )
      },
      error: (err: any) => {
        this.shared.loginLoading.set(false);
        this.shared.config.setErrors(err.error);
      }
    })
  }

  googleExchange(code: string) {
    this.shared.config.http.post(this.googleLoginURL, { code }, { withCredentials: true }).subscribe({
      next: (res: any) => {
        this.user.me(
          () => {
            this.shared.googleLoading.set(false);
            this.shared.config.alertService.addAlert({
              message: res.message,
              type: 'success'
            })
            this.shared.isLoggedin.set(true);
            this.token.refreshEventLoop(this.shared.accessTokenExpire);
            this.shared.router.navigate(['/home']);
          },
          () => this.shared.googleLoading.set(false)
        )
      },
      error: (err: any) => {
        this.shared.googleLoading.set(false);
        this.shared.config.setErrors(err.error);
      }
    })
  }

  async getCsrfToken(): Promise<boolean> {
    try {
      const res = await firstValueFrom(
        this.shared.config.http.get(this.csrfTokenURL, { withCredentials: true })
      );
      console.log('CSRF token fetched', res);
      return true;
    } catch (err) {
      console.warn('CSRF token fetch failed', err);
      return false;
    }
  }

  deleteAcc(password: string) {
    this.shared.config.http.post(this.deleteAccURL, { password } ,this.shared.config.CredAndCsrf()).subscribe({
      next: (res: any) => {
        this.shared.deleteAccLoading.set(false);
        this.shared.config.alertService.addAlert({
          message: res.message,
          type: 'success'
        })

        this.logout.logout();
      },
      error: (err: any) => {
        this.shared.deleteAccLoading.set(false);
        this.shared.config.setErrors(err.error);
      }
    })
  }
}
