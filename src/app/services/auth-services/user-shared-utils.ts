import { inject, Injectable, signal } from '@angular/core';
import { ConfigService } from '../config-service/config-service';
import { Router } from '@angular/router';
import { SharedUtils } from '../shared-service/shared-utils';

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
export class UserSharedUtils {
  readonly config: ConfigService = inject(ConfigService);
  readonly shared: SharedUtils = inject(SharedUtils);

  readonly router: Router = inject(Router);

  readonly accessTokenExpire: number = 14.75; // Minutes

  readonly userData = signal<UserDataType | null>(null);
  readonly isLoggedin = signal<boolean>(false);

  // Loading
  readonly signupLoading = signal<boolean>(false);
  readonly loginLoading = signal<boolean>(false);

  readonly googleLoading = signal<boolean>(false);
  readonly verifyloading = signal<boolean>(false);

  readonly passwordResetLoading = signal<boolean>(false);
  readonly passwordResetConfirmLoading = signal<boolean>(false);

  readonly updateProfileLoading = signal<boolean>(false);
  readonly remImgProfileLoading = signal<boolean>(false);
  readonly getUsersProfileLoading = signal<boolean>(false);

  readonly deleteAccLoading = signal<boolean>(false);
  
  readonly verifyEmailLoading = signal<boolean>(false);
  readonly resendverifyEmailLoading = signal<boolean>(false);
}
