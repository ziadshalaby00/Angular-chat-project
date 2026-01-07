import { inject, Injectable, signal } from '@angular/core';
import { ConfigService } from '../config-service/config-service';
import { SharedUtils } from '../shared-service/shared-utils';

export interface ParticipantType {
  "id": number,
  "fullname": string,
  "username": string,
  "user_image": string,
  "is_active": boolean,
  "is_deleted": boolean
}
interface UserFetchedType extends ParticipantType {
  "notice": string | null
}
export interface ChatsType {
  "id": number;
  "participants": { "user_info": ParticipantType }[];
  "created_at": string;
  "unread_count": number;
}

interface WebSocketMessageType {
  "type": 'chat_created' | 'new_message_notification';
  "chat": ChatsType
}

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  private readonly config = inject(ConfigService);
  readonly shared: SharedUtils = inject(SharedUtils);

  public readonly chats = signal<ChatsType[]>([]);
  public readonly chatsLoading = signal<boolean>(false);

  public readonly userFetched = signal<UserFetchedType | null>(null);
  public readonly userFetchedLoading = signal<boolean>(false);
  public readonly chatAddedLoading = signal<boolean>(false);

  private readonly chatsURL = `${this.config.apiUrl}/api/chat/chats/`;
  private readonly getUserByUserNameURL = `${this.config.apiUrl}/api/chat/get-user-by-username/`;

  public getChats() {
    this.shared.http.get(this.chatsURL, this.shared.CredAndCsrf()).subscribe({
      next: (res: any) => {
        console.log(res);
        this.chats.set(res.chats as ChatsType[]);
        this.chatsLoading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.shared.setErrors(err.error);
      },
    })
  }

  public getUserByUserName(username: string) {
    this.shared.http.get(
      `${this.getUserByUserNameURL}?username=${username}`,
      this.shared.CredAndCsrf()
    ).subscribe({
      next: (res: any) => {
        console.log(res);
        this.userFetchedLoading.set(false);
        this.userFetched.set(res.user as UserFetchedType);
      },
      error: (err) => {
        console.log(err);
        this.userFetchedLoading.set(false);
        this.userFetched.set(null);
        this.shared.setErrors(err.error);
      },
    })
  }

  private readonly chatSocket = signal<WebSocket | null>(null);
  public connectChats() {
    this.disconnectChats();

    const webSocket = new WebSocket(
      `${this.config.WsProtocol}://${this.config.socketUrl}/ws/chats/`
    );
    this.chatSocket.set(webSocket);

    if (!this.chatSocket()) return;
    this.chatSocket()!.onopen = () => {
      console.log('WS opened');
    };

    this.chatSocket()!.onmessage = (event) => {
      const data: WebSocketMessageType = JSON.parse(event.data);
      console.log(data);

      if(!data) return;
      if(data.type === 'chat_created') {
        this.chats.update((prev) => [data.chat, ...prev])
      }
    };

    this.chatSocket()!.onerror = (error) => {
      console.error(error);
    };

    this.chatSocket()!.onclose = () => {
      console.log('WS closed');
    };
  }

  public disconnectChats() {
    const socket = this.chatSocket();

    if (socket) {
      socket.onopen = null;
      socket.onmessage = null;
      socket.onerror = null;
      socket.onclose = null;

      socket.close();
      this.chatSocket.set(null);
      console.log('WebSocket manually closed');
    }
  }

  public isChatSocketConnected(): boolean {
    const socket = this.chatSocket();
    return !!socket && socket.readyState === WebSocket.OPEN;
  }

  public hasChats(): boolean {
    return this.chats().length > 0;
  }

  public async addChat(user: number | undefined, sf?: () => void) {
    if (!user) return;

    // await new Promise((r, j) => setTimeout(() => {
    //   return r(true)
    // }, 3000))

    this.shared.http.post(this.chatsURL, { user }, this.shared.CredAndCsrf()).subscribe({
      next: (res: any) => {
        console.log(res);
        this.chatAddedLoading.set(false);
        this.userFetched.set(null);
        if(sf) sf();
      },
      error: (err) => {
        console.log(err);
        this.chatAddedLoading.set(false);
        this.shared.setErrors(err.error);
      },
    })
  }
}
