import { Component, effect, inject, input, model, signal, TemplateRef, untracked, viewChild, WritableSignal } from '@angular/core';
import { ChangeEventType, Form, Modal, Input } from '@ziadshalaby/ngx-zs-component';
import { AuthApi, UserDataType } from '../services/auth-services/auth-api';

@Component({
  selector: 'app-profile-update-account',
  imports: [Modal, Input],
  templateUrl: './profile-update-account.html',
  styleUrl: './profile-update-account.css',
})
export class ProfileUpdateAccount {
  readonly authApi: AuthApi = inject(AuthApi);

  readonly profileData = input<UserDataType | null>(null);
  readonly isProfileForUserLoggedIn = input<boolean>(false);
  
  readonly openUpdateAccModal = model<boolean>(false);

  readonly handleCloseSuccess = input<(modalToClose?: WritableSignal<boolean>) => void>();
  readonly handleCloseFail = input<() => void>();

  readonly loaderIconTpl = viewChild<TemplateRef<any>>('loaderIcon');

  constructor() {
    effect(() => {
      const profileData = this.profileData();
      const openUpdateAccModal = this.openUpdateAccModal();

      untracked(() => {
        const isProfileForUserLoggedIn = this.isProfileForUserLoggedIn();

        if ((isProfileForUserLoggedIn || !openUpdateAccModal) && profileData) {
          for (const item in this.updateAccForm.fields) {
            if (item in profileData) {
              this.updateAccForm.set(
                item as keyof typeof this.updateAccForm.fields,
                profileData[item as keyof typeof this.updateAccForm.fields] ?? ''
              );
            }
          }
        }
      });
    });
  }

  // =============== Update Account Profile (username, fullname, email, bio) =============== //
  readonly updateAccForm = new Form({
    fullname: '',
    username: '',
    email: '',
    bio: '',
  })

  changeUpdateAccValues(event: ChangeEventType, key: keyof typeof this.updateAccForm.fields) {
    if(event.value === null) event.value = '';
    this.updateAccForm.set(key, event.value, event.valid);
  }

  updateAccProfile() {
    this.updateAccForm.submit((values) => {
      this.authApi.updateProfileLoading.set(true);
      this.authApi.updateProfile(
        values,
        () => this.handleCloseSuccess()?.(this.openUpdateAccModal),
        this.handleCloseFail()
      );
    }, ['bio']);
  }
  // ==============================/ Update Account Profile /============================== //
}
