import { Component, effect, inject, input, model, signal, TemplateRef, viewChild, WritableSignal, ChangeDetectionStrategy } from '@angular/core';
import { Modal, Input } from '@ziadshalaby/ngx-zs-component';
import { AuthApi } from '../../services/auth-services/auth-api';
import { form, FormField, required, validate, minLength } from '@angular/forms/signals';

@Component({
  selector: 'app-profile-change-password',
  imports: [Modal, Input, FormField],
  templateUrl: './profile-change-password.html',
  styleUrl: './profile-change-password.css',
})
export class ProfileChangePassword {
  readonly authApi: AuthApi = inject(AuthApi);

  readonly handleCloseSuccess = input<(modalToClose?: WritableSignal<boolean>) => void>();
  readonly handleCloseFail = input<() => void>();

  readonly loaderIconTpl = viewChild<TemplateRef<any>>('loaderIcon');
  
  constructor() {

  }

  // ================================= Change Password ================================= //
  readonly openChangePassModal = model<boolean>(false);
  readonly changePassModel = signal({
    old_password: '',
    password: '',
    conf_password: ''
  })

  readonly changePassForm = form(this.changePassModel, (schema) => {
    required(schema.old_password, {message: 'old password is required.'});

    required(schema.password, {message: 'new password is required.'});
    minLength(schema.password, 8, {message: 'it must contain at least 8.'});

    required(schema.conf_password, {message: 'confirm password is required.'});
    validate(schema.conf_password, (ctx) => {
        const [password, conf_pass] = [ctx.valueOf(schema.password), ctx.value()];

        if (conf_pass !== password) {
        return {
            kind: 'passwordMismatch',
            message: 'The passwords do not match.'
        };
        }

        return null;
    });
  })
  

  changePass() {
    this.changePassForm().markAsTouched();

    const invalid = this.changePassForm().invalid();
    if(invalid) return;

    const data = this.changePassModel();

    this.authApi.updateProfileLoading.set(true);
    this.authApi.updateProfile(
        data,
        () => {
            this.handleCloseSuccess()?.(this.openChangePassModal);
            this.authApi.logout(undefined, 'login');
        },
        this.handleCloseFail()
    );
  }
  // =================================/ Change Password /================================= //
}
