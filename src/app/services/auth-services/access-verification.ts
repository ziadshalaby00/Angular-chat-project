import { inject, Injectable, Injector } from '@angular/core';
import { SharedUtils } from './shared-utils';
import { User } from './user';
import { Token } from './token';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccessVerification {
  private readonly injector = inject(Injector);
  private get shared(): SharedUtils { return this.injector.get(SharedUtils); }
  private get user(): User { return this.injector.get(User); }
  private get token(): Token { return this.injector.get(Token); }

  private readonly verifyURL = `${this.shared.config.apiUrl}/api/auth/token/verify/`
  
  async verifyAccess(): Promise<boolean> {
    try {
      await firstValueFrom(
        this.shared.config.http.post(this.verifyURL, {}, { withCredentials: true })
      );

      await new Promise<void>((resolve) => {
        this.user.me(
          () => {
            this.shared.isLoggedin.set(true);
            this.token.refreshEventLoop(this.shared.accessTokenExpire);
            resolve();
          },
          () => resolve()
        );
      });

      return true;

    } catch (err) {
      console.warn('verifyAccess failed, trying refresh token', err);

      try {
        await this.token.refreshToken();
      } catch (refreshErr) {
        console.error('refreshToken failed', refreshErr);
      }
      
      return true;
    }
  }
}
