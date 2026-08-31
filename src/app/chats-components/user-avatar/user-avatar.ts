import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { ParticipantType } from '../../services/chats-service/chats-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-avatar',
  imports: [CommonModule],
  templateUrl: './user-avatar.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './user-avatar.css',
})
export class UserAvatar {
  readonly participant = input<{ user_info: ParticipantType; }>();
  readonly isCurrentChat = input<boolean>(false);
}
