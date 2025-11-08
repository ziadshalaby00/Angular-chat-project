import { Component, computed, inject, model } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, AuthButtonsType, Navbar, NavbarItemExport, navItemsType, SiteNameConfigType, UserProfile } from '@ziadshalaby/ngx-zs-component';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-navbar',
  imports: [Navbar],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComp {
  readonly isMobileMenuOpen = model<boolean>(false);

  readonly alertService: AlertService = inject(AlertService)
  private readonly router: Router = inject(Router)
  readonly authService: AuthService = inject(AuthService)
  
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
      // { 
      //   label: 'Test', 
      //   routerLink: '/test', 
      //   iconClass: 'fa-solid fa-vial text-lg', 
      //   colorClass: `text-green-600 hover:text-green-700 dark:hover:text-green-500`, 
      // },
      // { label: 'Products', routerLink: '/products', iconClass: 'fas fa-tag text-lg'},
      // { label: 'Cart', routerLink: '/cart', iconClass: 'fas fa-shopping-cart text-blue-700 dark:text-blue-500 text-lg'},
      // { label: 'About Us', routerLink: '/about'},
      // { label: 'Contact Us', routerLink: '/contact'},
      // {
      //   label: 'Legal Pages',
      //   children: [
      //     { label: 'Privacy Policy', routerLink: '/privacyPolicy', useDefaultColorClass: 'bg' },
      //     { label: 'Terms & Conditions', routerLink: '/termsConditions', useDefaultColorClass: 'bg'},
      //   ]
      // },
    ]
  }

  userProfile = computed<UserProfile | undefined>(() => {
    const userData = this.authService.userData()
    return userData ? {
      name: userData.fullname,
      email: userData.email,
      username: userData.username
    } : undefined
  })

  userMenuItems: NavbarItemExport[] = [
    { 
      label: 'Profile',
      routerLink: '/profile',
      iconClass: 'fa-solid fa-user text-lg',
      useDefaultColorClass: 'text'
    },
    // { 
    //   label: 'Cart', 
    //   routerLink: '/cart', 
    //   iconClass: 'fas fa-shopping-cart text-lg text-blue-700 dark:text-blue-500', 
    // },
    // { 
    //   label: 'Dashboard', 
    //   iconClass: 'fa-solid fa-gear',
    //   children: [
    //     { 
    //       label: 'Orders', 
    //       routerLink: '/orders', 
    //       iconClass: 'fas fa-box text-lg text-indigo-500',
    //       useDefaultColorClass: 'bg'
    //     },
    //     { label: 'Addresses', routerLink: '/addresses', iconClass: 'fa-solid fa-location-dot text-lg', useDefaultColorClass: 'bg' },
    //     { label: 'Reviews', routerLink: '/reviews', iconClass: 'fa-solid fa-star text-lg', useDefaultColorClass: 'bg' },
    //   ]
    // },
    { 
      label: 'Logout', 
      action: () => this.logout(),
      colorClass: 'text-red-600 hover:text-red-800 dark:text-red-700 dark:hover:text-red-500',
      iconClass: 'fas fa-sign-out-alt text-lg',
    }
  ];

  onLogin() {
    this.router.navigate(['/login'])
  }

  onSignup() {
    this.router.navigate(['/signup'])
  }

  logout() {
    this.authService.logout(
      (message?: string) => { 
        this.alertService.addAlert({
          message: message ?? '',
          type: 'success'
        });
      }
    )
  }
}
