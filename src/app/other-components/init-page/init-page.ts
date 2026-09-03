import { Component, effect, inject, ChangeDetectionStrategy } from '@angular/core';
import { Spinner } from '@ziadshalaby/ngx-zs-component';
import { AuthApi } from '../../services/auth-services/auth-api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-init-page',
  imports: [Spinner],
  templateUrl: './init-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './init-page.css',
})
export class InitPage {
  readonly authApi: AuthApi = inject(AuthApi);
}
