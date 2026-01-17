import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';

export type ColorsType = 'blue' | 'red' | 'purple' | 'yellow' | 'indigo'

@Component({
  selector: 'app-icon-container',
  imports: [CommonModule],
  templateUrl: './icon-container.html',
  styleUrl: './icon-container.css',
})
export class IconContainer {
  readonly color = input<ColorsType>('blue');
  readonly sizeOuter = input<`size-${number}`>('size-8');
  readonly sizeInner = input<`size-${number}`>('size-7');

  readonly gradientBg = computed(() => {
    const map = {
      blue: 'from-blue-500/20 to-indigo-500/20 dark:from-blue-500/30 dark:to-indigo-500/30',
      green: 'from-green-500/20 to-emerald-500/20 dark:from-green-500/30 dark:to-emerald-500/30',
      red: 'from-red-500/20 to-rose-500/20 dark:from-red-500/30 dark:to-rose-500/30',
      purple: 'from-purple-500/20 to-fuchsia-500/20 dark:from-purple-500/30 dark:to-fuchsia-500/30',
      yellow: 'from-yellow-400/20 to-amber-500/20 dark:from-yellow-400/30 dark:to-amber-500/30',
    };
    return map[this.color()];
  });

  readonly innerBg = computed(() => {
    const map = {
      blue: `
        from-blue-100 to-blue-200
        dark:from-blue-900/40 dark:to-blue-800/40
        group-hover:from-blue-200 group-hover:to-blue-300
        dark:group-hover:from-blue-800/60 dark:group-hover:to-blue-700/60
      `,
      green: `
        from-green-100 to-green-200
        dark:from-green-900/40 dark:to-green-800/40
        group-hover:from-green-200 group-hover:to-green-300
        dark:group-hover:from-green-800/60 dark:group-hover:to-green-700/60
      `,
      red: `
        from-red-100 to-red-200
        dark:from-red-900/40 dark:to-red-800/40
        group-hover:from-red-200 group-hover:to-red-300
        dark:group-hover:from-red-800/60 dark:group-hover:to-red-700/60
      `,
      purple: `
        from-purple-100 to-purple-200
        dark:from-purple-900/40 dark:to-purple-800/40
        group-hover:from-purple-200 group-hover:to-purple-300
        dark:group-hover:from-purple-800/60 dark:to-purple-700/60
      `,
      yellow: `
        from-yellow-100 to-yellow-200
        dark:from-yellow-900/40 dark:to-yellow-800/40
        group-hover:from-yellow-200 group-hover:to-yellow-300
        dark:group-hover:from-yellow-800/60 dark:group-hover:to-yellow-700/60
      `,
    };
    return map[this.color()];
  });
}
