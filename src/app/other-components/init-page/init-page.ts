import { Component, inject } from '@angular/core';
import { Spinner } from '@ziadshalaby/ngx-zs-component';
import { AuthApi } from '../../services/auth-services/auth-api';

@Component({
  selector: 'app-init-page',
  imports: [Spinner],
  templateUrl: './init-page.html',
  styleUrl: './init-page.css',
})
export class InitPage {
  readonly authApi: AuthApi = inject(AuthApi);
}
