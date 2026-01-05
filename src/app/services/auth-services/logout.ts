import { inject, Injectable, Injector } from '@angular/core';
import { UserSharedUtils } from './user-shared-utils';
import { Token } from './token';
import { ChatsService } from '../chats-service';

@Injectable({
  providedIn: 'root',
})
export class Logout {
  private readonly injector = inject(Injector);
  private get userShared(): UserSharedUtils { return this.injector.get(UserSharedUtils); }
  private get token(): Token { return this.injector.get(Token); }

  readonly chatsService: ChatsService = inject(ChatsService);

  private readonly logoutURL = `${this.userShared.config.apiUrl}/api/auth/logout/`;

  logout(logoutAction?: (message?: string) => void) {
    this.userShared.shared.http.post(this.logoutURL, {}, { withCredentials: true }).subscribe({
      next: (res: any) => {
        if(logoutAction) logoutAction(res.message)
        this.resetDataLogout();
        this.token.stopRefreshEventLoop();
      },
      error: (err: any) => { if(logoutAction) logoutAction() }
    })
  }

  resetDataLogout() {
    this.userShared.userData.set(null);
    this.userShared.isLoggedin.set(false);
    this.chatsService.chats.set([]);
    this.chatsService.disconnectChats();
  }
}
