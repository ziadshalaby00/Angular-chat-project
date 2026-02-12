import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, inject, input, model, signal, viewChild } from '@angular/core';
import { ResultType } from '../../services/chat-service/chat-service';
import { CalcMSettingsDir } from '../../services/calc-m-settings-dir/calc-m-settings-dir';
import { MessageSettings } from '../message-settings/message-settings';
import { Text } from "../text/text";
import { Audio } from "../audio/audio";
import { File } from '../file/file';
import { Dir } from '../../services/shared-service/shared-utils';

@Component({
  selector: 'app-message',
  imports: [CommonModule, MessageSettings, Text, Audio, File],
  templateUrl: './message.html',
  styleUrl: './message.css',
})
export class Message {
  readonly item = input.required<ResultType>();
  readonly isUserMessage = input.required<boolean>();
  readonly parentContainerS = input.required<ElementRef<HTMLElement>>();

  readonly calcMSettingsDir = inject(CalcMSettingsDir);
  readonly settingsDirection = model<Dir>('bottom-right');
  
  readonly messageBubble = viewChild<ElementRef<HTMLElement>>('messageBubble');

  ngAfterViewInit() {
    if(this.isUserMessage()) {
      const dir: Dir = this.calcMSettingsDir.recalculateDirection(
        this.messageBubble(),
        this.parentContainerS()
      );
      this.settingsDirection.set(dir);
    }
  }
}
