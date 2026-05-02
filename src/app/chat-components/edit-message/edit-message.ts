import { Component, ElementRef, inject, input, model, viewChild } from '@angular/core';
import { ChatService } from '../../services/chat-service/chat-service';
import { Input, Modal } from '@ziadshalaby/ngx-zs-component';

@Component({
  selector: 'app-edit-message',
  imports: [Modal],
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

  readonly messageInput = viewChild<ElementRef<HTMLTextAreaElement>>('messageInput');
  onInput(event: Event) {
    const value = (event.target as HTMLTextAreaElement).value;
    this.newMessage.set(value);
    this.autoResize();
  }

  autoResize() {
    const textarea = this.messageInput()?.nativeElement;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 128) + 'px';
  }
}
