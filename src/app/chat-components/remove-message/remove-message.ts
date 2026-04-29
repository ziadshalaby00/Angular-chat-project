import { Component, inject, input, model, TemplateRef, viewChild } from '@angular/core';
import { Modal } from '@ziadshalaby/ngx-zs-component';
import { ChatService } from '../../services/chat-service/chat-service';

@Component({
  selector: 'app-remove-message',
  imports: [Modal],
  templateUrl: './remove-message.html',
  styleUrl: './remove-message.css',
})
export class RemoveMessage {
  readonly removeMessageModal = model<boolean>(false);

  readonly chatService: ChatService = inject(ChatService);
  readonly removeMessageId = input.required<number>()
  
  RemoveMessage() {
    const id = this.removeMessageId();
    if(!id) return;
    this.chatService.removeMessage(id);
    this.removeMessageModal.set(false);
  }
}
