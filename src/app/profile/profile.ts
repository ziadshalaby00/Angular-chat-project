import { Component, effect, inject, signal, untracked } from '@angular/core';
import { Button, Modal, Input, ChangeEventType, Form, BtnType } from '@ziadshalaby/ngx-zs-component';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from '../services/config-service';
import { AuthApi, UserDataType } from '../services/auth-services/auth-api';

@Component({
  selector: 'app-profile',
  imports: [Button, Modal, Input],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  readonly router: Router = inject(Router);
  readonly authApi: AuthApi = inject(AuthApi);
  readonly config = inject(ConfigService);
  readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  readonly userId = signal<number | null>(null);
  readonly userData = signal<UserDataType | null>(null);
  readonly isUserLoggedIn = signal<boolean>(false)

  constructor() {
    this.startSubscribe();

    effect(() => {
      const isLoggedin = this.authApi.isLoggedin()

      if(!isLoggedin) {
        this.router.navigate(['/login'])
      }
    })

    effect(() => {
      const userData = this.userData();

      untracked(() => {
        const isUserLoggedIn = this.isUserLoggedIn();

        if (isUserLoggedIn && userData) {
          for (const item in this.updateAccForm.fields) {
            if (item in userData) {
              this.updateAccForm.set(
                item as keyof typeof this.updateAccForm.fields,
                userData[item as keyof typeof this.updateAccForm.fields] ?? ''
              );
            }
          }
        }
      });
    });
  }

  startSubscribe() {
    this.activatedRoute.paramMap.subscribe(params => {
      const userId = Number(params.get('user_id'));
      if (!userId) return;

      // لو نفس الـ userId الحالي، ما تعملش حاجة
      if (userId === this.userData()?.id) return;

      // حدّد الـ userId الحالي
      this.userId.set(userId);

      // إذا البروفايل هو البروفايل بتاع المستخدم الحالي
      if (userId === this.authApi.userData()?.id) {
        this.isUserLoggedIn.set(true);
        this.userData.set(this.authApi.userData());
        return;
      }

      // بروفايل مستخدم آخر
      this.isUserLoggedIn.set(false);

      this.authApi.getUsersProfile(
        userId,
        (res) => {
          this.userData.set(res.user_profile);
        },
        () => {
          this.userData.set(null);
        }
      );
    });
  }
  
  readonly openEditModal = signal<boolean>(false);
  readonly updateAccForm = new Form({
    fullname: '',
    username: '',
    email: '',
    bio: '',
  })

  changeEditAccValues(event: ChangeEventType, key: keyof typeof this.updateAccForm.fields) {
    this.updateAccForm.set(key, event.value, event.valid);
  }

  updateProfile() {
    console.log('CSRF FROM COOKIE IS: ', this.authApi.extractCSRFToken());
    
    this.updateAccForm.submit((values) => {
      console.log(values);
      this.authApi.updateProfileLoading.set(true);
      this.authApi.updateProfile(values);
    });
  }
}
