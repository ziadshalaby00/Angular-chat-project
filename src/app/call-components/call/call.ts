import { Component, computed, effect, inject, input } from '@angular/core';
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

  readonly lastCallSignals = computed(() => {
    const callSignals = this.chatsService.callSignals();
    return callSignals[callSignals.length - 1];
  })

  closeIfTheOntherEndedBeforIChoice() {
    if(this.lastCallSignals().type === 'call.end') {
      this.chatsService.callSignals.set([]);
      return true
    };
    return false
  }

  constructor() {
    effect(() => {
      const signals = this.chatsService.callSignals();
      for(const signal of signals) {
        if(signal.type === 'call.end' || signal.type === 'call.reject') {
          this.showCallerCard.set(false);
        }
      }
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

    this.showCallerCard.set(false);
    if (this.closeIfTheOntherEndedBeforIChoice()) return;

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

    this.showCallerCard.set(false);
    if (this.closeIfTheOntherEndedBeforIChoice()) return;

    this.chatsService.sendCallSignal({
      type: 'call.reject',
      to_user_id: call.from_user_id,
    });

    this.chatsService.incomingCall.set(null);
  }
}
