import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private readonly isProd: boolean = !window.location.hostname.includes('localhost');

  private readonly localApiUrl: string = 'http://localhost:8000';
  private readonly prodApiUrl: string = 'https://ziadshalaby00.pythonanywhere.com/';

  private readonly localWsProtocol: string = 'ws';
  private readonly prodWsProtocol: string = 'wss';

  private readonly localSocketUrl: string = 'localhost:8000';
  private readonly prodSocketUrl: string = 'ziadshalaby00.pythonanywhere.com/';

  public get apiUrl(): string {
    return this.isProd ? this.prodApiUrl : this.localApiUrl;
  }

  public get WsProtocol(): string {
    return this.isProd ? this.prodWsProtocol : this.localWsProtocol;
  }

  public get socketUrl(): string {
    return this.isProd ? this.prodSocketUrl : this.localSocketUrl;
  }
}
