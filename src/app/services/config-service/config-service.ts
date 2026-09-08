import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private readonly isProd = (() => {
    const hostname = window.location.hostname;

    const isLocalhost =
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '::1';

    const isPrivateIP =
      /^(10\.)/.test(hostname) ||
      /^192\.168\./.test(hostname) ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname);

    return !isLocalhost && !isPrivateIP;
  })();

  private readonly localApiUrl: string = 'http://localhost:8000';
  private readonly prodApiUrl: string = 'https://desktop-97l1ctr.tailc9493e.ts.net';

  private readonly localWsProtocol: string = 'ws';
  private readonly prodWsProtocol: string = 'wss';

  private readonly localSocketUrl: string = this.localApiUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
  private readonly prodSocketUrl: string = this.prodApiUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

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
