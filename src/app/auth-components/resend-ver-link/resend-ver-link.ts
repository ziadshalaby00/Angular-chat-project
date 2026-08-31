import { Component, inject, signal } from '@angular/core';
import { AuthApi } from '../../services/auth-services/auth-api';
import { Button } from '@ziadshalaby/ngx-zs-component';
import { form, required, email, FormField, minLength } from '@angular/forms/signals';


@Component({
  selector: 'app-resend-ver-link',
  imports: [FormField, Button],
  templateUrl: './resend-ver-link.html',
  styleUrl: './resend-ver-link.css',
})
export class ResendVerLink {
  readonly authApi: AuthApi = inject(AuthApi);

  emailModel = signal({
    email: ''
  });
  emailForm = form(this.emailModel, (schema) => {
    required(schema.email, { message: 'Email is required' });
    email(schema.email, { message: 'Enter a valid email address' });
  });

  resendVerificationEmail() { 
    if (this.emailForm().invalid()) {
      return;
    }

    this.authApi.resendverifyEmailLoading.set(true);

    const email = this.emailModel().email;
    this.authApi.resendVerifyEmail(email);
  }
}
