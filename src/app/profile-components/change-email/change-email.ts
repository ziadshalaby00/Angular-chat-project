import { Component, model, input, WritableSignal, viewChild, TemplateRef, inject, signal } from '@angular/core';
import { Input, Modal } from '@ziadshalaby/ngx-zs-component';
import { AuthApi } from '../../services/auth-services/auth-api';
import { email, form, required, FormField } from '@angular/forms/signals';

@Component({
  imports: [Modal, Input, FormField],
  selector: 'app-change-email',
  styleUrl: './change-email.css',
  templateUrl: './change-email.html',
})
export class ChangeEmail {
  readonly authApi: AuthApi = inject(AuthApi);
  readonly openChangeEmailModal = model<boolean>(false);

  readonly handleCloseSuccess = input<(modalToClose?: WritableSignal<boolean>) => void>();
  readonly handleCloseFail = input<() => void>();

  readonly loaderIconTpl = viewChild<TemplateRef<any>>('loaderIcon');

  changeEmailModel = signal({
    email: ''
  });
  changeEmailForm = form(this.changeEmailModel, (schema) => {
    required(schema.email, { message: 'Email is required' });
    email(schema.email, { message: 'Enter a valid email address' });
  });

  changeEmail() { 
    this.changeEmailForm().markAsTouched();
    
    if (this.changeEmailForm().invalid()) {
      return;
    }

    this.authApi.resendverifyEmailLoading.set(true);

    const email = this.changeEmailModel().email;
    this.authApi.updateProfileLoading.set(true);
    this.authApi.changeEmail(
      email,
      () => this.handleCloseSuccess()?.(this.openChangeEmailModal),
      this.handleCloseFail()
    );
  }
}
