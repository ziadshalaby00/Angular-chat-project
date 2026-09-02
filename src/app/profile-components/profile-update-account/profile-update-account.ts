import { Component, inject, input, model, signal, TemplateRef, viewChild, WritableSignal, ChangeDetectionStrategy, effect } from '@angular/core';
import { Modal, Input } from '@ziadshalaby/ngx-zs-component';
import { AuthApi, UserDataType } from '../../services/auth-services/auth-api';
import { form, FormField, maxLength, required } from '@angular/forms/signals';

@Component({
  selector: 'app-profile-update-account',
  imports: [Modal, Input, FormField],
  templateUrl: './profile-update-account.html',
  changeDetection: ChangeDetectionStrategy.Eager,
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
        const data = this.profileData();
        this.updateAccModel.set({
            fullname: data?.fullname ?? '',
            username: data?.username ?? '',
            bio: data?.bio ?? '',
        });
    })
  }

  // =============== Update Account Profile (username, fullname, bio) =============== //
  readonly updateAccModel = signal({
    fullname: '',
    username: '',
    bio: '',
  })

  readonly updateAccForm = form(this.updateAccModel, (schema) => {
    maxLength(schema.bio, 450, {message: 'maximum 450 characters.'})
  })

  updateAccProfile() {
    this.updateAccForm().markAsTouched();
    
    const invalid = this.updateAccForm().invalid();
    if(invalid) return;

    const data = this.updateAccModel();

    this.authApi.updateProfileLoading.set(true);
    this.authApi.updateProfile(
        data,
        () => this.handleCloseSuccess()?.(this.openUpdateAccModal),
        this.handleCloseFail()
    );
  }
  // ==============================/ Update Account Profile /============================== //
}
