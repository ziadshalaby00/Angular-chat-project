import { Component, computed, input, output, TemplateRef, viewChild } from '@angular/core';
import { NavbarItem, NavItem } from '@ziadshalaby/ngx-zs-component';
import { Dir } from '../../services/shared-service/shared-utils';

@Component({
  selector: 'app-settings-ui',
  imports: [NavItem],
  templateUrl: './settings-ui.html',
  styleUrl: './settings-ui.css',
})
export class SettingsUi {
  readonly id = input<string>('');
  readonly settings = input<{
    children: NavbarItem[];
    childrenConfig: {
      childrenOpenWindow: boolean;
      childrenWindowDir?: Dir;
      showChevronDownIcon: boolean;
      closeMenuOnPointerOutside: boolean;
    }
  }>()
  readonly settingsIconTpl = viewChild<TemplateRef<any>>('chatSettingsIcon');

  readonly chatSettings = computed<NavbarItem>(() => ({
    id: 'settings',
    label: '',
    iconTpl: this.settingsIconTpl,
    ...this.settings()
  }));

  readonly anyItemClickedEv = output<NavbarItem>();
}
