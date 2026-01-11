import { ChatsService } from './../../services/chats-service/chats-service';
import { Component, inject, model } from '@angular/core';
import { Button, Card, Input, Modal, FormStyle, Spinner } from '@ziadshalaby/ngx-zs-component';

@Component({
  selector: 'app-new-chat',
  imports: [Modal, Input, Button, Card, Spinner],
  templateUrl: './new-chat.html',
  styleUrl: './new-chat.css',
})
export class NewChat {
  readonly chatsService: ChatsService = inject(ChatsService);
  readonly newChatModal = model<boolean>(false);
  readonly usernameValue = model<string>('');

  findUser() {
    this.chatsService.userFetchedLoading.set(true)
    this.chatsService.getUserByUserName(this.usernameValue())
  }

  addChat() {
    this.chatsService.chatAddedLoading.set(true);
    const id = this.chatsService.userFetched()?.id;
    this.chatsService.addChat(id, () => this.newChatModal.set(false));
  }
}
