import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, inject, input, signal, viewChild } from '@angular/core';
import { ResultType } from '../../services/chat-service/chat-service';
import { CalcMSettingsDir } from '../../services/calc-m-settings-dir/calc-m-settings-dir';
import { MessageSettings } from '../message-settings/message-settings';
import { Text } from "../text/text";
import { Audio } from "../audio/audio";
import { File } from '../file/file';

@Component({
  selector: 'app-message',
  imports: [CommonModule, MessageSettings, Text, Audio, File],
  templateUrl: './message.html',
  styleUrl: './message.css',
})
export class Message {
  readonly item = input.required<ResultType>();
  readonly isUserMessage = input.required<boolean>();

  readonly calcMSettingsDir = inject(CalcMSettingsDir);
  readonly settingsDirection = computed<'left' | 'right'>(() => {
    if(this.isUserMessage()) {
      return this.calcMSettingsDir.recalculateDirection(
        this.messageBubble(),
        this.parentContainer()
      );
    }

    return 'right';
  });
  
  readonly messageBubble = viewChild<ElementRef<HTMLElement>>('messageBubble');
  readonly parentContainer = viewChild<ElementRef<HTMLElement>>('parentContainer');
}
