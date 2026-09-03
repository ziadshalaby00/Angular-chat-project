import { Component, input } from '@angular/core';
import { Button, Card } from '@ziadshalaby/ngx-zs-component';
import { CommonModule } from '@angular/common';
import { UserAvatar } from '../../chats-components/user-avatar/user-avatar';
import { ParticipantType } from '../../services/chats-service/chats-service';

@Component({
  imports: [Card, Button, UserAvatar, CommonModule],
  selector: 'app-call',
  styleUrl: './call.css',
  templateUrl: './call.html',
})
export class Call {
  readonly participant = input<ParticipantType>();
}
