import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthApi } from './auth-services/auth-api';
import { AccessVerification } from './auth-services/access-verification';

@Injectable({
  providedIn: 'root',
})
export class InitAppService {
  private readonly authApi: AuthApi = inject(AuthApi);

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
    this.router.navigate([reRouting]);
  }
}
