import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { Button } from '@ziadshalaby/ngx-zs-component';

@Component({
  selector: 'app-profile',
  imports: [Button],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  readonly authService = inject(AuthService)
}
