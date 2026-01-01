import { Component, inject, input, model, signal, WritableSignal } from '@angular/core';
import { ChangeEventType, FileData, FileInput, Form, Modal, Button } from '@ziadshalaby/ngx-zs-component';
import { AuthApi } from '../services/auth-services/auth-api';
import { Or } from '../or/or';

@Component({
  selector: 'app-profile-edit-user-img',
  imports: [Modal, FileInput, Button, Or],
  templateUrl: './profile-edit-user-img.html',
  styleUrl: './profile-edit-user-img.css',
})
export class ProfileEditUserImg {
  readonly authApi: AuthApi = inject(AuthApi);
  
  readonly handleCloseSc = input<(modalToClose?: WritableSignal<boolean>) => () => void>()
  readonly handleCloseFd = input<() => void>()

  // ================================== Edit User Image ================================== //
  readonly openEditImgModal = model<boolean>(false);
  readonly EditImgForm = new Form<{
    user_image: File | null;
  }>({
    user_image: null,
  })

  async changeEditImgcValues(event: ChangeEventType<FileData[]>, key: keyof typeof this.EditImgForm.fields) {
    const fileData = event.value.length ? event.value[0] : null;
    if (!fileData || !fileData?.url) {
      this.EditImgForm.set(key, null, event.valid);
      return;
    }

    const blob = await fetch(fileData.url).then(res => res.blob());
    const file = new File([blob], fileData.name, { type: fileData.type });
    this.EditImgForm.set(key, file, event.valid);
  }

  editImgProfile() {
    this.EditImgForm.submit((user_image) => {
      this.authApi.updateProfileLoading.set(true);
      if (!user_image) {
        this.handleCloseSc()?.(this.openEditImgModal);
        this.authApi.updateProfileLoading.set(false);
        return;
      }

      this.authApi.updateProfile(
        user_image,
        this.handleCloseSc()?.(this.openEditImgModal),
        this.handleCloseFd()
      );
    });
  }

  removeUserImg() {
    this.authApi.updateProfileLoading.set(true);
    this.authApi.deleteUserImage(
      this.handleCloseSc()?.(this.openEditImgModal),
      this.handleCloseFd()
    );
  }
  // =================================/ Edit User Image /================================== //
}
