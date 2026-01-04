import { inject, Injectable, signal } from '@angular/core';
import { ConfigService } from './config-service';

export interface ParticipantType {
  "user_info": {
      "id": number,
      "fullname": string,
      "username": string,
      "user_image": string,
      "is_active": boolean,
      "is_deleted": boolean
  }
}
export interface ChatsType {
    "id": number;
    "participants": ParticipantType[];
    "created_at": string;
    "unread_count": number;
}

interface WebSocketMessageType {
  type: 'chat_created' | 'new_message_notification';
  chat: ChatsType
}

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  private readonly config = inject(ConfigService)

  public readonly chats = signal<ChatsType[]>([]);
  public readonly chatsLoading = signal<boolean>(false);

  private readonly chatsURL = `${this.config.apiUrl}/api/chat/chats/`;

  public getChats() {
    this.config.http.get(this.chatsURL, this.config.CredAndCsrf()).subscribe({
      next: (res: any) => {
        console.log(res);
        this.chats.set(res.chats as ChatsType[]);
        this.chatsLoading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.config.setErrors(err.error);
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
        this.chats.update((prev) => [...prev, data.chat])
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
}
