import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { AlertService, ExtractorService } from '@ziadshalaby/ngx-zs-component';
import { ConfigService } from '../config-service';
import { Router } from '@angular/router';

export interface UserDataType {
  date_joined : string;
  email : string;
  fullname : string;
  id : number;
  is_active : boolean;
  last_login : string;
  user_image : string;
  username : string;
  bio: string;
}

@Injectable({
  providedIn: 'root',
})
export class SharedUtils {
  readonly alertService: AlertService = inject(AlertService);
  readonly extractorService: ExtractorService = inject(ExtractorService);

  readonly http: HttpClient= inject(HttpClient);
  readonly config: ConfigService = inject(ConfigService);
  readonly router: Router = inject(Router);

  readonly accessTokenExpire: number = 14.75;

  readonly userData = signal<UserDataType | null>(null);
  readonly isLoggedin = signal<boolean>(false);
  readonly error = signal<string[]>([]);

  // Loading
  readonly signupLoading = signal<boolean>(false);
  readonly loginLoading = signal<boolean>(false);

  readonly googleLoading = signal<boolean>(false);
  readonly verifyloading = signal<boolean>(false);

  readonly passwordResetLoading = signal<boolean>(false);
  readonly passwordResetConfirmLoading = signal<boolean>(false);

  readonly updateProfileLoading = signal<boolean>(false);

  setErrors(errorObject: any) {
    const errors = this.extractorService.extract(errorObject)
    this.error.update((v: string[]) => [...v, ...errors]);
    this.alertService.bulkAlert(errors, { type: 'danger' });
  }
}
