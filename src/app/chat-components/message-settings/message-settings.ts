import { Component, inject, input, model, TemplateRef, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { SettingsUi } from '../../other-components/settings-ui/settings-ui';
import { IconContainer } from '../../other-components/icon-container/icon-container';
import { Dir } from '../../services/shared-service/shared-utils';
import { NavbarItem } from '@ziadshalaby/ngx-zs-component';
import { RemoveMessage } from '../remove-message/remove-message';
import { EditMessage } from '../edit-message/edit-message';
import { ResultType } from '../../services/chat-service/chat-service';
import { SendMessageService } from '../../services/send-message/send-message';

@Component({
  selector: 'app-message-settings',
  imports: [SettingsUi, IconContainer, RemoveMessage, EditMessage],
  templateUrl: './message-settings.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './message-settings.css',
})
export class MessageSettings {
  readonly sendMessageService: SendMessageService = inject(SendMessageService);
  
  readonly type = input.required<'text' | 'file' | 'audio'>();
  readonly item = input.required<ResultType>();

  readonly settingsDirection = model.required<Dir>();

  readonly editMessageIconTpl = viewChild<TemplateRef<any>>('editMessageIcon');
  readonly deleteMessageIconTpl = viewChild<TemplateRef<any>>('deleteMessageIcon');
  readonly replyToMessageIconTpl = viewChild<TemplateRef<any>>('replyToMessageIcon');

  readonly messageSettings = {
    children: [
      {
        id: 'Reply',
        label: 'Reply',
        colorClass: 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 group',
        iconTpl: this.replyToMessageIconTpl
      },
      {
        id: 'Edit',
        label: 'Edit',
        colorClass: 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 group',
        iconTpl: this.editMessageIconTpl,
      },
      {
        id: 'Delete',
        label: 'Delete',
        colorClass: 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 group',
        iconTpl: this.deleteMessageIconTpl
      },
    ],
    childrenConfig: {
      childrenOpenWindow: true,
      childrenWindowDir: 'bottom-right' as Dir,
      showChevronDownIcon: false,
      closeMenuOnPointerOutside: true
    }
  }

  get getMessageSettings() {
    const messageSettings = {
      ...this.messageSettings,
      childrenConfig: {
        ...this.messageSettings.childrenConfig,
        childrenWindowDir: this.settingsDirection() as Dir,
      }
    };

    const type = this.type();
    if(type === 'text') {
      return messageSettings;
    }

    return {
      ...messageSettings,
      children: messageSettings.children?.filter(
        child => ['Delete', 'Reply'].includes(child.id as string)
      )
    }
  }

  readonly removeMessageModal = model<boolean>(false);
  readonly editMessageModal = model<boolean>(false);
  itemClicked(event: NavbarItem) {
    switch(event.id) {
      case 'Reply': 
        this.sendMessageService.replyToMessage.set(this.item());
        break;
      case 'Edit': 
        this.editMessageModal.set(true);
        break;
      case 'Delete': 
        this.removeMessageModal.set(true);
        break;
    }
  }
}
