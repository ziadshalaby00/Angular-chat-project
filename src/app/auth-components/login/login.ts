import { Component, effect, inject, signal, TemplateRef, viewChild } from '@angular/core';
import { Button, Card, ChangeEventType, Form, Input, Modal } from '@ziadshalaby/ngx-zs-component';
import { Router } from '@angular/router';
import { AuthApi } from '../../services/auth-services/auth-api';
import { Or } from '../../other-components/or/or';

@Component({
  selector: 'app-login',
  imports: [
    Card,
    Input,
    Button,
    Modal,
    Or
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  readonly authApi: AuthApi = inject(AuthApi);
  readonly router: Router = inject(Router);

  readonly loaderIconTpl = viewChild<TemplateRef<any>>('loaderIcon');

  ngAfterViewInit() {
    this.authApi.initCodeClient()
  }

  readonly form = new Form({
    username: '',
    password: ''
  })

  changeValues(event: ChangeEventType, key: keyof typeof this.form.fields) {
    this.form.set(key, event.value, event.valid );
  }

  submit(event: SubmitEvent) {
    event.preventDefault();
    this.form.submit((values) => {
      this.authApi.loginLoading.set(true)
      this.authApi.login(values)
    })
  }

  google() {
    this.authApi.googleLoading.set(true)
    this.authApi.startRequestCode()
  }

  // Password Reset

  readonly passwordResetModal = signal<boolean>(false)
  readonly passwordResetForm = new Form({
    email: ''
  })

  chanegEmailValue(event: ChangeEventType) {
    this.passwordResetForm.set('email', event.value, event.valid);
  }

  confirmPasswordReset() {
    this.passwordResetForm.submit((values) => {
      this.authApi.passwordResetLoading.set(true)
      this.authApi.passwordReset(values, () => { this.passwordResetModal.set(false) })
    })
  }

  constructor() {
    effect(() => {
      const isLoggedin = this.authApi.isLoggedin()

      if(isLoggedin) {
        this.router.navigate(['/home'])
      }
    })
  }
}
