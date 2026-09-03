import { ChatService } from './../chat-service/chat-service';
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
export interface ChatType {
  "id": number;
  "participants": { "user_info": ParticipantType }[];
  "created_at": string;
  "unread_count": number;
}

export interface IncomingCallType {
  from_user_id: number;
  chat_id: number;
  sdp: RTCSessionDescriptionInit;
  call_type: string;
}

interface CallSignalType {
  type: 'call.answer' | 'call.ice_candidate' | 'call.end' | 'call.reject';
  sdp?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
  from_user_id: number;
}

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  private readonly config = inject(ConfigService);
  private readonly shared: SharedUtils = inject(SharedUtils);
  private readonly chatService: ChatService = inject(ChatService);

  public readonly chats = signal<ChatType[]>([]);
  public readonly chatsLoading = signal<boolean>(false);

  public readonly userFetched = signal<UserFetchedType | null>(null);
  public readonly userFetchedLoading = signal<boolean>(false);
  public readonly chatAddedLoading = signal<boolean>(false);
  public readonly removeChatLoading = signal<boolean>(false);

  public readonly showCallerCard = signal<boolean>(false);

  private readonly chatsURL = `${this.config.apiUrl}/api/chat/chats/`;
  private readonly deleteChatURL = `${this.config.apiUrl}/api/chat/chats/delete/`;
  private readonly markAsReadURL = `${this.config.apiUrl}/api/chat/mark-read/`;
  private readonly getUserByUserNameURL = `${this.config.apiUrl}/api/chat/get-user-by-username/`;

  public getChats() {
    this.shared.http.get(this.chatsURL, this.shared.CredAndCsrf()).subscribe({
      next: (res: any) => {
        this.chats.set(res.chats as ChatType[]);
        this.chatsLoading.set(false);
      },
      error: (err) => {
        this.shared.setErrors(err.error);
      },
    })
  }

  public getUserByUserName(username: string) {
    this.shared.http.get(`${this.getUserByUserNameURL}?username=${username}`, 
      this.shared.CredAndCsrf()).subscribe({
      next: (res: any) => {
        this.userFetchedLoading.set(false);
        this.userFetched.set(res.user as UserFetchedType);
      },
      error: (err) => {
        this.userFetchedLoading.set(false);
        this.userFetched.set(null);
        this.shared.setErrors(err.error);
      },
    })
  }

  private readonly chatSocket = signal<WebSocket | null>(null);
  public readonly incomingCall = signal<IncomingCallType | null>(null);
  public readonly callSignals = signal<CallSignalType[]>([]);
  public connectChats() {
    this.disconnectChats();

    const webSocket = new WebSocket(
      `${this.config.WsProtocol}://${this.config.socketUrl}/ws/chats/`
    );
    this.chatSocket.set(webSocket);

    if (!this.chatSocket()) return;
    this.chatSocket()!.onopen = () => {
      console.log('Ws chats opend')
    };

    this.chatSocket()!.onerror = (error) => {
      console.error(error);
    };

    this.chatSocket()!.onclose = () => {
      console.log('Ws chats closed')
    };

    this.chatSocket()!.onmessage = (event) => {
      const data: any = JSON.parse(event.data);
      if (!data) return;

      if (data.type === 'chat_created') {
        this.chats.update((prev) => [...prev!, data.chat!]);
      }
      else if (data.type === 'new_message_notification') {
        const chat_id = data.chat_id;
        if(this.chatService.currentChatId() === chat_id) return;

        this.chats.update((chats) => 
          chats!.map((chat) => {
            if (chat.id === chat_id) {
              return {
                ...chat,
                unread_count: chat.unread_count + 1
              };
            }
            return chat;
          })
        )
      }
      else if (data.type === 'call.offer') {
        this.incomingCall.set(data);
        this.showCallerCard.set(true);
      }
      else if (['call.answer', 'call.ice_candidate', 'call.end', 'call.reject'].includes(data.type)) {
        console.log(data);
        this.callSignals.update(signals => [...signals, data]);
      }
    };
  }

  public sendCallSignal(payload: Record<string, any>): void {
    this.chatSocket()?.send(JSON.stringify(payload));
  }

  public disconnectChats() {
    const socket = this.chatSocket();

    if (socket) {
      socket.close();
      this.chatSocket.set(null);
    }
  }

  public isChatSocketConnected(): boolean {
    const socket = this.chatSocket();
    return !!socket && socket.readyState === WebSocket.OPEN;
  }

  public hasChats(): boolean {
    return this.chats().length > 0;
  }

  public addChat(user: number | undefined, sf?: () => void) {
    if (!user) return;

    this.shared.http.post(this.chatsURL, { user }, this.shared.CredAndCsrf()).subscribe({
      next: (res: any) => {
        this.chats.update(prev => [res.chat, ...prev])
        this.chatAddedLoading.set(false);
        this.userFetched.set(null);
        if(sf) sf();
      },
      error: (err) => {
        this.chatAddedLoading.set(false);
        this.shared.setErrors(err.error);
      },
    })
  }

  public removeChat(chat_id: number, sc?: () => void, fd?: () => void) {
    this.shared.http.delete(`${this.deleteChatURL}${chat_id}/`, this.shared.CredAndCsrf()).subscribe({
      next: (res: any) => {
        if(res.chat_id === this.chatService.currentChatId()) {
          this.chatService.currentChatId.set(null);
        }
        this.chats.update(prev => 
          prev.filter(chat => chat.id !== res.chat_id)
        );
        this.removeChatLoading.set(false);
        if(sc) sc();
      },
      error: (err) => {
        this.shared.setErrors(err.error);
        this.removeChatLoading.set(false);
        if(fd) fd();
      },
    })
  }

  public markAsRead(chat_id: number, sc?: (message: string) => void, fd?: () => void) {
    this.shared.http.post(`${this.markAsReadURL}${chat_id}/`, {}, this.shared.CredAndCsrf()).subscribe({
      next: (res: any) => {
        this.chats.update(prev =>
          prev.map(chat =>
            chat.id === chat_id
              ? { ...chat, unread_count: 0 }
              : chat
          )
        );
        if(sc) sc(res.detail);
      },
      error: (err) => {
        this.shared.setErrors(err.error);
        if(fd) fd();
      },
    })
  }
}
