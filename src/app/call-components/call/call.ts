import { Component, computed, inject, input } from '@angular/core';
import { Button, Card } from '@ziadshalaby/ngx-zs-component';
import { CommonModule } from '@angular/common';
import { UserAvatar } from '../../chats-components/user-avatar/user-avatar';
import { ChatsService, ParticipantType } from '../../services/chats-service/chats-service';
import { Router } from '@angular/router';

@Component({
  imports: [Card, Button, UserAvatar, CommonModule],
  selector: 'app-call',
  styleUrl: './call.css',
  templateUrl: './call.html',
})
export class Call {
  private readonly router = inject(Router);
  private readonly chatsService = inject(ChatsService);

  readonly incomingCall = this.chatsService.incomingCall;
  readonly showCallerCard = this.chatsService.showCallerCard;

  readonly participant = computed<ParticipantType | undefined>(() => {
    const call = this.incomingCall();
    if (!call) return undefined;

    const chat = this.chatsService.chats().find((c) => c.id === call.chat_id);

    return chat?.participants.find(
      (p) => p.user_info.id === call.from_user_id
    )?.user_info;
  });

  accept(): void {
    const call = this.incomingCall();
    if (!call) return;

    this.chatsService.showCallerCard.set(false);

    this.router.navigate(['/calling-page'], {
      queryParams: {
        toUserId: call.from_user_id,
        chatId: call.chat_id,
        role: 'callee',
      },
    });
  }

  reject(): void {
    const call = this.incomingCall();
    if (!call) return;

    this.chatsService.showCallerCard.set(false);

    this.chatsService.sendCallSignal({
      type: 'call.reject',
      to_user_id: call.from_user_id,
    });

    this.chatsService.incomingCall.set(null);
  }
}
