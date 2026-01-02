import { Component, computed, inject, model, TemplateRef, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, AuthButtonsType, Navbar, NavbarItemExport, NavItemsType, SiteNameConfigType, UserItemsType, UserProfile } from '@ziadshalaby/ngx-zs-component';
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

  readonly homeIconTpl = viewChild<TemplateRef<any>>('homeIcon');
  readonly chatsIconTpl = viewChild<TemplateRef<any>>('chatsIcon');
  readonly addIconTpl = viewChild<TemplateRef<any>>('addIcon');

  navItems: NavItemsType = {
    routerLinkActive: 'bg-blue-500 dark:bg-blue-600 text-gray-50',
    closeMobileMenu: true,
    closeUserMenu: false,
    closeMoreMenu: false,
    items: [
      {
        label: 'Home',
        routerLink: '/home',
        iconTpl: this.homeIconTpl,
        // routerLinkActive: 'bg-blue-500 dark:bg-blue-600 text-gray-50',
        useDefaultColorClass: 'bg',
      },
      {
        label: 'Chats',
        routerLink: '/chats',
        iconTpl: this.chatsIconTpl,
        // routerLinkActive: 'bg-green-500 dark:bg-green-600 text-gray-50',
        useDefaultColorClass: 'bg',
      },
      {
        label: 'New Chat',
        iconTpl: this.addIconTpl,
        colorClass: 'bg-teal-500 hover:bg-teal-600 dark:hover:bg-teal-500 dark:bg-teal-600 text-gray-100',
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

  readonly profileIconTpl = viewChild<TemplateRef<any>>('profileIcon');
  readonly logoutIconTpl = viewChild<TemplateRef<any>>('logoutIcon');

  userMenuItems: UserItemsType = {
    closeMobileMenu: true,
    closeUserMenu: true,
    closeMoreMenu: false,
    items: [
      { 
        label: 'Profile',
        iconTpl: this.profileIconTpl,
        useDefaultColorClass: 'text',
        action: () => {
          this.router.navigate(['/profile', this.authApi.userData()?.id]);
        }
      },
      { 
        label: 'Logout', 
        action: () => this.logout(),
        colorClass: 'text-red-600 hover:text-red-800 dark:text-red-700 dark:hover:text-red-500',
        iconTpl: this.logoutIconTpl,
      }
    ]
  }

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
