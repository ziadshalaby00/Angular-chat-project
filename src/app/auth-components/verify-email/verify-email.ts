import { Component, inject, signal, WritableSignal } from '@angular/core';
import { AuthApi } from '../../services/auth-services/auth-api';
import { ActivatedRoute, Router } from '@angular/router';
import { Button, Input, Spinner } from '@ziadshalaby/ngx-zs-component';
import { form, required, email } from '@angular/forms/signals';

@Component({
  selector: 'app-verify-email',
  imports: [Spinner, Button],
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

  emailModel = signal('');
  emailForm = form(this.emailModel, (schema: any) => {
    required(schema);
    email(schema);
  });

  resendVerificationEmail() { 
    if (this.emailForm().invalid()) {
      return;
    }

    const email = this.emailModel();
  }
}

