import { Component, input } from '@angular/core';

import { Text_message } from '../../services/chat-service/chat-service';

@Component({
  selector: 'app-text',
  imports: [],
  templateUrl: './text.html',
  styleUrl: './text.css',
})
export class Text {
  readonly text_message = input.required<Text_message>();
}
