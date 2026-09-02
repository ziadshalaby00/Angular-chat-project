import { Component, inject, viewChild, ChangeDetectionStrategy, signal } from '@angular/core';
import { Card, Input, Button } from '@ziadshalaby/ngx-zs-component';
import { ActivatedRoute } from '@angular/router';
import { AuthApi } from '../../services/auth-services/auth-api';
import { form, FormField, required, validate } from '@angular/forms/signals';

@Component({
  selector: 'app-reset-password',
  imports: [Card, Input, Button, FormField],
  templateUrl: './reset-password.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './reset-password.css',
})
export class ResetPassword {
  readonly authApi: AuthApi = inject(AuthApi);
  readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  readonly pass = viewChild<Input>('pass')
  readonly conf_pass = viewChild<Input>('conf_pass')

  readonly model = signal({
    new_password: '',
    conf_pass: '',
  })

  readonly form = form(this.model, (schema) => {
    required(schema.new_password, {message: 'new password is required.'});
    required(schema.conf_pass, {message: 'confirm password is required.'});
    validate(schema.conf_pass, (ctx) => {
      const [new_password, conf_pass] = [ctx.valueOf(schema.new_password), ctx.value()];

      if (conf_pass !== new_password) {
        return {
          kind: 'passwordMismatch',
          message: 'The passwords do not match.'
        };
      }

      return null;
    });
  })

  submit(event: SubmitEvent) {
    event.preventDefault();

    this.form().markAsTouched();

    const invalid = this.form().invalid();
    if(invalid) return;

    const newPassword = this.model().new_password;

    const urlParams = this.activatedRoute.snapshot.paramMap
    const body = {
      new_password: newPassword,
      uid: urlParams.get('uid'),
      token: urlParams.get('token'),
    }

    this.authApi.passwordResetConfirmLoading.set(true);
    this.authApi.passwordResetConfirm(body);
  }
}
