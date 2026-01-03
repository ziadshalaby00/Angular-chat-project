import { Component, effect, inject, signal } from '@angular/core';
import { AuthApi } from '../services/auth-services/auth-api';
import { Router } from '@angular/router';
import { Sidebar, Input, Card, AlertService, Button, Spinner } from '@ziadshalaby/ngx-zs-component';
import { Chat } from "../chat/chat";
import { ChatsService } from '../services/chats-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chats',
  imports: [Sidebar, Input, Card, Chat, Button, Spinner, CommonModule],
  templateUrl: './chats.html',
  styleUrl: './chats.css',
})
export class Chats {
  readonly authApi: AuthApi = inject(AuthApi);
  readonly chatsService: ChatsService = inject(ChatsService);
  
  readonly router: Router = inject(Router);
  readonly alert: AlertService = inject(AlertService);

  readonly sideBarFloating = signal<boolean>(false);
  private readonly mediaQuery = window.matchMedia('(min-width: 768px)');

  constructor() {
    this.chatsService.chatsLoading.set(true);
    this.chatsService.getChats();
    
    effect(() => {
      const isLoggedin = this.authApi.isLoggedin()

      if(!isLoggedin) {
        // this.router.navigate(['/login']);
        this.alert.addAlert({
          message: 'You need to log in first.',
          type: 'info'
        })
      }
    })

    this.sideBarFloating.set(!this.mediaQuery.matches);
    this.mediaQuery.addEventListener('change', this.onMediaChange);
  }

  private readonly onMediaChange = (event: MediaQueryListEvent) => {
    this.sideBarFloating.set(!event.matches);
  };

  ngOnDestroy() {
    this.mediaQuery.removeEventListener('change', this.onMediaChange);
  }

  onSearchForChat(event: any) {
    console.log(event);
  }
}
