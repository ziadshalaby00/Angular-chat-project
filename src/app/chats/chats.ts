import { Component, effect, inject } from '@angular/core';
import { AuthApi } from '../services/auth-services/auth-api';
import { Router } from '@angular/router';
import { Sidebar, Input, Card } from '@ziadshalaby/ngx-zs-component';

@Component({
  selector: 'app-chats',
  imports: [Sidebar, Input, Card],
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
}
