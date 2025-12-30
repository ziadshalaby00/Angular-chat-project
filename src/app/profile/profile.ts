import { Component, effect, inject, signal, untracked, viewChild, WritableSignal } from '@angular/core';
import { Button, Modal, Input, ChangeEventType, Form, FileInput, FileData, Checkbox, Spinner, ValidatorFn } from '@ziadshalaby/ngx-zs-component';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from '../services/config-service';
import { AuthApi, UserDataType } from '../services/auth-services/auth-api';
import { Or } from '../or/or';

@Component({
  selector: 'app-profile',
  imports: [Button, Modal, Input, FileInput, Spinner, Or],
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
  readonly isProfileForUserLoggedIn = signal<boolean>(false);

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
  }

  startSubscribe() {
    this.activatedRoute.paramMap
    .subscribe(params => {
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
  
  handleCloseSc = (modalToClose?: WritableSignal<boolean>) => 
    () => {
      console.log(modalToClose)
      if(modalToClose) modalToClose.set(false);
      this.authApi.updateProfileLoading.set(false);
    }

  handleCloseFd: () => void = () => {
    this.authApi.updateProfileLoading.set(false);
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
    if(event.value === null) event.value = '';
    this.updateAccForm.set(key, event.value, event.valid);
  }

  updateAccProfile() {
    this.updateAccForm.submit((values) => {
      this.authApi.updateProfileLoading.set(true);
      this.authApi.updateProfile(
        values,
        this.handleCloseSc(this.openUpdateAccModal),
        this.handleCloseFd
      );
    }, ['bio']);
  }
  // ==============================/ Update Account Profile /============================== //

  // ================================== Edit User Image ================================== //
  readonly openEditImgModal = signal<boolean>(false);
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
        this.handleCloseSc(this.openEditImgModal)();
        this.authApi.updateProfileLoading.set(false);
        return;
      }

      this.authApi.updateProfile(
        user_image,
        this.handleCloseSc(this.openEditImgModal),
        this.handleCloseFd
      );
    });
  }

  removeUserImg() {
    this.authApi.updateProfileLoading.set(true);
    this.authApi.deleteUserImage(
      this.handleCloseSc(this.openEditImgModal),
      this.handleCloseFd
    );
  }
  // =================================/ Edit User Image /================================== //

  // ================================= Change Password ================================= //
  readonly openChangePassModal = signal<boolean>(false);
  readonly changePassForm = new Form({
    old_password: '',
    password: '',
    conf_password: ''
  })

  readonly pass = viewChild<Input>('password')
  readonly conf_pass = viewChild<Input>('conf_password')

  confPassValidate: ValidatorFn = (value: string | null) => {
    if(this.changePassForm.get('password').value !== value)
      return ['The passwords do not match.']
    return []
  }

  changeChPassValues(event: ChangeEventType, key: keyof typeof this.changePassForm.fields) {
    this.changePassForm.set(key, event.value, event.valid);

    if (event.fromForce) return;
    
    if (key === 'password') {
      const conf = this.conf_pass();
      if (conf) conf.forceChange();
    }

    if (key === 'conf_password') {
      const pass = this.pass();
      if (pass) pass.forceChange();
    }
  }

  changePass() {
    this.changePassForm.submit((values) => {
      this.authApi.updateProfileLoading.set(true);
      this.authApi.updateProfile(
        values,
        this.handleCloseSc(this.openChangePassModal),
        this.handleCloseFd
      );
    });
  }
  // =================================/ Change Password /================================= //

  // ================================= Delete User Account ================================= //
  readonly openDelUserAccModal = signal<boolean>(false);


  // =================================/ Delete User Account /================================= //
  readonly step = signal<1 | 2>(1);

  readonly del_UsernameValdate = (value: string | null) => {
    if(value !== `Delete ${this.authApi.userData()?.username}`) {
      return ['Pls enter `Delete + username`'];
    }
    return [];
  }

  readonly del_Username = signal<ChangeEventType>({
    value: '',
    valid: false,
    fromForce: false
  });
  readonly ddToCnSTouch = signal<boolean>(false);

  setDel_Username(event: ChangeEventType) {
    this.del_Username.set(event);
  }

  continueDelete() {
    if(this.del_Username().valid) {
      this.step.set(2)
    }else {
      this.ddToCnSTouch.set(true);
    }
  }

  readonly passForDA = signal<ChangeEventType>({
    value: '',
    valid: false,
    fromForce: false
  });
  readonly passForDATouch = signal<boolean>(false);

  setPassForDA(event: ChangeEventType) {
    this.passForDA.set(event);
  }

  DeleteAcc() {
    if(this.passForDA().valid) {
      this.authApi.deleteAccLoading.set(true);
      this.authApi.deleteAcc(this.passForDA().value ?? '')
    }else {
      this.passForDATouch.set(true);
    }
  }
}