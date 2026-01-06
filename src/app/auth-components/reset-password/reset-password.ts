import { Component, inject, viewChild } from '@angular/core';
import { Card, Input, Button, ChangeEventType, Form, ValidatorFn } from '@ziadshalaby/ngx-zs-component';
import { ActivatedRoute } from '@angular/router';
import { AuthApi } from '../../services/auth-services/auth-api';

@Component({
  selector: 'app-reset-password',
  imports: [Card, Input, Button],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {
  readonly authApi: AuthApi = inject(AuthApi);
  readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  readonly pass = viewChild<Input>('pass')
  readonly conf_pass = viewChild<Input>('conf_pass')

  readonly form = new Form({
    new_password: '',
    conf_pass: '',
  })

  changeValues(event: ChangeEventType, key: keyof typeof this.form.fields) {
    this.form.set(key, event.value, event.valid);

    if (event.fromForce) return;
    
    if (key === 'new_password') {
      const conf = this.conf_pass();
      if (conf) conf.forceChange();
    }

    if (key === 'conf_pass') {
      const pass = this.pass();
      if (pass) pass.forceChange();
    }
  }

  confPassValidate: ValidatorFn = (value: string | null) => {
    const conf_pass = this.form.get('new_password')
    if(conf_pass.value !== value) {
      return ['The passwords do not match.']
    }
    return []
  }

  submit(event: SubmitEvent) {
    event.preventDefault();

    this.form.submit((values) => {
      const urlParams = this.activatedRoute.snapshot.paramMap
      const body = {
        new_password: values.new_password,
        uid: urlParams.get('uid'),
        token: urlParams.get('token'),
      }

      this.authApi.passwordResetConfirmLoading.set(true);
      this.authApi.passwordResetConfirm(body);
    })
  }
}
