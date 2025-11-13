import { AuthApi } from './../services/auth-services/auth-api';
import { Component, effect, inject, viewChild } from '@angular/core';
import { Button, Card, ChangeEventType, Form, Input, ValidatorFn } from '@ziadshalaby/ngx-zs-component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [
    Card,
    Input,
    Button
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  readonly authApi: AuthApi = inject(AuthApi);
  readonly router: Router = inject(Router);
  
  ngAfterViewInit() {
    this.authApi.initCodeClient()
  }
  
  readonly pass = viewChild<Input>('password')
  readonly conf_pass = viewChild<Input>('conf_password')

  // Form fields signals
  form = new Form({
    fullname: '',
    username: '',
    email: '',
    password: '',
    conf_password: ''
  })

  changeValues(event: ChangeEventType, key: keyof typeof this.form.fields) {
    this.form.set(key, event.value, event.valid);

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

  confPassValidate: ValidatorFn = (value: string | null) => {
    if(this.form.get('password').value !== value)
      return ['The passwords do not match.']
    return []
  }

  submit(event: SubmitEvent) {
    event.preventDefault();
    this.form.submit((values) => {
      this.authApi.signupLoading.set(true)
      this.authApi.signup(values)
    });
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
