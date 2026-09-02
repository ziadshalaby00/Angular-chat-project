import { AuthApi } from '../../services/auth-services/auth-api';
import { Component, effect, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { Button, Card, Input, Checkbox } from '@ziadshalaby/ngx-zs-component';
import { Router } from '@angular/router';
import { Or } from '../../other-components/or/or';
import { email, form, FormField, required, validate, minLength } from '@angular/forms/signals';

@Component({
  selector: 'app-signup',
  imports: [
    Card,
    Input,
    Button,
    Or,
    FormField,
    Checkbox
],
  templateUrl: './signup.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './signup.css',
})
export class Signup {
  readonly authApi: AuthApi = inject(AuthApi);
  readonly router: Router = inject(Router);
  
  ngAfterViewInit() {
    this.authApi.initCodeClient()
  }

  // Form fields signals
  readonly model = signal({
    fullname: '',
    username: '',
    email: '',
    password: '',
    conf_password: '',
    terms: false
  })

  readonly form = form(this.model, (schema) => {
    required(schema.fullname, {message: 'username is required.'});
    required(schema.username, {message: 'username is required.'});
    required(schema.terms, {message: 'you should agree.'});
    required(schema.email, {message: 'username is required.'});
    email(schema.email, { message: 'Enter a valid email address' });
    required(schema.password, {message: 'username is required.'});
    minLength(schema.password, 8, {message: 'it must contain at least 8.'});
    required(schema.conf_password, {message: 'username is required.'});
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

  submit(event: SubmitEvent) {
    event.preventDefault();

    this.form().markAsTouched();

    const invalid = this.form().invalid();
    if(invalid) return;

    const data = this.model()

    this.authApi.signupLoading.set(true)
    this.authApi.signup(data)
  }

  google() {
    this.authApi.googleLoading.set(true)
    this.authApi.startRequestCode()
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
