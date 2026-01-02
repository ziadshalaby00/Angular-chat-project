import { Component, computed, inject, model } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, AuthButtonsType, Navbar, NavbarItemExport, navItemsType, SiteNameConfigType, UserProfile } from '@ziadshalaby/ngx-zs-component';
import { AuthApi } from '../services/auth-services/auth-api';

@Component({
  selector: 'app-navbar',
  imports: [Navbar],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComp {
  readonly isMobileMenuOpen = model<boolean>(false);

  private readonly alertService: AlertService = inject(AlertService)
  private readonly router: Router = inject(Router)
  readonly authApi: AuthApi = inject(AuthApi);

  siteNameConfig: SiteNameConfigType = {
    siteName: 'Proton',
    siteNameColorClass: 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'
  }

  authButtons: AuthButtonsType = {
    showAuthButtons: true,
    signup: {
      btnStyle: 'violet',
      // size: 'sm'
    },
    login: {
      btnStyle: 'primary',
      // size: 'sm'
    }
  }

  logoUrl: string = 'https://i.postimg.cc/MpzpyjF1/android-chrome-512x512-proton.png';

  navItems: navItemsType = {
    navItems: [
      {
        label: 'Home',
        routerLink: '/home',
        icon: 'fa-solid fa-house',
        routerLinkActive: 'bg-blue-500 dark:bg-blue-600 text-gray-50',
        useDefaultColorClass: 'bg',
      },
      {
        label: 'Chats',
        routerLink: '/chats',
        icon: 'fa-solid fa-comment-dots',
        routerLinkActive: 'bg-green-500 dark:bg-green-600 text-gray-50',
        useDefaultColorClass: 'bg',
      },
      {
        label: 'Add',
        icon: 'fa-solid fa-user-plus',
        colorClass: ''
      },
    ]
  }

  navUserProfile = computed<UserProfile | undefined>(() => {
    const userData = this.authApi.userData()
    return userData ? {
      name: userData.fullname,
      email: userData.email,
      username: userData.username,
      imageUrl: userData.user_image
    } : undefined
  })

  userMenuItems: NavbarItemExport[] = [
    { 
      label: 'Profile',
      icon: 'fa-solid fa-circle-user text-xl',
      useDefaultColorClass: 'text',
      action: () => {
        this.router.navigate(['/profile', this.authApi.userData()?.id]);
      }
    },
    { 
      label: 'Logout', 
      action: () => this.logout(),
      colorClass: 'text-red-600 hover:text-red-800 dark:text-red-700 dark:hover:text-red-500',
      icon: 'fas fa-sign-out-alt text-lg',
    }
  ];

  onLogin() {
    this.router.navigate(['/login'])
  }

  onSignup() {
    this.router.navigate(['/signup'])
  }

  logout() {
    this.authApi.logout(
      (message?: string) => { 
        this.alertService.addAlert({
          message: message ?? '',
          type: 'success'
        });
      }
    )
  }
}
