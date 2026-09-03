import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthApi } from '../auth-services/auth-api';
import { ChatsService } from '../chats-service/chats-service';

@Injectable({
  providedIn: 'root',
})
export class InitAppService {
  private readonly authApi: AuthApi = inject(AuthApi);
  private readonly chatsService: ChatsService = inject(ChatsService);

  private readonly router: Router = inject(Router);
  private readonly stopInit = signal<boolean>(false);
  
  public initApp(reRouting: string) {
    if(this.stopInit()) return;
    this.startInit(reRouting);
  }

  private async startInit(reRouting: string) {
    this.authApi.verifyloading.set(true);

    await this.authApi.getCsrfToken();
    await this.authApi.verifyAccess();

    this.stopInit.set(true);
    this.authApi.verifyloading.set(false);

    if(this.authApi.isLoggedin()) {
      this.startingInitChats();
    }
    
    this.router.navigate([reRouting], {
      replaceUrl: true
    });
  }

  startingInitChats() {
    if(!this.chatsService.hasChats()) {
      this.chatsService.chatsLoading.set(true);
      this.chatsService.getChats();
    }
    if(!this.chatsService.isChatSocketConnected()) {
      this.chatsService.connectChats();
    }
  }
}
