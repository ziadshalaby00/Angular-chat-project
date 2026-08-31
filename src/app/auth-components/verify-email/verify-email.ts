import { Component, inject } from '@angular/core';
import { AuthApi } from '../../services/auth-services/auth-api';
import { ActivatedRoute, Router } from '@angular/router';
import { Spinner } from '@ziadshalaby/ngx-zs-component';
import { ResendVerLink } from '../resend-ver-link/resend-ver-link';


@Component({
  selector: 'app-verify-email',
  imports: [Spinner, ResendVerLink],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css',
})
export class VerifyEmail {
  readonly authApi: AuthApi = inject(AuthApi);
  readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  readonly router: Router = inject(Router);
  
  constructor() {
    const urlParams = this.activatedRoute.snapshot.paramMap
    const body: {uid: string, token: string} = {
      uid: urlParams.get('uid') ?? '',
      token: urlParams.get('token') ?? '',
    }
    this.authApi.verifyEmailLoading.set(true);
    this.authApi.verifyEmail(body, () => {
      this.router.navigate(['/login']);
    });
  }
}

