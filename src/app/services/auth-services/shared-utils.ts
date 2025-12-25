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

export interface HttpOptions {
  headers?: { [key: string]: string };
  [key: string]: any;
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

  readonly accessTokenExpire: number = 14.75; // Minutes

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
  readonly getUsersProfileLoading = signal<boolean>(false);

  readonly deleteAccLoading = signal<boolean>(false);

  setErrors(errorObject: any) {
    const errors = this.extractorService.extract(errorObject)
    this.error.update((v: string[]) => [...v, ...errors]);
    this.alertService.bulkAlert(errors, { type: 'danger' });
  }

  extractCSRFToken(): string | null {
    const name = 'csrftoken=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');

    for (let c of cookies) {
      c = c.trim();
      if (c.startsWith(name)) {
        return c.substring(name.length);
      }
    }

    return null;
  }

  CredAndCsrf(extraOptions: HttpOptions = {}): HttpOptions {
    const csrfToken = this.extractCSRFToken();

    const defaultOptions: HttpOptions = {
      withCredentials: true,
      headers: {
        'X-CSRFToken': csrfToken ?? ''
      }
    };

    return {
      ...defaultOptions,
      ...extraOptions,
      headers: {
        ...defaultOptions.headers,
        ...extraOptions.headers
      }
    };
  }
}
