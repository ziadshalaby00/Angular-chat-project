import { inject, Injectable, signal } from '@angular/core';
import { SharedUtils } from '../shared-service/shared-utils';
import { ConfigService } from '../config-service/config-service';

export interface ResultType {
  "id": number,
  "chat": number,
  "sender": {
    "id": number,
    "fullname": string,
    "username": string,
    "user_image": string | null,
    "is_active": boolean,
    "is_deleted": boolean
  },
  "type": 'text' | 'audio' | 'file',
  "timestamp": string,
  "reply_to": ResultType | null,
  "audio_message": string | null,
  "file_message": string | null,
  "text_message": {
    "id": number,
    "content": string | null
  }
}
export interface ChatMessagesType {
  "count": number,
  "next": string | null,
  "previous": string | null,
  "results"?: ResultType[]
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly config = inject(ConfigService);
  private readonly shared: SharedUtils = inject(SharedUtils);
  
  public readonly currentChatId = signal<number | null>(31) ;
  public readonly chatMessagesChatId = signal<number | null>(null) ;

  public readonly chatMessagesMetaData = signal<ChatMessagesType | null>(null);
  public readonly chatMessages = signal<ResultType[] | null>(null);

  public readonly getChatMessagesLoading = signal<boolean>(false);

  private readonly getChatMessagesURL = `${this.config.apiUrl}/api/message/`;

  public getChatMessages(chat_id: number) {
    this.shared.http.get(`${this.getChatMessagesURL}${chat_id}/messages/`, this.shared.CredAndCsrf()).subscribe({
      next: (res) => {
        console.log(res);
        
        const data = res as ChatMessagesType
        const { results, ...meta } = data;

        this.chatMessagesChatId.set(chat_id);

        this.chatMessages.set([...(results ?? [])].reverse());
        this.chatMessagesMetaData.set(meta);

        this.getChatMessagesLoading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.getChatMessagesLoading.set(false);
        this.shared.setErrors(err.error);
      }
    })
  }
}
