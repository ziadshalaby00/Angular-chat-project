import { inject, Injectable, Injector } from '@angular/core';
import { UserSharedUtils } from './user-shared-utils';
import { User } from './user';
import { Logout } from './logout';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Token {
  private readonly injector = inject(Injector);
  private get userShared(): UserSharedUtils { return this.injector.get(UserSharedUtils); }
  private get user(): User { return this.injector.get(User); }
  private get logout(): Logout { return this.injector.get(Logout); }

  private readonly refreshTokenURL = `${this.userShared.config.apiUrl}/api/auth/token/refresh/`;

  async refreshToken(): Promise<boolean> {
    try {
      await firstValueFrom(
        this.userShared.shared.http.post(this.refreshTokenURL, {}, { withCredentials: true })
      );

      await new Promise<void>((resolve) => {
        this.user.me(
          () => {
            this.userShared.isLoggedin.set(true);
            this.refreshEventLoop(this.userShared.accessTokenExpire);
            resolve();
          },
          () => resolve()
        );
      });

      console.log('Refreshed Token Done');
      return true;

    } catch (err) {
      console.warn('refreshToken failed', err);

      await new Promise<void>((resolve) => this.logout.logout(() => resolve()));

      return true;
    }
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
