import { Component, computed, effect, inject, untracked } from '@angular/core';
import { Button, Card } from '@ziadshalaby/ngx-zs-component';
import { CommonModule } from '@angular/common';
import { UserAvatar } from '../../chats-components/user-avatar/user-avatar';
import { ChatsService, ParticipantType } from '../../services/chats-service/chats-service';
import { CallService } from '../../services/call-service/call-service';
import { ChatsCallService } from '../../services/chats-call-service/chats-call-service';

@Component({
  imports: [Card, Button, UserAvatar, CommonModule],
  selector: 'app-call',
  styleUrl: './call.css',
  templateUrl: './call.html',
})
export class Call {
  private readonly chatsService = inject(ChatsService);
  private readonly chatsCallService = inject(ChatsCallService);
  private readonly callService: CallService = inject(CallService);

  readonly incomingCall = this.chatsCallService.incomingCall;
  readonly showCallerCard = this.chatsCallService.showCallerCard;
  readonly participant = this.callService.participant;

  constructor() {
    effect(() => {
      const endOrReject = this.chatsCallService.endOrRejectSignal();

      untracked(() => {
        if(this.callService.currentCall() === null) {
          this.showCallerCard.set(false);
        }
      })
    })
  }

  accept(): void {
    const call = this.incomingCall();
    if (!call) return;

    console.log('Accept');

    this.showCallerCard.set(false);
    this.chatsCallService.endOrRejectSignal.set(null);

    this.callService.startCall(
      call.from_user_id,
      call.chat_id,
      'callee'
    )
  }

  reject(): void {
    const call = this.incomingCall();
    if (!call) return;

    console.log('Reject');

    this.chatsService.sendCallSignal({
      type: 'call.reject',
      to_user_id: call.from_user_id,
    });
  
    this.callService.endCallToMe();
  }
}
