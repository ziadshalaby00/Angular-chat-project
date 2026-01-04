import { inject, Injectable, signal, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpOptions } from './auth-services/shared-utils';
import { AlertService, ExtractorService } from '@ziadshalaby/ngx-zs-component';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private readonly isProd: boolean = false;

  private readonly localApiUrl: string = 'http://localhost:8000';
  private readonly prodApiUrl: string = 'https://api.example.com';

  private readonly localWsProtocol: string = 'ws'
  private readonly prodWsProtocol: string = 'wss'

  private readonly localSocketUrl: string = 'localhost:8000'
  private readonly prodSocketUrl: string = 'api.example.com'
  
  public get WsProtocol(): string {
    return this.isProd ? this.prodWsProtocol : this.localWsProtocol;
  }

  public get apiUrl(): string {
    return this.isProd ? this.prodApiUrl : this.localApiUrl;
  }

  public get socketUrl(): string {
    return this.isProd ? this.prodSocketUrl : this.localSocketUrl;
  }

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

  readonly alertService: AlertService = inject(AlertService);
  readonly extractorService: ExtractorService = inject(ExtractorService);
  readonly http: HttpClient= inject(HttpClient);

  setErrors(errorObject: any) {
    const errors = this.extractorService.extract(errorObject)
    this.alertService.bulkAlert(errors, { type: 'danger' });
  }

  extractCSRFToken(): string | null {
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

  CredAndCsrf(extraOptions: HttpOptions = {}): HttpOptions {
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
}
