import { Component, effect, inject, model, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComp } from './navbar/navbar';
import { Alert, Footer, ScrollToTop, Spinner, ThemeToggle } from '@ziadshalaby/ngx-zs-component'
import { AuthService } from './services/auth-service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavbarComp,
    ThemeToggle,
    Alert,
    Spinner,
    Footer
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Angular-chat-project');
  readonly isMobileMenuOpen = signal<boolean>(false);
  readonly authService: AuthService = inject(AuthService)

  ngAfterViewInit() {
    this.authService.verifyloading.set(true)
    this.authService.verifyAccess()
  }
  constructor() {
    effect(() => {
      console.log('userData: ', this.authService.userData())
      console.log('isLoggedin: ',this.authService.isLoggedin())
    })
  }
}
