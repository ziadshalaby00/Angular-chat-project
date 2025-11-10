import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertService, ExtractorService } from '@ziadshalaby/ngx-zs-component';
import { ConfigService } from './config-service';

declare const google: any;
export const googleClientId: string = 
  '376492260397-n5gnu7445umh0vut3a1tl06an5aoc186.apps.googleusercontent.com'

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

interface UserDataType {
  date_joined : string;
  email : string;
  fullname : string;
  id : number;
  is_active : boolean;
  last_login : string;
  user_image : string;
  username : string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private alertService: AlertService = inject(AlertService)
  private extractorService: ExtractorService = inject(ExtractorService)
  private http: HttpClient= inject(HttpClient);
  private config: ConfigService = inject(ConfigService);
  private router: Router = inject(Router)

  readonly userData = signal<UserDataType | null>(null)
  readonly isLoggedin = signal<boolean>(false)

  readonly error = signal<string[]>([]);
  readonly signupLoading = signal<boolean>(false)
  readonly loginLoading = signal<boolean>(false)
  readonly googleLoading = signal<boolean>(false)
  readonly verifyloading = signal<boolean>(false)

  signup(body: RegBody) {
    this.error.set([])

    this.http.post(`${this.config.apiUrl}/api/auth/register/`, body).subscribe({
      next: (res: any) => {
        this.signupLoading.set(false)
        this.alertService.addAlert({
          message: res.message,
          type: 'success'
        })
        this.router.navigate(['/login'])
      },
      error: (err: any) => {
        this.signupLoading.set(false);
        this.setErrors(err.error)
      }
    })
  }

  login(body: logBody) {
    this.error.set([])

    this.http.post(`${this.config.apiUrl}/api/auth/login/`, body, { withCredentials: true }).subscribe({
      next: (res: any) => {
        this.getUserData(
          () => {
            this.loginLoading.set(false)
            this.alertService.addAlert({
              message: res.message,
              type: 'success'
            })
            this.isLoggedin.set(true)
            this.refreshEventLoop(this.config.accessTokenExpire)
            this.router.navigate(['/home'])
          },
          () => { this.loginLoading.set(false) }
        )
      },
      error: (err: any) => {
        this.loginLoading.set(false);
        this.setErrors(err.error)
      }
    })
  }

  // ============================= Google init ============================= //
  private codeClient = signal<any>(null);
  initCodeClient() {
    if (typeof google !== 'undefined' && google?.accounts?.oauth2) {
      this.codeClient.set(
        google.accounts.oauth2.initCodeClient({
          client_id: googleClientId,
          scope: 'openid email profile',
          ux_mode: 'popup',
          callback: (response: any) => this.handleGoogleResponse(response),
        })
      )
    }
  }

  startRequestCode() {
    const client = this.codeClient();
    if (!client) {
      this.alertService.addAlert({
        message: 'Google authentication not initialized.',
        type: 'danger'
      });
      this.googleLoading.set(false);
      return;
    }
    client.requestCode();
  }

  private handleGoogleResponse(response: any) {
    const code = response.code;
    if (code) {
      this.googleExchange(code);
    } else {
      this.googleLoading.set(false);
    }
  }
  // ============================= Google init ============================= //

  googleExchange(code: string) {
    this.error.set([])

    this.http.post(`${this.config.apiUrl}/api/auth/google-login/`, { code }, { withCredentials: true }).subscribe({
      next: (res: any) => {
        this.getUserData(
          () => {
            this.googleLoading.set(false)
            this.alertService.addAlert({
              message: res.message,
              type: 'success'
            })
            this.isLoggedin.set(true)
            this.refreshEventLoop(this.config.accessTokenExpire)
            this.router.navigate(['/home'])
          },
          () => { this.googleLoading.set(false) }
        )
      },
      error: (err: any) => {
        this.googleLoading.set(false);
        this.setErrors(err.error)
      }
    })
  }

  getUserData(successFn?: () => void, faildFn?: () => void) {
    this.error.set([])

    this.http.get(`${this.config.apiUrl}/api/auth/me/`, { withCredentials: true }).subscribe({
      next: (res: any) => {
        this.userData.set(res)
        if(successFn) successFn()
      },
      error: (err: any) => {
        if(faildFn) faildFn()

        this.setErrors(err.error)
        this.logout()
      }
    })
  }

  logout(logoutAction?: (message?: string) => void) {
    this.error.set([])

    this.http.post(`${this.config.apiUrl}/api/auth/logout/`, {}, { withCredentials: true }).subscribe({
      next: (res: any) => {
        if(logoutAction) logoutAction(res.message)
        this.resetDataLogout()
        this.stopRefreshEventLoop()
      },
      error: (err: any) => { if(logoutAction) logoutAction() }
    })
  }

  resetDataLogout() {
    this.userData.set(null)
    this.isLoggedin.set(false)
  }

  verifyAccess() {
    this.error.set([])

    this.http.post(`${this.config.apiUrl}/api/auth/token/verify/`, {}, { withCredentials: true }).subscribe({
      next: (res: any) => {
        this.getUserData(
          () => {
            this.isLoggedin.set(true)

            this.verifyloading.set(false)
            this.refreshEventLoop(this.config.accessTokenExpire)
          },
          () => { this.verifyloading.set(false) }
        )
      },
      error: (err: any) => {
        this.refreshToken()
      }
    })
  }

  refreshToken() {
    this.error.set([])

    this.http.post(`${this.config.apiUrl}/api/auth/token/refresh/`, {}, { withCredentials: true }).subscribe({
      next: (res: any) => {
        console.log(res)
        this.getUserData(
          () => {
            this.isLoggedin.set(true)
            this.verifyloading.set(false)
            this.refreshEventLoop(this.config.accessTokenExpire)
          },
          () => { this.verifyloading.set(false) }
        )
      },
      error: (err: any) => {
        this.logout(
          () => { this.verifyloading.set(false) }
        )
      }
    })
  }

  private refreshIntervalId: any = null;
  refreshEventLoop(intervalMinutes: number = 10): void {
    this.stopRefreshEventLoop()

    console.log('started refresh token')
    const intervalMs = intervalMinutes * 60 * 1000;

    this.refreshIntervalId = setInterval(() => {
      console.log('refreshing token')
      this.refreshToken();
    }, intervalMs);
  }

  stopRefreshEventLoop(): void {
    if (this.refreshIntervalId) {
      clearInterval(this.refreshIntervalId);
      this.refreshIntervalId = null;
    }
  }

  readonly passwordResetLoading = signal<boolean>(false)
  passwordReset(body: {email: string}, fn: () => void) {
    this.http.post(`${this.config.apiUrl}/api/auth/password-reset-link/`, body).subscribe({
      next: (res: any) => {
        console.log(res)
        this.alertService.addAlert({
          message: res.message,
          type: 'success'
        })
        this.passwordResetLoading.set(false)
        fn()
      },
      error: (err: any) => {
        console.log(err)
        this.setErrors(err.error)
        this.passwordResetLoading.set(false)
      }
    })
  }

  readonly passwordResetConfirmLoading = signal<boolean>(false)
  passwordResetConfirm(body: any) {
    this.http.post(`${this.config.apiUrl}/api/auth/password-reset-confirm/`, body).subscribe({
      next: (res: any) => {
        console.log(res)
        this.alertService.addAlert({
          message: res.message,
          type: 'success'
        })
        this.router.navigate(['/login'])
        this.passwordResetConfirmLoading.set(false)
      },
      error: (err: any) => {
        console.log(err)
        this.setErrors(err.error)
        this.passwordResetConfirmLoading.set(false)
      }
    })
  }

  setErrors(errorObject: any) {
    const errors = this.extractorService.extract(errorObject)
    this.error.update((v: string[]) => [...v, ...errors]);
    this.alertService.bulkAlert(errors, { type: 'danger' });
  }
}
