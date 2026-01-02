import { Component, effect, inject, input, model, signal, TemplateRef, viewChild, WritableSignal } from '@angular/core';
import { ChangeEventType, FileData, FileInput, Form, Modal, Button, FilesType } from '@ziadshalaby/ngx-zs-component';
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
  
  readonly handleCloseSuccess = input<(modalToClose?: WritableSignal<boolean>) => void>()
  readonly handleCloseFail = input<() => void>()

  readonly openEditImgModal = model<boolean>(false);
  readonly filesType = signal(new Map());

  readonly loaderIconTpl = viewChild<TemplateRef<any>>('loaderIcon');

  constructor() {
    effect(() => {
      const openEditImgModal = this.openEditImgModal();
      if(!openEditImgModal) {
        this.EditImgForm.reset();
        this.filesType.set(new Map())
      }
    })
  }

  // ================================== Edit User Image ================================== //
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
        this.handleCloseSuccess()?.(this.openEditImgModal);
        this.authApi.updateProfileLoading.set(false);
        return;
      }

      this.authApi.updateProfile(
        user_image,
        () => this.handleCloseSuccess()?.(this.openEditImgModal),
        this.handleCloseFail()
      );
    });
  }

  readonly confRemUserImg = signal<boolean>(false)
  removeUserImg() {
    this.authApi.remImgProfileLoading.set(true);
    this.authApi.deleteUserImage(
      () => {
        this.handleCloseSuccess()?.(this.confRemUserImg)
      },
      this.handleCloseFail()
    );
  }
  // =================================/ Edit User Image /================================== //
}
