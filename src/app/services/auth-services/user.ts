import { inject, Injectable, Injector } from '@angular/core';
import { UserSharedUtils } from './user-shared-utils';
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
  private get userShared(): UserSharedUtils { return this.injector.get(UserSharedUtils); }
  private get logout(): Logout { return this.injector.get(Logout); }

  private readonly meUrl = `${this.userShared.config.apiUrl}/api/auth/me/`;
  private readonly getUsersProfileURL = `${this.userShared.config.apiUrl}/api/auth/users-profile`;
  private readonly updateProfileURL = `${this.userShared.config.apiUrl}/api/auth/update-profile/`;
  private readonly deleteUserImageURL = `${this.userShared.config.apiUrl}/api/auth/delete-user-image/`;
  private readonly changeEmailURL = `${this.userShared.config.apiUrl}/api/auth/change-email/`;

  me(successFn?: () => void, faildFn?: () => void) {
    this.userShared.shared.http.get(this.meUrl, { withCredentials: true }).subscribe({
      next: (res: any) => {
        this.userShared.userData.set(res)
        if(successFn) successFn();
      },
      error: (err: any) => {
        if(faildFn) faildFn();

        this.userShared.shared.setErrors(err.error);
        this.logout.logout();
      }
    })
  }

  getUsersProfile(user_id: number | null, successFn?: (res: any) => void, faildFn?: () => void) {
    if(!user_id) return;

    this.userShared.shared.http.get(`${this.getUsersProfileURL}/${user_id}/`, 
      { withCredentials: true }).subscribe({
      next: (res: any) => {
        if(successFn) successFn(res);
      },
      error: (err: any) => {
        if(faildFn) faildFn();
        this.userShared.shared.setErrors(err.error);
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

    this.userShared.shared.http.patch(this.updateProfileURL, 
      formData, this.userShared.shared.CredAndCsrf()).subscribe({
      next: (res: any) => {
        this.userShared.userData.set(res.user);

        this.userShared.shared.alertService.addAlert({
          message: res.message,
          type: 'success'
        })

        if(successFn) successFn();
      },
      error: (err: any) => {
        this.userShared.shared.setErrors(err.error);
        if(faildFn) faildFn();
      }
    })
  }

  deleteUserImage(successFn?: () => void, faildFn?: () => void) {
    this.userShared.shared.http.delete(this.deleteUserImageURL, 
      this.userShared.shared.CredAndCsrf()).subscribe({
      next: (res: any) => {
        this.userShared.userData.update((prev) => {
          if (!prev) return prev;
          return { ...prev, user_image: '' };
        });

        this.userShared.shared.alertService.addAlert({
          message: res.message,
          type: 'success'
        })

        if(successFn) successFn();
      },
      error: (err: any) => {
        this.userShared.shared.setErrors(err.error);
        if(faildFn) faildFn();
      }
    })
  }

  changeEmail(email: string, sf?: () => void, fn?: () => void) {
     this.userShared.shared.http.post(this.changeEmailURL, {new_email: email},
      this.userShared.shared.CredAndCsrf()).subscribe({
      next: (res: any) => {
        this.userShared.userData.update((prev) => {
          if (!prev) return prev;
          return { ...prev, pending_email: email };
        });

        this.userShared.shared.alertService.addAlert({
          message: res.detail,
          type: 'success'
        })

        if(sf) sf();
      },
      error: (err: any) => {
        this.userShared.shared.setErrors(err.error);
        if(fn) fn();
      }
    })
  }
}
