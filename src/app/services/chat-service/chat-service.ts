import { inject, Injectable, signal } from '@angular/core';
import { SharedUtils } from '../shared-service/shared-utils';
import { ConfigService } from '../config-service/config-service';

export interface Text_message {
  "id": number,
  "content": string
}
export interface Audio_message {
  "audio_file": string,
  "audio_duration": number
}
export interface File_message {
  "file": string,
  "file_name": string,
  "file_size": number,
  "file_type": string
}
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
  "audio_message": Audio_message | null,
  "file_message": File_message | null,
  "text_message": Text_message | null
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
  public readonly loadMoreMessagesLoading = signal<boolean>(false);

  private readonly page = signal<number>(1);
  private readonly getChatMessagesURL = `${this.config.apiUrl}/api/message/`;

  public getChatMessages(chat_id: number, sf?: () => void) {
    this.shared.http.get(`${this.getChatMessagesURL}${chat_id}/messages/?page=${this.page()}`, this.shared.CredAndCsrf()).subscribe({
      next: (res) => {
        const data = res as ChatMessagesType
        const { results, ...meta } = data;
        
        const newMessages = (results ?? []).reverse();
        const oldMessages = this.chatMessages() ?? [];

        this.chatMessages.set(
          [...newMessages, ...oldMessages]
        );
        this.chatMessagesMetaData.set(meta);

        this.chatMessagesChatId.set(chat_id);
        this.getChatMessagesLoading.set(false);
        this.loadMoreMessagesLoading.set(false);

        if(sf) sf();
      },
      error: (err) => {
        this.getChatMessagesLoading.set(false);
        this.loadMoreMessagesLoading.set(false);
        this.shared.setErrors(err.error);
      }
    })
  }

  public currentChatHasNext(): boolean {
    const next = this.chatMessagesMetaData()?.next
    const currentChatId = this.currentChatId();
    return (next && currentChatId) ? true : false;
  }

  public loadMoreMessages(sf?: () => void) {
    if(this.currentChatHasNext()) {
      this.loadMoreMessagesLoading.set(true);
      this.page.update((v) => ++v);
      this.getChatMessages(this.currentChatId()!, sf);
    }
  }

  public resetChat() {
    this.chatMessagesChatId.set(null);
    this.chatMessagesMetaData.set(null);
    this.chatMessages.set(null);
    this.page.set(1);
  }
}
