import { ChatsService } from './../../services/chats-service/chats-service';
import { Component, inject, model } from '@angular/core';
import { Button, Card, Input, Modal, FormStyle } from '@ziadshalaby/ngx-zs-component';

@Component({
  selector: 'app-new-chat',
  imports: [Modal, Input, Button, Card],
  templateUrl: './new-chat.html',
  styleUrl: './new-chat.css',
})
export class NewChat {
  readonly chatsService: ChatsService = inject(ChatsService);
  readonly newChatModal = model<boolean>(true);
  readonly usernameValue = model<string>('ahmed123');

  findUser() {
    this.chatsService.userFetchedLoading.set(true)
    this.chatsService.getUserByUserName(this.usernameValue())
  }
}
