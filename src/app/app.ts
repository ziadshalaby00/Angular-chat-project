import { AuthApi } from './services/auth-services/auth-api';
import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { NavbarComp } from './other-components/navbar/navbar';
import { Alert, Footer, ThemeToggle } from '@ziadshalaby/ngx-zs-component'
import { InitAppService } from './services/init-app-service/init-app-service';
import { filter, take } from 'rxjs';
import { ThemeService } from './services/theme-service/theme-service';

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
  readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  private readonly authApi: AuthApi = inject(AuthApi);
  public readonly themeService: ThemeService = inject(ThemeService);
  private readonly initAppService: InitAppService = inject(InitAppService);

  constructor() {
    this.router.events
    .pipe(
      filter(event => event instanceof NavigationStart),
      take(1)
    )
    .subscribe((event: NavigationStart) => {
      this.router.navigate(['/init-page']);
      const reRouting = event.url === '/init-page' ? '/home' : event.url
      this.initAppService.initApp(reRouting);
    });
  }
}
