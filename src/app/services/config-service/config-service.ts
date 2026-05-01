import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private readonly isProd: boolean = false;

  private readonly localApiUrl: string = '';
  private readonly prodApiUrl: string = 'https://api.example.com';

  private readonly localWsProtocol: string = 'ws';
  private readonly prodWsProtocol: string = 'wss';

  private readonly localSocketUrl: string = window.location.host;
  private readonly prodSocketUrl: string = 'api.example.com';

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
