import { inject, Injectable, Injector } from '@angular/core';
import { SharedUtils } from './shared-utils';
import { User } from './user';
import { Logout } from './logout';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Token {
  private readonly injector = inject(Injector);
  private get shared(): SharedUtils { return this.injector.get(SharedUtils); }
  private get user(): User { return this.injector.get(User); }
  private get logout(): Logout { return this.injector.get(Logout); }

  private readonly refreshTokenURL = `${this.shared.config.apiUrl}/api/auth/token/refresh/`;

  async refreshToken(): Promise<boolean> {
    try {
      await firstValueFrom(
        this.shared.config.http.post(this.refreshTokenURL, {}, { withCredentials: true })
      );

      await new Promise<void>((resolve) => {
        this.user.me(
          () => {
            this.shared.isLoggedin.set(true);
            this.refreshEventLoop(this.shared.accessTokenExpire);
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
