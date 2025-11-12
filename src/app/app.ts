import { AuthApi } from './services/auth-services/auth-api';
import { Component, effect, inject, signal } from '@angular/core';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import { NavbarComp } from './navbar/navbar';
import { Alert, Footer, Spinner, ThemeToggle } from '@ziadshalaby/ngx-zs-component'
import { InitAppService } from './services/init-app-service';
import { filter, take } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavbarComp,
    ThemeToggle,
    Alert,
    Footer
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Angular-chat-project');
  readonly isMobileMenuOpen = signal<boolean>(false);
  private readonly router: Router = inject(Router);

  private readonly authApi: AuthApi = inject(AuthApi);
  private readonly initAppService: InitAppService = inject(InitAppService);

  constructor() {
    this.router.events
    .pipe(
      filter(event => event instanceof NavigationStart),
      take(1)
    )
    .subscribe((event: NavigationStart) => {
      this.router.navigate(['/init-app']);
      console.log('Actual URL:', event.url);
      this.initAppService.initApp(event.url);
    });

    effect(() => {
      console.log('userData: ', this.authApi.userData())
      console.log('isLoggedin: ',this.authApi.isLoggedin())
    })
  }
}
