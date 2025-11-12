import { inject, Injectable, Injector } from '@angular/core';
import { SharedUtils } from './shared-utils';
import { Logout } from './logout';

export interface UpdateProfileBody {
  fullname?: string;
  username?: string;
  email?: string;
  bio?: string;
  user_image?: File | null;
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
  private readonly updateProfileURL = `${this.shared.config.apiUrl}/api/auth/update-profile/`

  me(successFn?: () => void, faildFn?: () => void) {
    this.shared.error.set([]);

    this.shared.http.get(this.meUrl, { withCredentials: true }).subscribe({
      next: (res: any) => {
        this.shared.userData.set(res)
        if(successFn) successFn();
      },
      error: (err: any) => {
        if(faildFn) faildFn();

        this.shared.setErrors(err.error);
        this.logout.logout();
      }
    })
  }

  getUsersProfile(user_id: number | null, successFn?: (res: any) => void, faildFn?: () => void) {
    if(!user_id) return;

    this.shared.error.set([]);

    this.shared.http.get(`${this.getUsersProfileURL}/${user_id}/`, { withCredentials: true }).subscribe({
      next: (res: any) => {
        if(successFn) successFn(res);
      },
      error: (err: any) => {
        if(faildFn) faildFn();
        this.shared.setErrors(err.error);
      }
    })
  }

  updateProfile(body: UpdateProfileBody) {
    this.shared.error.set([]);

    const formData = new FormData();
    Object.entries(body).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    this.shared.http.post(this.updateProfileURL, formData, { withCredentials: true }).subscribe({
      next: (res: any) => {
        this.shared.userData.set(res.user);
        this.shared.updateProfileLoading.set(false);

        this.shared.alertService.addAlert({
          message: res.message,
          type: 'success'
        })
      },
      error: (err: any) => {
        this.shared.setErrors(err.error);
        this.shared.updateProfileLoading.set(false);
      }
    })
  }
}
