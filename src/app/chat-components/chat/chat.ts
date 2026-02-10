import { Component, computed, effect, inject, model, signal, TemplateRef, untracked, viewChild } from '@angular/core';
import { AuthApi } from '../../services/auth-services/auth-api';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../services/chat-service/chat-service';
import { ChatsService, ChatType } from '../../services/chats-service/chats-service';
import { Button, NavbarItem, NavItem, Spinner } from '@ziadshalaby/ngx-zs-component';
import { SharedUtils } from '../../services/shared-service/shared-utils';
import { RemoveChat } from '../../chats-components/remove-chat/remove-chat';
import { UserAvatar } from '../../chats-components/user-avatar/user-avatar';
import { IconContainer } from '../../other-components/icon-container/icon-container';
import { Audio } from '../audio/audio';
import { File } from '../file/file';
import { Text } from '../text/text';
import { SettingsUi } from '../../other-components/settings-ui/settings-ui';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, Spinner, IconContainer, RemoveChat, UserAvatar, Text, Audio, File, SettingsUi],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat {
  readonly authApi: AuthApi = inject(AuthApi);
  readonly router: Router = inject(Router);
  readonly shared: SharedUtils = inject(SharedUtils);
  
  readonly openSide = model<boolean>(true);
  readonly chatService: ChatService = inject(ChatService);
  readonly chatsService: ChatsService = inject(ChatsService);

  readonly messages = computed(() => this.chatService.chatMessages()?.results.reverse() ?? []);

  readonly currentChat = computed<ChatType | null>(() =>
    this.chatsService.chats()
      .find(chat => chat.id === this.chatService.currentChatId()) ?? null
  );

  constructor() {
    effect(() => {
      const currentChat: number | null = this.chatService.currentChatId();
      untracked(() => {
        if(!currentChat) {
          this.chatService.chatMessages.set(null);
          this.chatService.chatMessagesChatId.set(null);
          return;
        }else {
          if(this.chatService.currentChatId() !== this.chatService.chatMessagesChatId()) {
            this.chatsService.markAsRead(currentChat);
            this.chatService.getChatMessagesLoading.set(true);
            this.chatService.getChatMessages(currentChat);
          }
        }
      })
    })
  }

  readonly chatSettingsIconTpl = viewChild<TemplateRef<any>>('chatSettingsIcon');
  readonly viewProfileIconTpl = viewChild<TemplateRef<any>>('viewProfileIcon');
  readonly dismissUnreadIconTpl = viewChild<TemplateRef<any>>('dismissUnreadIcon');
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
    childrenOpenWindow: true,
    childrenWindowDir: 'left' as 'left' | 'right',
    showChevronDownIcon: false,
    closeOnPointerOutside: true
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
}
