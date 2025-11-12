import { inject, Injectable, Injector } from '@angular/core';
import { SharedUtils } from './shared-utils';
import { User } from './user';
import { Token } from './token';

@Injectable({
  providedIn: 'root',
})
export class AccessVerification {
  private readonly injector = inject(Injector);
  private get shared(): SharedUtils { return this.injector.get(SharedUtils); }
  private get user(): User { return this.injector.get(User); }
  private get token(): Token { return this.injector.get(Token); }

  private readonly verifyURL = `${this.shared.config.apiUrl}/api/auth/token/verify/`
  
  verifyAccess() {
    this.shared.error.set([]);

    return new Promise((resolve, reject) => {
      this.shared.http.post(this.verifyURL, {}, { withCredentials: true }).subscribe({
        next: (res: any) => {
          this.user.me(
            () => {
              this.shared.isLoggedin.set(true);
              this.token.refreshEventLoop(this.shared.accessTokenExpire);
              resolve(true);
            },
            () => resolve(true)
          )
        },
        error: (err: any) => {
          this.token.refreshToken().then(() => resolve(true));
        }
      })
    })
  }

}
