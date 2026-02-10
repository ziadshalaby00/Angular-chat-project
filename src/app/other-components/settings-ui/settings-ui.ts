import { Component, computed, input, output, OutputEmitterRef, signal, TemplateRef, viewChild } from '@angular/core';
import { NavbarItem, NavItem } from '@ziadshalaby/ngx-zs-component';

@Component({
  selector: 'app-settings-ui',
  imports: [NavItem],
  templateUrl: './settings-ui.html',
  styleUrl: './settings-ui.css',
})
export class SettingsUi {
  readonly id = input<string>('');
  readonly settings = input<{
    children: NavbarItem[],
    childrenOpenWindow: boolean,
    childrenWindowDir: 'left' | 'right',
    showChevronDownIcon: boolean,
    closeOnPointerOutside: boolean
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
