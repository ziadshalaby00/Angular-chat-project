import { inject, Injectable, Injector } from '@angular/core';
import { SharedUtils, UserDataType } from './shared-utils';
import { Logout } from './logout';

export interface UpdateProfileBody {
  fullname?: string;
  username?: string;
  email?: string;
  bio?: string;
  user_image?: File | null;
  rem_image?: boolean;
  password?: string;
  old_password?: string;
}

@Injectable({
  providedIn: 'root',
})
export class User {
  private readonly injector = inject(Injector);
  private get shared(): SharedUtils { return this.injector.get(SharedUtils); }
  private get logout(): Logout { return this.injector.get(Logout); }

  private readonly meUrl = `${this.shared.config.apiUrl}/api/auth/me/`;
  private readonly getUsersProfileURL = `${this.shared.config.apiUrl}/api/auth/users-profile`;
  private readonly updateProfileURL = `${this.shared.config.apiUrl}/api/auth/update-profile/`;
  private readonly deleteUserImageURL = `${this.shared.config.apiUrl}/api/auth/delete-user-image/`;

  me(successFn?: () => void, faildFn?: () => void) {
    this.shared.config.http.get(this.meUrl, { withCredentials: true }).subscribe({
      next: (res: any) => {
        this.shared.userData.set(res)
        if(successFn) successFn();
      },
      error: (err: any) => {
        if(faildFn) faildFn();

        this.shared.config.setErrors(err.error);
        this.logout.logout();
      }
    })
  }

  getUsersProfile(user_id: number | null, successFn?: (res: any) => void, faildFn?: () => void) {
    if(!user_id) return;

    this.shared.config.http.get(`${this.getUsersProfileURL}/${user_id}/`, { withCredentials: true }).subscribe({
      next: (res: any) => {
        if(successFn) successFn(res);
      },
      error: (err: any) => {
        if(faildFn) faildFn();
        this.shared.config.setErrors(err.error);
      }
    })
  }

  updateProfile(body: UpdateProfileBody, successFn?: () => void, faildFn?: () => void) {
    const formData = new FormData();
    Object.entries(body).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    this.shared.config.http.patch(this.updateProfileURL, formData, this.shared.config.CredAndCsrf()).subscribe({
      next: (res: any) => {
        this.shared.userData.set(res.user);

        this.shared.config.alertService.addAlert({
          message: res.message,
          type: 'success'
        })

        if(successFn) successFn();
      },
      error: (err: any) => {
        this.shared.config.setErrors(err.error);
        if(faildFn) faildFn();
      }
    })
  }

  deleteUserImage(successFn?: () => void, faildFn?: () => void) {
    this.shared.config.http.delete(this.deleteUserImageURL, this.shared.config.CredAndCsrf()).subscribe({
      next: (res: any) => {
        this.shared.userData.update((prev) => {
          if (!prev) return prev;
          return { ...prev, user_image: '' };
        });

        this.shared.config.alertService.addAlert({
          message: res.message,
          type: 'success'
        })

        if(successFn) successFn();
      },
      error: (err: any) => {
        this.shared.config.setErrors(err.error);
        if(faildFn) faildFn();
      }
    })
  }
}
