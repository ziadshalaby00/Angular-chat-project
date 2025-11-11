import { Component, effect, inject, signal, untracked } from '@angular/core';
import { AuthService, UserDataType } from '../services/auth-service';
import { Button } from '@ziadshalaby/ngx-zs-component';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '../services/config-service';

@Component({
  selector: 'app-profile',
  imports: [Button],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  readonly authService = inject(AuthService);
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
      if (userId === this.authService.userData()?.id) {
        this.isUserLoggedIn.set(true);
        this.userData.set(this.authService.userData());
        return;
      }

      // بروفايل مستخدم آخر
      this.isUserLoggedIn.set(false);

      this.authService.getUsersProfile(
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
}
