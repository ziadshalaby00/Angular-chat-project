import { Component, input, TemplateRef, viewChild } from '@angular/core';
import { SettingsUi } from '../../other-components/settings-ui/settings-ui';
import { IconContainer } from '../../other-components/icon-container/icon-container';

@Component({
  selector: 'app-message-settings',
  imports: [SettingsUi, IconContainer],
  templateUrl: './message-settings.html',
  styleUrl: './message-settings.css',
})
export class MessageSettings {
  readonly type = input.required<'text' | 'file' | 'audio'>();
  readonly settingsDirection = input.required<'left' | 'right'>();

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
    childrenOpenWindow: true,
    childrenWindowDir: 'right' as 'right' | 'left',
    showChevronDownIcon: false,
    closeOnPointerOutside: true
  }

  get getMessageSettings() {
    const messageSettings = {
      ...this.messageSettings,
      childrenWindowDir: this.settingsDirection() as 'right' | 'left',
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
}
