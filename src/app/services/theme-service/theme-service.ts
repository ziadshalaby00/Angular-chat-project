import { Injectable, signal } from '@angular/core';
import { themeTypes } from '@ziadshalaby/ngx-zs-component';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  readonly theme = signal<themeTypes | null>(null);
  readonly quickTheme = signal<boolean>(true);

  setTheme(theme: themeTypes) {
    this.theme.set(theme);
  }

  toggleQuickTheme() {
    this.quickTheme.update(v => !v);
    localStorage.setItem('quickTheme', JSON.stringify(this.quickTheme()));
  }

  constructor() {
    const stored = localStorage.getItem('quickTheme');
    this.quickTheme.set(stored ? JSON.parse(stored) : true);
  }
}
