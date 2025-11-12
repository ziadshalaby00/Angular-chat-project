import { inject, Injectable, Injector } from '@angular/core';
import { SharedUtils } from './shared-utils';
import { User } from './user';
import { Logout } from './logout';

@Injectable({
  providedIn: 'root',
})
export class Token {
  private readonly injector = inject(Injector);
  private get shared(): SharedUtils { return this.injector.get(SharedUtils); }
  private get user(): User { return this.injector.get(User); }
  private get logout(): Logout { return this.injector.get(Logout); }

  private readonly refreshTokenURL = `${this.shared.config.apiUrl}/api/auth/token/refresh/`;

  refreshToken() {
    this.shared.error.set([]);

    return new Promise((resolve, reject) => {
      this.shared.http.post(this.refreshTokenURL, {}, { withCredentials: true }).subscribe({
        next: (res: any) => {
          this.user.me(
            () => {
              this.shared.isLoggedin.set(true);
              this.refreshEventLoop(this.shared.accessTokenExpire);
              resolve(true);
            },
            () => resolve(true)
          )
        },
        error: (err: any) => {
          this.logout.logout(() => resolve(true));
        }
      })
    })
  }

  private refreshIntervalId: any = null;
  refreshEventLoop(intervalMinutes: number = 10): void {
    this.stopRefreshEventLoop();

    const intervalMs = intervalMinutes * 60 * 1000;

    this.refreshIntervalId = setInterval(() => {
      this.refreshToken();
    }, intervalMs);
  }

  stopRefreshEventLoop(): void {
    if (this.refreshIntervalId) {
      clearInterval(this.refreshIntervalId);
      this.refreshIntervalId = null;
    }
  }
}
