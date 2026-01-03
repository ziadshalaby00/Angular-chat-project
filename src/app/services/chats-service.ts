import { inject, Injectable, signal } from '@angular/core';
import { ConfigService } from './config-service';

interface ParticipantType {
  "user_info": {
      "id": number,
      "fullname": string,
      "username": string,
      "user_image": string,
      "is_active": boolean,
      "is_deleted": boolean
  }
}
interface ChatsType {
    "id": number;
    "participants": ParticipantType[];
    "created_at": string;
    "unread_count": number;
}

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  private readonly config = inject(ConfigService)

  readonly chats = signal<ChatsType[]>([]);
  readonly chatsLoading = signal<boolean>(false);

  private readonly chatsURL = `${this.config.apiUrl}/api/chat/chats/`;

  getChats() {
    this.config.http.get(this.chatsURL, this.config.CredAndCsrf()).subscribe({
      next: (res: any) => {
        console.log(res);
        this.chats.set(res.chats as ChatsType[]);
        this.chatsLoading.set(false);
      },
      error: (err) => {
        console.log(err)
      },
    })
  }
}
