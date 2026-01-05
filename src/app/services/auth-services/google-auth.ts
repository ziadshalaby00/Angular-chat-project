import { inject, Injectable, Injector, signal } from '@angular/core';
import { UserSharedUtils } from './user-shared-utils';
import { Auth } from './auth';

declare const google: any;
export const googleClientId: string = 
  '376492260397-n5gnu7445umh0vut3a1tl06an5aoc186.apps.googleusercontent.com'

@Injectable({
  providedIn: 'root',
})
export class GoogleAuth {
  private readonly injector = inject(Injector);
  private get userShared(): UserSharedUtils { return this.injector.get(UserSharedUtils); }
  private get auth(): Auth { return this.injector.get(Auth); }

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
      this.userShared.shared.alertService.addAlert({
        message: 'Google authentication not initialized.',
        type: 'danger'
      });
      this.userShared.googleLoading.set(false);
      return;
    }
    client.requestCode();
  }

  private handleGoogleResponse(response: any) {
    const code = response.code;
    if (code) {
      this.auth.googleExchange(code);
    } else {
      this.userShared.googleLoading.set(false);
    }
  }
}
