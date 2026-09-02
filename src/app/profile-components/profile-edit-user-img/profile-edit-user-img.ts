import { Component, inject, input, model, signal, TemplateRef, viewChild, WritableSignal, ChangeDetectionStrategy } from '@angular/core';
import { FileInput, Modal, Button, FilesType } from '@ziadshalaby/ngx-zs-component';
import { AuthApi } from '../../services/auth-services/auth-api';
import { Or } from '../../other-components/or/or';
import { form, FormField, readonly, required } from '@angular/forms/signals';

@Component({
  selector: 'app-profile-edit-user-img',
  imports: [Modal, FileInput, Button, Or, FormField],
  templateUrl: './profile-edit-user-img.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './profile-edit-user-img.css',
})
export class ProfileEditUserImg {
  readonly authApi: AuthApi = inject(AuthApi);
  
  readonly handleCloseSuccess = input<(modalToClose?: WritableSignal<boolean>) => void>()
  readonly handleCloseFail = input<() => void>()

  readonly openEditImgModal = model<boolean>(false);
  readonly filesType = signal(new Map());

  readonly loaderIconTpl = viewChild<TemplateRef<any>>('loaderIcon');

  // ================================== Edit User Image ================================== //
  readonly EditImgModel = signal({
    user_image: new Map() as FilesType,
  })

  readonly EditImgForm = form(this.EditImgModel, (schema) => {
    required(schema.user_image, {message: "image is required."})
    readonly(schema.user_image, {when: () => this.authApi.updateProfileLoading()})
  })

  editImgProfile() {
    this.EditImgForm().markAsTouched();

    const invalid = this.EditImgForm().invalid();
    if(invalid) return;

    const data = this.EditImgModel().user_image.values().next().value?.file;

    console.log(data)
    if (!data) {
      this.handleCloseSuccess()?.(this.openEditImgModal);
      return;
    }
    
    this.authApi.updateProfileLoading.set(true);
    this.authApi.updateProfile(
      {user_image: data},
      () => this.handleCloseSuccess()?.(this.openEditImgModal),
      this.handleCloseFail()
    );
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
