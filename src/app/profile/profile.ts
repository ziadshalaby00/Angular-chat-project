import { Component, effect, inject, signal, untracked } from '@angular/core';
import { Button, Modal, Input, ChangeEventType, Form, FileInput, FileData, Checkbox, Spinner } from '@ziadshalaby/ngx-zs-component';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from '../services/config-service';
import { AuthApi, UserDataType } from '../services/auth-services/auth-api';

@Component({
  selector: 'app-profile',
  imports: [Button, Modal, Input, FileInput, Checkbox, Spinner],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  readonly router: Router = inject(Router);
  readonly authApi: AuthApi = inject(AuthApi);
  readonly config = inject(ConfigService);
  readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  readonly userId = signal<number | null>(null);
  readonly profileData = signal<UserDataType | null>(null);
  readonly isProfileForUserLoggedIn = signal<boolean>(false)

  constructor() {
    this.startSubscribe();

    effect(() => {
      const isLoggedin = this.authApi.isLoggedin()
      untracked(() => {
        const isProfileForUserLoggedIn = this.isProfileForUserLoggedIn();

        if(!isLoggedin && isProfileForUserLoggedIn) {
          this.router.navigate(['/login']);
        }
      })
    })

    effect(() => {
      const profileData = this.profileData();

      untracked(() => {
        const isProfileForUserLoggedIn = this.isProfileForUserLoggedIn();

        if (isProfileForUserLoggedIn && profileData) {
          for (const item in this.updateAccForm.fields) {
            if (item in profileData) {
              this.updateAccForm.set(
                item as keyof typeof this.updateAccForm.fields,
                profileData[item as keyof typeof this.updateAccForm.fields] ?? ''
              );
            }
          }
          this.updateAccForm.patch('bio', { valid: true })
        }
      });
    });

    effect(() => {
      const userLoggedinData = this.authApi.userData();

      untracked(() => {
        const isUserLoggedIn = this.isProfileForUserLoggedIn();
        if(isUserLoggedIn) {
          this.profileData.set(userLoggedinData);
        }
      })
    });

    this.EditImgForm.patch('rem_image', { valid: true });
    this.EditImgForm.patch('user_image', { valid: true });
  }

  startSubscribe() {
    this.activatedRoute.paramMap.subscribe(params => {
      const userId = Number(params.get('user_id'));
      if (!userId) return;

      // لو نفس الـ userId الحالي، ما تعملش حاجة
      if (userId === this.profileData()?.id) return;

      // حدّد الـ userId الحالي
      this.userId.set(userId);

      const userLoggedinData = this.authApi.userData();
      if (userId === userLoggedinData?.id) {
        this.isProfileForUserLoggedIn.set(true);
        this.profileData.set(userLoggedinData);
        return;
      }

      // بروفايل مستخدم آخر
      this.isProfileForUserLoggedIn.set(false);

      this.authApi.getUsersProfileLoading.set(true);
      this.authApi.getUsersProfile(
        userId,
        (res) => {
          this.profileData.set(res.user_profile);
          this.authApi.getUsersProfileLoading.set(false);
        },
        () => {
          this.profileData.set(null);
          this.authApi.getUsersProfileLoading.set(false);
        }
      );
    });
  }
  
  // =============== Update Account Profile (username, fullname, email, bio) =============== //
  readonly openUpdateAccModal = signal<boolean>(false);
  readonly updateAccForm = new Form({
    fullname: '',
    username: '',
    email: '',
    bio: '',
  })

  changeUpdateAccValues(event: ChangeEventType, key: keyof typeof this.updateAccForm.fields) {
    this.updateAccForm.set(key, event.value, event.valid);
  }

  updateAccProfile() {
    this.updateAccForm.submit((values) => {
      this.authApi.updateProfileLoading.set(true);

      const handleClose = () => {
        this.openUpdateAccModal.set(false);
        this.authApi.updateProfileLoading.set(false);
      };

      const cleanedValues = Object.fromEntries(
        Object.entries(values).map(([key, value]) => [key, value ?? ''])
      ) as typeof values;

      this.authApi.updateProfile(cleanedValues, handleClose, handleClose);
    }, ['bio']);
  }
  // ===============/ Update Account Profile /=============== //

  // =============== Edit User Image =============== //
  readonly openEditImgModal = signal<boolean>(false);
  readonly EditImgForm = new Form<{
    user_image: File | null;
    rem_image: boolean;
  }>({
    user_image: null,
    rem_image: false
  })

  async changeEditImgcValues(event: ChangeEventType<FileData[]>, key: keyof typeof this.EditImgForm.fields) {
    const fileData = event.value[0];
    if (!fileData?.url) return;

    const blob = await fetch(fileData.url).then(res => res.blob());
    const file = new File([blob], fileData.name, { type: fileData.type });
    this.EditImgForm.set(key, file, event.valid);
  }

  filesChange(e: any) {
    console.log(e);
  }

  editImgProfile() {
    this.EditImgForm.submit((values) => {
      this.authApi.updateProfileLoading.set(true);

      const { user_image, rem_image } = values;

      const handleClose = () => {
        this.openEditImgModal.set(false);
        this.authApi.updateProfileLoading.set(false);
      }

      if (rem_image) {
        this.authApi.deleteUserImage(handleClose, handleClose);
        return;
      }

      if (!user_image) {
        handleClose();
        this.authApi.updateProfileLoading.set(false);
        return;
      }

      this.authApi.updateProfile({ user_image }, handleClose, handleClose);
    }, ['user_image']);
  }
  // ===============/ Edit User Image /=============== //
}
