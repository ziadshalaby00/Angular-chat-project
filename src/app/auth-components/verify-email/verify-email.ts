import { Component, inject, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { AuthApi } from '../../services/auth-services/auth-api';
import { ActivatedRoute, Router } from '@angular/router';
import { Spinner } from '@ziadshalaby/ngx-zs-component';
import { ResendVerLink } from '../resend-ver-link/resend-ver-link';


@Component({
  selector: 'app-verify-email',
  imports: [Spinner, ResendVerLink],
  templateUrl: './verify-email.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './verify-email.css',
})
export class VerifyEmail {
  readonly authApi: AuthApi = inject(AuthApi);
  readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  readonly router: Router = inject(Router);

  readonly body = signal<{uid: string, token: string}>({uid: 'NULL', token: 'NULL'});
  readonly isBodyNull = computed<boolean>(() => (this.body().uid === 'NULL'|| this.body().token  === 'NULL'))
  
  constructor() {
    const urlParams = this.activatedRoute.snapshot.paramMap
    this.body.set({
      uid: urlParams.get('uid') ?? '',
      token: urlParams.get('token') ?? '',
    })
    if(this.isBodyNull()) return;

    this.authApi.verifyEmailLoading.set(true);
    this.authApi.verifyEmail(this.body(), () => {
      this.router.navigate(['/login']);
    });
  }

  ngOnDestroy() {
    this.authApi.verifyEmailError.set(false);
  }
}

