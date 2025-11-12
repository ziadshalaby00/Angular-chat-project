import { Component, effect, inject, signal } from '@angular/core';
import { Button, Modal, Input } from '@ziadshalaby/ngx-zs-component';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '../services/config-service';
import { AuthApi, UserDataType } from '../services/auth-services/auth-api';

@Component({
  selector: 'app-profile',
  imports: [Button, Modal, Input],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  readonly authApi: AuthApi = inject(AuthApi);
  readonly config = inject(ConfigService);
  readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  readonly userId = signal<number | null>(null);
  readonly userData = signal<UserDataType | null>(null);
  readonly isUserLoggedIn = signal<boolean>(false)

  constructor() {
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

    effect(() => {
      const isLoggedin = this.authApi.isLoggedin()

      if(!isLoggedin) {
        this.config.goOut()
      }
    })
  }

  readonly openEditModal = signal<boolean>(false);
  updateProfile() {

  }
}
