import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { AlertService, ExtractorService } from '@ziadshalaby/ngx-zs-component';
import { HttpOptions } from '../auth-services/user-shared-utils';

export type Dir = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';

@Injectable({
  providedIn: 'root',
})
export class SharedUtils {
  public formatDate(dateString: string | null | undefined, withTime = false) {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };

    if (withTime) {
      options.hour = "2-digit";
      options.minute = "2-digit";
      options.hour12 = true;
    }

    return date.toLocaleString("en-GB", options);
  }

  public readonly alertService: AlertService = inject(AlertService);
  private readonly extractorService: ExtractorService = inject(ExtractorService);
  public readonly http: HttpClient = inject(HttpClient);

  public setErrors(errorObject: any) {
    const errors: string[] = this.extractorService.extract(errorObject);
    this.alertService.bulkAlert(errors, { type: 'danger' });
  }

  public extractCSRFToken(): string | null {
    const name = 'csrftoken=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');

    for (let c of cookies) {
      c = c.trim();
      if (c.startsWith(name)) {
        return c.substring(name.length);
      }
    }

    return null;
  }

  public CredAndCsrf(extraOptions: HttpOptions = {}): HttpOptions {
    const csrfToken = this.extractCSRFToken();

    const defaultOptions: HttpOptions = {
      withCredentials: true,
      headers: {
        'X-CSRFToken': csrfToken ?? ''
      }
    };

    return {
      ...defaultOptions,
      ...extraOptions,
      headers: {
        ...defaultOptions.headers,
        ...extraOptions.headers
      }
    };
  }

  private readonly destroyRef = inject(DestroyRef);

  private createMediaSignal(query: string) {
    const mql = window.matchMedia(query);
    const sig = signal<boolean>(mql.matches);

    const listener = (e: MediaQueryListEvent) => {
      sig.set(e.matches);
    };

    mql.addEventListener('change', listener);

    this.destroyRef.onDestroy(() => {
      mql.removeEventListener('change', listener);
    });

    return sig;
  }

  // ========================= Breakpoints =========================
  public readonly min768px = this.createMediaSignal('(min-width: 768px)');
}
