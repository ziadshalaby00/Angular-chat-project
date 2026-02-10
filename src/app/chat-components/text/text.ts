import { Component, inject, input, TemplateRef, viewChild } from '@angular/core';
import { ResultType } from '../../services/chat-service/chat-service';
import { CommonModule } from '@angular/common';
import { MessageSettings } from '../message-settings/message-settings';

@Component({
  selector: 'app-text',
  imports: [CommonModule, MessageSettings],
  templateUrl: './text.html',
  styleUrl: './text.css',
})
export class Text {
  readonly item = input.required<ResultType>();
  readonly isUserMessage = input.required<boolean>();
}
