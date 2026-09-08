import { Component, computed, effect, inject, untracked } from '@angular/core';
import { Button, Card } from '@ziadshalaby/ngx-zs-component';
import { CommonModule } from '@angular/common';
import { UserAvatar } from '../../chats-components/user-avatar/user-avatar';
import { ChatsService, ParticipantType } from '../../services/chats-service/chats-service';
import { CallService } from '../../services/call-service/call-service';

@Component({
  imports: [Card, Button, UserAvatar, CommonModule],
  selector: 'app-call',
  styleUrl: './call.css',
  templateUrl: './call.html',
})
export class Call {
  private readonly chatsService = inject(ChatsService);
  private readonly callService: CallService = inject(CallService);

  readonly incomingCall = this.chatsService.incomingCall;
  readonly showCallerCard = this.chatsService.showCallerCard;

  constructor() {
    effect(() => {
      const lastCallSignal = this.chatsService.lastCallSignal();

      untracked(() => {
        if(lastCallSignal?.type === 'call.end' && this.callService.currentCall() === null) {
          this.showCallerCard.set(false);
        }
      })
    })
  }

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

    this.callService.startCall(
      call.from_user_id,
      call.chat_id,
      'callee'
    )
  }

  reject(): void {
    const call = this.incomingCall();
    if (!call) return;

    this.chatsService.sendCallSignal({
      type: 'call.reject',
      to_user_id: call.from_user_id,
    });

    this.chatsService.incomingCall.set(null);
  }
}
