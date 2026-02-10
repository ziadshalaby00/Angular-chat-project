import { Component, input } from '@angular/core';
import { ResultType } from '../../services/chat-service/chat-service';
import { MessageSettings } from '../message-settings/message-settings';

@Component({
  selector: 'app-audio',
  imports: [MessageSettings],
  templateUrl: './audio.html',
  styleUrl: './audio.css',
})
export class Audio {
  readonly item = input.required<ResultType>();
  readonly isUserMessage = input.required<boolean>();
}
