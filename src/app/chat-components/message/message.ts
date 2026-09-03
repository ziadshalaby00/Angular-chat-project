import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, inject, input, model, signal, viewChild, viewChildren, ChangeDetectionStrategy } from '@angular/core';
import { ResultType } from '../../services/chat-service/chat-service';
import { CalcMSettingsDir } from '../../services/calc-m-settings-dir/calc-m-settings-dir';
import { MessageSettings } from '../message-settings/message-settings';
import { Text } from "../text/text";
import { Audio } from "../audio/audio";
import { FileComp } from '../file/file';
import { Dir, SharedUtils } from '../../services/shared-service/shared-utils';
import { OverflowCard } from '../../services/overflow-card/overflow-card';
import { SendMessageService } from '../../services/send-message/send-message';

@Component({
  selector: 'app-message',
  imports: [CommonModule, MessageSettings, Text, Audio, FileComp],
  templateUrl: './message.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './message.css',
})
export class Message {
  readonly sendMessageService: SendMessageService = inject(SendMessageService);
  
  readonly item = input.required<ResultType>();
  readonly isUserMessage = input.required<boolean>();
  readonly parentContainerS = input.required<ElementRef<HTMLElement>>();
  readonly shared: SharedUtils = inject(SharedUtils);

  readonly overflowCard: OverflowCard = inject(OverflowCard);

  readonly calcMSettingsDir = inject(CalcMSettingsDir);
  readonly settingsDirection = model<Dir>('bottom-right');
  
  readonly messageBubble = viewChild<ElementRef<HTMLElement>>('messageBubble');

  startCalcDir() {
    if(this.isUserMessage()) {
      const dir: Dir = this.calcMSettingsDir.recalculateDirection(
        this.messageBubble(),
        this.parentContainerS()
      );
      this.settingsDirection.set(dir);
    }
  }

  // ==================== 1. Scroll to specific message ====================
  scrollToMessage(messageId: number | undefined): void {
    if (!messageId) return;

    const targetElement = document.getElementById(`message-card${messageId}`);
    
    if (targetElement) {
      targetElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      
      targetElement.classList.add('bg-emerald-500/30', 'dark:bg-emerald-800/70', 'p-2');
      setTimeout(() => {
        targetElement.classList.remove('bg-emerald-500/30', 'dark:bg-emerald-800/70', 'p-2');
      }, 1500);
    }
  }
}
