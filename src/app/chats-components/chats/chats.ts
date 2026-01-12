import { Component, computed, effect, inject, model, signal, TemplateRef, viewChild } from '@angular/core';
import { AuthApi } from '../../services/auth-services/auth-api';
import { Router } from '@angular/router';
import { Sidebar, Input, Card, AlertService, Button, Spinner, NavItem, NavbarItem, Modal } from '@ziadshalaby/ngx-zs-component';
import { Chat } from "../../chat-components/chat/chat";
import { ChatsService, ChatType } from '../../services/chats-service/chats-service';
import { CommonModule } from '@angular/common';
import { SharedUtils } from '../../services/shared-service/shared-utils';
import { NewChat } from '../new-chat/new-chat';

@Component({
  selector: 'app-chats',
  imports: [Sidebar, Input, Card, Chat, Button, Spinner, CommonModule, NewChat, NavItem, Modal],
  templateUrl: './chats.html',
  styleUrl: './chats.css',
})
export class Chats {
  readonly authApi: AuthApi = inject(AuthApi);
  readonly shared: SharedUtils = inject(SharedUtils);
  readonly chatsService: ChatsService = inject(ChatsService);
  
  readonly router: Router = inject(Router);
  readonly alert: AlertService = inject(AlertService);

  readonly sideBarFloating = signal<boolean>(false);

  constructor() {
    this.startingInitChats()
    
    effect(() => {
      const isLoggedin = this.authApi.isLoggedin()

      if(!isLoggedin) {
        // this.router.navigate(['/login']);
        this.alert.addAlert({
          message: 'You need to log in first.',
          type: 'info'
        })
      }
    })

    effect(() => {
      const min768px = this.shared.min768px()
      this.sideBarFloating.set(!min768px);
    })
  }

  startingInitChats() {
    if(!this.chatsService.hasChats()) {
      this.chatsService.chatsLoading.set(true);
      this.chatsService.getChats();
    }
    if(!this.chatsService.isChatSocketConnected()) {
      this.chatsService.connectChats();
    }
  }

  private readonly searchTerm = signal<string | null>(null);
  onSearchForChat(value: string | null) {
    this.searchTerm.set((value ?? '').toLowerCase().trim());
  }

  readonly filteredChats = computed<ChatType[]>(() => {
    const term = this.searchTerm();
    const chats = this.chatsService.chats();
    const myId = this.authApi.userData()?.id;

    if (!term) return chats;

    return chats.filter(chat => {
      const otherParticipant = chat.participants.find(
        p => p.user_info.id !== myId
      );

      if (!otherParticipant) return false;

      const { fullname, username } = otherParticipant.user_info;

      return (
        fullname?.toLowerCase().includes(term) ||
        username?.toLowerCase().includes(term)
      );
    });
  });

  readonly newChatModal = model<boolean>(false);
  readonly openSide = model<boolean>(true);

  readonly chatSettingsIconTpl = viewChild<TemplateRef<any>>('chatSettingsIcon');

  readonly viewProfileIconTpl = viewChild<TemplateRef<any>>('viewProfileIcon');
  readonly dismissUnreadIconTpl = viewChild<TemplateRef<any>>('dismissUnreadIcon');
  readonly removeChatIconTpl = viewChild<TemplateRef<any>>('removeChatIcon');

  readonly chatSettings = signal<NavbarItem>({
    id: 'chat-settings',
    label: '',
    iconTpl: this.chatSettingsIconTpl,
    children: [
      {
        id: 'view-profile',
        label: 'View Profile',
        iconTpl: this.viewProfileIconTpl,
      },
      {
        id: 'dismiss-unread',
        label: 'Dismiss Unread',
        iconTpl: this.dismissUnreadIconTpl
      },
      {
        id: 'remove-chat',
        label: 'Remove Chat',
        colorClass: 'text-red-600 hover:text-red-800 dark:text-red-700 dark:hover:text-red-500',
        iconTpl: this.removeChatIconTpl
      },
    ],
    childrenOpenWindow: true,
    childrenWindowDir: 'left',
    showChevronDownIcon: false,
    closeOnPointerOutside: true
  })

  getChatSettings(isDeleted: boolean = false): NavbarItem {
    const chatSettings = this.chatSettings();

    if (!isDeleted) {
      return chatSettings;
    }

    return {
      ...chatSettings,
      children: chatSettings.children?.filter(
        child => ['dismiss-unread', 'remove-chat'].includes(child.id as string)
      )
    };
  }

  readonly isSettingsHover = signal(false);
  itemClicked(event: NavbarItem, chat: ChatType, user_id: number) {
    console.log(event);
    console.log(chat);
    console.log(user_id);

    switch(event.id) {
      case 'view-profile': 
        this.router.navigate([`/profile/${user_id}`]);
        break;
      case 'dismiss-unread': 
        break;
      case 'remove-chat': 
        this.removeChatModal.set(true);
        this.removeChatId.set(chat.id);
        break;
    }
  }

  readonly loaderIconTpl = viewChild<TemplateRef<any>>('loaderIcon');
  readonly removeChatModal = signal<boolean>(false);
  readonly removeChatId = signal<number | null>(null);

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
