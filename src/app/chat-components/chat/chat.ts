import { Component, effect, inject, model } from '@angular/core';
import { AuthApi } from '../../services/auth-services/auth-api';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../services/chat-service/chat-service';
import { ChatsService } from '../../services/chats-service/chats-service';
import { Spinner } from '@ziadshalaby/ngx-zs-component';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, Spinner],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat {
  readonly openSide = model<boolean>(true);
  readonly chatService: ChatService = inject(ChatService);
  readonly chatsService: ChatsService = inject(ChatsService);

  constructor() {
    effect(() => {
      const currentChat: number | null = this.chatService.currentChat();
      if(!currentChat) {

        return;
      }else {
        this.chatsService.markAsRead(currentChat);
        this.chatService.getChatMessagesLoading.set(true);
        this.chatService.getChatMessages();
      }
    })
  }
}
