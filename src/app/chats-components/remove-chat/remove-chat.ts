import { Component, inject, input, model, TemplateRef, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { Modal } from '@ziadshalaby/ngx-zs-component';
import { ChatsService } from '../../services/chats-service/chats-service';

@Component({
  selector: 'app-remove-chat',
  imports: [Modal],
  templateUrl: './remove-chat.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './remove-chat.css',
})
export class RemoveChat {
  readonly removeChatModal = model<boolean>(false);
  readonly loaderIconTpl = viewChild<TemplateRef<any>>('loaderIcon');

  readonly chatsService: ChatsService = inject(ChatsService);
  readonly removeChatId = model<number | null>()
  
  RemoveChat() {
    const id = this.removeChatId();
    if(!id) return;
    this.chatsService.removeChatLoading.set(true);
    this.chatsService.removeChat(
      id,
      () => {
        this.removeChatId.set(null);
        this.removeChatModal.set(false);
      },
      () => this.removeChatId.set(null)
    );
  }
}
