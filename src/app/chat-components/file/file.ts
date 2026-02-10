import { Component, input } from '@angular/core';
import { ResultType } from '../../services/chat-service/chat-service';
import { MessageSettings } from '../message-settings/message-settings';

@Component({
  selector: 'app-file',
  imports: [MessageSettings],
  templateUrl: './file.html',
  styleUrl: './file.css',
})
export class File {
  readonly item = input.required<ResultType>();
  readonly isUserMessage = input.required<boolean>();
}
