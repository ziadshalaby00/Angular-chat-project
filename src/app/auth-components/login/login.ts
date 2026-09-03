import { Component, effect, inject, signal, TemplateRef, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { Button, Card, Input, Modal } from '@ziadshalaby/ngx-zs-component';
import { Router } from '@angular/router';
import { AuthApi } from '../../services/auth-services/auth-api';
import { Or } from '../../other-components/or/or';
import { email, form, FormField, required } from '@angular/forms/signals';

@Component({
  selector: 'app-login',
  imports: [
    Card,
    Input,
    Button,
    Modal,
    Or,
    FormField,
],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './login.css',
})
export class Login {
  readonly authApi: AuthApi = inject(AuthApi);
  readonly router: Router = inject(Router);

  readonly loaderIconTpl = viewChild<TemplateRef<any>>('loaderIcon');

  ngAfterViewInit() {
    this.authApi.initCodeClient()
  }

  readonly loginModel = signal({
    username: '',
    password: ''
  })

  readonly loginForm = form(this.loginModel,  (schema) => {
    required(schema.username, {message: 'username is required.'});
    required(schema.password, {message: 'password is required.'});
  })

  submit(event: SubmitEvent) {
    event.preventDefault();

    this.loginForm().markAsTouched();

    const invalid = this.loginForm().invalid();
    if(invalid) return;

    const data = this.loginModel();

    this.authApi.loginLoading.set(true);
    this.authApi.login(data);
  }

  google() {
    this.authApi.googleLoading.set(true);
    this.authApi.startRequestCode();
  }

  // Password Reset
  readonly passwordResetModal = signal<boolean>(false)
  readonly passwordResetModel = signal({
    email: ''
  })

  readonly passwordResetForm = form(this.passwordResetModel, (schema) => {
    required(schema.email, {message: 'email is required.'});
    email(schema.email, { message: 'Enter a valid email address' });
  });

  confirmPasswordReset() {
    this.passwordResetForm().markAsTouched();

    const invalid = this.passwordResetForm().invalid();
    if(invalid) return;
    
    const data = this.passwordResetModel();

    this.authApi.passwordResetLoading.set(true);
    this.authApi.passwordReset(data, () => { this.passwordResetModal.set(false) });
  }

  constructor() {
    effect(() => {
      const isLoggedin = this.authApi.isLoggedin()

      if(isLoggedin) {
        this.router.navigate(['/home'])
      }
    })
  }

  goToResendVerEmail() {
    this.router.navigate(['/verify-email/NULL/NULL'])
  }
}
