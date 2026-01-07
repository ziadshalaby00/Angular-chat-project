import { Component, computed, inject, model, signal, TemplateRef, viewChild, WritableSignal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AlertService, AuthButtonsType, Navbar, NavbarItemExport, NavItemsType, SiteNameConfigType, UserItemsType, UserProfile } from '@ziadshalaby/ngx-zs-component';
import { AuthApi } from '../../services/auth-services/auth-api';
import { SharedUtils } from '../../services/shared-service/shared-utils';
import { ThemeService } from '../../services/theme-service/theme-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [Navbar, RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComp {
  private readonly alertService: AlertService = inject(AlertService);
  private readonly router: Router = inject(Router);
  readonly authApi: AuthApi = inject(AuthApi);
  readonly shared: SharedUtils = inject(SharedUtils);

  siteNameConfig: SiteNameConfigType = {
    siteName: 'Proton',
    siteNameColorClass: 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'
  }

  authButtons: AuthButtonsType = {
    showAuthButtons: true,
    signup: {
      btnStyle: 'violet',
    },
    login: {
      btnStyle: 'primary',
    }
  }

  logoUrl: string = 'https://i.postimg.cc/MpzpyjF1/android-chrome-512x512-proton.png';

  readonly isMobileMenuOpen = model<boolean>(false);
  readonly isUserMenuOpen = signal<boolean>(false);
  readonly isMoreOpen = signal<boolean>(false);

  close(signals: WritableSignal<boolean>[]) {
    signals.forEach((signal) => signal.set(false));
  }

  readonly homeIconTpl = viewChild<TemplateRef<any>>('homeIcon');
  readonly chatsIconTpl = viewChild<TemplateRef<any>>('chatsIcon');
  readonly navItems = signal<NavItemsType>({
    routerLinkActive: 'bg-blue-500 dark:bg-blue-600 text-gray-50',
    items: [
      {
        id: 'home',
        label: 'Home',
        routerLink: '/home',
        iconTpl: this.homeIconTpl,
        useDefaultColorClass: 'bg',
      },
      {
        id: 'chats',
        label: 'Chats',
        routerLink: '/chats',
        iconTpl: this.chatsIconTpl,
        useDefaultColorClass: 'bg',
      },
    ]
  })

  readonly navUserProfile = computed<UserProfile | undefined>(() => {
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

  readonly themeIconTPl = viewChild<TemplateRef<any>>('themeIcon');
  readonly lightIconTPl = viewChild<TemplateRef<any>>('lightIcon');
  readonly darkIconTPl = viewChild<TemplateRef<any>>('darkIcon');
  readonly quickThemeIconTPl = viewChild<TemplateRef<any>>('quickThemeIcon');

  public readonly themeService: ThemeService = inject(ThemeService);

  private readonly themeSharedClasses = 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'

  readonly userMenuItems = signal<UserItemsType>({
    items: [
      { 
        id: 'profile',
        label: 'Profile',
        iconTpl: this.profileIconTpl,
        useDefaultColorClass: 'text',
        action: () => { 
          this.router.navigate(['/profile', this.authApi.userData()?.id]);
        },
      },
      { 
        id: 'theme',
        label: 'Theme',
        iconTpl: this.themeIconTPl,
        children: [
          { 
            id: 'light',
            label: 'Light',
            iconTpl: this.lightIconTPl,
            action: () => this.themeService.setTheme('light'),
            colorClass: `select-none group ${this.themeSharedClasses}`
          },
          { 
            id: 'dark',
            label: 'Dark',
            iconTpl: this.darkIconTPl,
            action: () => this.themeService.setTheme('dark'),
            colorClass: `select-none  ${this.themeSharedClasses}`
          },
          { 
            id: 'quick-theme-control',
            label: 'Quick Theme Control',
            action:() => this.themeService.toggleQuickTheme(),
            iconTpl: this.quickThemeIconTPl,
            colorClass: `text-sm! select-none  ${this.themeSharedClasses}`
          },
        ],
        useDefaultColorClass: 'text',
      },
      {
        id: 'logout',
        label: 'Logout', 
        action: () => { this.logout(); },
        colorClass: 'text-red-600 hover:text-red-800 dark:text-red-700 dark:hover:text-red-500',
        iconTpl: this.logoutIconTpl,
      }
    ]
  })

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

  anyItemClickedEv(event: NavbarItemExport) {
    let signals: WritableSignal<boolean>[] = [this.isMobileMenuOpen, this.isMoreOpen];
    const id = event.id

    if(id === 'new-chat') 
      signals = [];
    else if(['profile', 'logout'].includes(id as string)) 
      signals.push(this.isUserMenuOpen);

    this.close(signals);
  }
}
