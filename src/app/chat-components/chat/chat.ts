import { Component, effect, inject, model } from '@angular/core';
import { AuthApi } from '../../services/auth-services/auth-api';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  imports: [CommonModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat {
  // readonly authApi: AuthApi = inject(AuthApi);
  // readonly router: Router = inject(Router);

  // constructor() {
  //   effect(() => {
  //     const isLoggedin = this.authApi.isLoggedin()

  //     if(!isLoggedin) {
  //       this.router.navigate(['/login'])
  //     }
  //   })
  // }

  readonly openSide = model<boolean>(true);
}
