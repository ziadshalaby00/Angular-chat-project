import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { AuthApi } from '../../services/auth-services/auth-api';
import { Button, Field, FieldInputStyle } from '@ziadshalaby/ngx-zs-component';
import { form, required, email, FormField, minLength } from '@angular/forms/signals';


@Component({
  selector: 'app-resend-ver-link',
  imports: [FormField, Button, Field, FieldInputStyle],
  templateUrl: './resend-ver-link.html',
  changeDetection: ChangeDetectionStrategy.Eager,
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
