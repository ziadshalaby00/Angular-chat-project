import { Component, computed, effect, inject, model, signal, TemplateRef, viewChild } from '@angular/core';
import { AuthApi } from '../../services/auth-services/auth-api';
import { Router } from '@angular/router';
import { Sidebar, Input, Card, AlertService, Button, Spinner, NavItem, NavbarItem } from '@ziadshalaby/ngx-zs-component';
import { Chat } from "../../chat-components/chat/chat";
import { ChatsService, ChatsType } from '../../services/chats-service/chats-service';
import { CommonModule } from '@angular/common';
import { SharedUtils } from '../../services/shared-service/shared-utils';
import { NewChat } from '../new-chat/new-chat';

@Component({
  selector: 'app-chats',
  imports: [Sidebar, Input, Card, Chat, Button, Spinner, CommonModule, NewChat, NavItem],
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

  readonly filteredChats = computed<ChatsType[]>(() => {
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

  readonly chatSettingsIconTpl = viewChild<TemplateRef<any>>('chatSettingsIcon')
  readonly chatSettings = signal<NavbarItem>({
    id: 'chat-settings',
    label: '',
    iconTpl: this.chatSettingsIconTpl,
    children: [
      {
        id: 'view-profile',
        label: 'View Profile',
      },
      {
        id: 'mark-as-read',
        label: 'Mark As Read',
      },
      {
        id: 'delete-chat',
        label: 'Delete Chat',
        colorClass: 'text-red-600 hover:text-red-800 dark:text-red-700 dark:hover:text-red-500'
      },
    ],
    childrenOpenWindow: true,
    childrenWindowDir: 'left',
    showChevronDownIcon: false,
    closeOnPointerOutside: true
  })

  readonly isSettingsHover = signal(false);
  itemClicked(event: NavbarItem, user_id: number) {
    console.log(event);
    console.log(user_id);
    if(event.id === 'view-profile') 
      this.router.navigate([`/profile/${user_id}`]);
  }
}
