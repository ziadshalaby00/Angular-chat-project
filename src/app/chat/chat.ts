import { Component, effect, inject } from '@angular/core';
import { AuthApi } from '../services/auth-services/auth-api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  imports: [],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat {
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
