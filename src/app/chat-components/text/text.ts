import { Component, input } from '@angular/core';
import { ResultType } from '../../services/chat-service/chat-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-text',
  imports: [CommonModule],
  templateUrl: './text.html',
  styleUrl: './text.css',
})
export class Text {
  readonly item = input.required<ResultType>();
  readonly isUserMessage = input.required<boolean>();
}
