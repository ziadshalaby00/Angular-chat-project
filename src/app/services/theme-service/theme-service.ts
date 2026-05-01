import { Injectable, signal } from '@angular/core';
import { themeTypes } from '@ziadshalaby/ngx-zs-component';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  public readonly theme = signal<themeTypes | null>(null);
  public readonly quickTheme = signal<boolean>(true);

  public setTheme(theme: themeTypes) {
    this.theme.set(theme);
  }

  public toggleQuickTheme() {
    this.quickTheme.update(v => !v);
    localStorage.setItem('quickTheme', JSON.stringify(this.quickTheme()));
  }

  constructor() {
    const stored = localStorage.getItem('quickTheme');
    this.quickTheme.set(stored ? JSON.parse(stored) : true);

    let theme = localStorage.getItem('theme');
    if(!theme) {
      setTimeout(() => {
        this.setTheme('light');
      }, 10);
    }
  }
}
