import { Component, computed, effect, ElementRef, inject, model, signal, TemplateRef, untracked, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { AuthApi } from '../../services/auth-services/auth-api';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../services/chat-service/chat-service';
import { ChatsService, ChatType } from '../../services/chats-service/chats-service';
import { NavbarItem, Spinner } from '@ziadshalaby/ngx-zs-component';
import { Dir, SharedUtils } from '../../services/shared-service/shared-utils';
import { RemoveChat } from '../../chats-components/remove-chat/remove-chat';
import { UserAvatar } from '../../chats-components/user-avatar/user-avatar';
import { IconContainer } from '../../other-components/icon-container/icon-container';
import { SettingsUi } from '../../other-components/settings-ui/settings-ui';
import { Message } from '../message/message';
import { SendMessage } from '../send-message/send-message';
import { SendMessageService } from '../../services/send-message/send-message';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, Spinner, IconContainer, RemoveChat, UserAvatar, Message, SettingsUi, SendMessage],
  templateUrl: './chat.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './chat.css',
})
export class Chat {
  readonly authApi: AuthApi = inject(AuthApi);
  readonly router: Router = inject(Router);
  readonly shared: SharedUtils = inject(SharedUtils);
  
  readonly openSide = model<boolean>(true);
  readonly chatService: ChatService = inject(ChatService);
  readonly chatsService: ChatsService = inject(ChatsService);
  readonly sendMessageService: SendMessageService = inject(SendMessageService);

  readonly parentContainerS = viewChild<ElementRef<HTMLElement>>('parentContainer');

  readonly currentChat = computed<ChatType | null>(() =>
    this.chatsService.chats()
      .find(chat => chat.id === this.chatService.currentChatId()) ?? null
  );

  
  // ==============================================================================================
  // ==============================================================================================
  readonly messagesContainerS = viewChild<ElementRef<HTMLElement>>('messagesContainer');
  constructor() {
    effect(() => {
      const currentChat: number | null = this.chatService.currentChatId();
      untracked(() => {
        if(!currentChat) {
          this.chatService.resetChat();
          this.sendMessageService.disconnectMessage();
          return;
        }else {
          if(this.chatService.currentChatId() !== this.chatService.chatMessagesChatId()) {
            this.chatsService.markAsRead(currentChat);
            this.chatService.getChatMessagesLoading.set(true);
            this.chatService.getChatMessages(currentChat);

            this.sendMessageService.disconnectMessage()
            this.sendMessageService.connectMessage(currentChat);
          }
        }
      })
    })

    effect(() => {
      const sendedMessage = this.sendMessageService.sendedMessage();
      if(!sendedMessage) return;
      
      untracked(() => {
        const userSendMessage = this.sendMessageService.userSendMessage();
        this.scrollToBottom(!userSendMessage);

        this.sendMessageService.sendedMessage.set(false);
        this.sendMessageService.userSendMessage.set(false);
      })
    });
  }

  private isAutoScrolling = false;
  async scrollToBottom(ifNear: boolean = false, retry = 0): Promise<any> {
    if (retry > 5) return;

    const container = this.parentContainerS()?.nativeElement;
    if (!container || this.isAutoScrolling) return;

    const threshold = container.clientHeight / 2;
    const isNearBottom = Math.abs(container.scrollTop) <= threshold;

    if (ifNear && !isNearBottom) return;

    this.isAutoScrolling = true;

    const target = 0;

    console.log('scroll')
    container.scrollTo({
      top: target,
      behavior: 'smooth'
    });

    await this.waitForScrollEnd(container);

    if (Math.abs(container.scrollTop - target) > 2) {
      this.isAutoScrolling = false;
      console.log('retry scroll')
      return this.scrollToBottom(ifNear, retry + 1);
    }

    this.isAutoScrolling = false;
  }

  private waitForScrollEnd(container: HTMLElement): Promise<void> {
    return new Promise((resolve) => {
      let last = container.scrollTop;
      let sameCount = 0;

      const check = () => {
        const current = container.scrollTop;

        if (Math.abs(current - last) < 1) {
          sameCount++;
        } else {
          sameCount = 0;
        }

        last = current;

        if (sameCount > 5) {
          resolve();
        } else {
          requestAnimationFrame(check);
        }
      };

      requestAnimationFrame(check);
    });
  }
  // ==============================================================================================
  // ==============================================================================================


  readonly chatSettingsIconTpl = viewChild<TemplateRef<any>>('chatSettingsIcon');
  readonly viewProfileIconTpl = viewChild<TemplateRef<any>>('viewProfileIcon');
  readonly removeChatIconTpl = viewChild<TemplateRef<any>>('removeChatIcon');

  readonly chatSettings = {
    children: [
      {
        id: 'view-profile',
        label: 'View Profile',
        colorClass: 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 group',
        iconTpl: this.viewProfileIconTpl,
      },
      {
        id: 'remove-chat',
        label: 'Remove Chat',
        colorClass: 'text-red-600 hover:text-red-800 dark:text-red-700 dark:hover:text-red-500 group',
        iconTpl: this.removeChatIconTpl
      },
    ],
    childrenConfig: {
      childrenOpenWindow: true,
      childrenWindowDir: 'bottom-left' as Dir,
      showChevronDownIcon: false,
      closeMenuOnPointerOutside: true
    }
  };

  getChatSettings(isDeleted: boolean = false) {
    const chatSettings = this.chatSettings;

    if (!isDeleted) {
      return chatSettings;
    }

    return {
      ...chatSettings,
      children: chatSettings.children?.filter(
        child => ['remove-chat'].includes(child.id as string)
      )
    };
  }

  readonly removeChatModal = signal<boolean>(false);
  itemClicked(event: NavbarItem, user_id: number) {
    switch(event.id) {
      case 'view-profile': 
        this.router.navigate([`/profile/${user_id}`]);
        break;
      case 'remove-chat': 
        this.removeChatModal.set(true);
        break;
    }
  }

  exitChat() {
    this.chatService.currentChatId.set(null);
  }

  isUserMessage(sender_id: number): boolean {
    return sender_id === this.authApi.userData()?.id;
  }

  onLoadMoreMessages() {
    this.chatService.loadMoreMessages();
  }
}
