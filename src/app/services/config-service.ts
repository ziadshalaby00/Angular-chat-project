import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private readonly isProd = false;

  private readonly localApiUrl = 'http://127.0.0.1:8000';
  private readonly prodApiUrl = 'https://api.example.com';
  readonly accessTokenExpire: number = 14.75

  get apiUrl(): string {
    return this.isProd ? this.prodApiUrl : this.localApiUrl;
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
}
