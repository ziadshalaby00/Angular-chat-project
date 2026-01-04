import { inject, Injectable, Injector } from '@angular/core';
import { SharedUtils } from './shared-utils';
import { Token } from './token';
import { ChatsService } from '../chats-service';

@Injectable({
  providedIn: 'root',
})
export class Logout {
  private readonly injector = inject(Injector);
  private get shared(): SharedUtils { return this.injector.get(SharedUtils); }
  private get token(): Token { return this.injector.get(Token); }

  readonly chatsService: ChatsService = inject(ChatsService);

  private readonly logoutURL = `${this.shared.config.apiUrl}/api/auth/logout/`;

  logout(logoutAction?: (message?: string) => void) {
    this.shared.config.http.post(this.logoutURL, {}, { withCredentials: true }).subscribe({
      next: (res: any) => {
        if(logoutAction) logoutAction(res.message)
        this.resetDataLogout();
        this.token.stopRefreshEventLoop();
      },
      error: (err: any) => { if(logoutAction) logoutAction() }
    })
  }

  resetDataLogout() {
    this.shared.userData.set(null);
    this.shared.isLoggedin.set(false);
    this.chatsService.chats.set([]);
    this.chatsService.disconnectChats();
  }
}
