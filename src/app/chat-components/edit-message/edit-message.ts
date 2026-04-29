import { Component, inject, input, model } from '@angular/core';
import { ChatService } from '../../services/chat-service/chat-service';
import { Input, Modal } from '@ziadshalaby/ngx-zs-component';

@Component({
  selector: 'app-edit-message',
  imports: [Modal, Input],
  templateUrl: './edit-message.html',
  styleUrl: './edit-message.css',
})
export class EditMessage {
  readonly editMessageModal = model<boolean>(false);

  readonly chatService: ChatService = inject(ChatService);
  
  readonly newMessage = model.required<string | null>();
  readonly editMessageId = input.required<number | null>();
  
  EditMessage() {
    const id = this.editMessageId();
    const newMessage = this.newMessage();

    if(!newMessage || !id) return;

    this.chatService.editMessage(id, newMessage);
    this.editMessageModal.set(false);
  }
}
