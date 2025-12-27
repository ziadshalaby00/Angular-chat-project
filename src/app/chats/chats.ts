import { Component, effect, inject } from '@angular/core';
import { AuthApi } from '../services/auth-services/auth-api';
import { Router } from '@angular/router';
import { Sidebar, Input, Card } from '@ziadshalaby/ngx-zs-component';
import { Chat } from "../chat/chat";

@Component({
  selector: 'app-chats',
  imports: [Sidebar, Input, Card, Chat],
  templateUrl: './chats.html',
  styleUrl: './chats.css',
})
export class Chats {
  readonly authApi: AuthApi = inject(AuthApi);
  readonly router: Router = inject(Router);

  constructor() {
    effect(() => {
      const isLoggedin = this.authApi.isLoggedin()

      if(!isLoggedin) {
        this.router.navigate(['/login'])
      }
    })
  }

  onSearchForChat(event: any) {
    console.log(event);
  }
}
