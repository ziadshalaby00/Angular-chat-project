import { Component, inject, input, model, signal, viewChild, WritableSignal } from '@angular/core';
import { Modal, Input, Form, ValidatorFn, ChangeEventType } from '@ziadshalaby/ngx-zs-component';
import { AuthApi } from '../services/auth-services/auth-api';

@Component({
  selector: 'app-profile-change-password',
  imports: [Modal, Input],
  templateUrl: './profile-change-password.html',
  styleUrl: './profile-change-password.css',
})
export class ProfileChangePassword {
  readonly authApi: AuthApi = inject(AuthApi);

  readonly handleCloseSc = input<(modalToClose?: WritableSignal<boolean>) => () => void>()
  readonly handleCloseFd = input<() => void>()
  
  // ================================= Change Password ================================= //
  readonly openChangePassModal = model<boolean>(false);
  readonly changePassForm = new Form({
    old_password: '',
    password: '',
    conf_password: ''
  })

  readonly pass = viewChild<Input>('password')
  readonly conf_pass = viewChild<Input>('conf_password')

  confPassValidate: ValidatorFn = (value: string | null) => {
    if(this.changePassForm.get('password').value !== value)
      return ['The passwords do not match.']
    return []
  }

  changeChPassValues(event: ChangeEventType, key: keyof typeof this.changePassForm.fields) {
    this.changePassForm.set(key, event.value, event.valid);

    if (event.fromForce) return;
    
    if (key === 'password') {
      const conf = this.conf_pass();
      if (conf) conf.forceChange();
    }

    if (key === 'conf_password') {
      const pass = this.pass();
      if (pass) pass.forceChange();
    }
  }

  changePass() {
    this.changePassForm.submit((values) => {
      this.authApi.updateProfileLoading.set(true);
      this.authApi.updateProfile(
        values,
          this.handleCloseSc()?.(this.openChangePassModal),
          this.handleCloseFd()
      );
    });
  }
  // =================================/ Change Password /================================= //
}
