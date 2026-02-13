import { ElementRef, Injectable } from '@angular/core';
import { Dir } from '../shared-service/shared-utils';

@Injectable({
  providedIn: 'root',
})
export class CalcMSettingsDir {
  recalculateDirection(
    messageBubble: ElementRef<HTMLElement> | undefined,
    parentContainer: ElementRef<HTMLElement> | undefined
  ): Dir {
    if (!messageBubble || !parentContainer) {
      return 'bottom-right';
    }

    const bubbleRect = messageBubble.nativeElement.getBoundingClientRect();
    const parentRect = parentContainer.nativeElement.getBoundingClientRect();

    // vertical mid
    const bubbleMidY = (bubbleRect.top + bubbleRect.bottom) / 2;
    const parentMidY = (parentRect.top + parentRect.bottom) / 2;

    // horizontal space
    const spaceRight = parentRect.right - bubbleRect.right;
    const spaceLeft = bubbleRect.right - parentRect.left;

    const horizontal: 'left' | 'right' =
      spaceLeft > spaceRight ? 'left' : 'right';

    const vertical: 'top' | 'bottom' =
      bubbleMidY > parentMidY ? 'top' : 'bottom';

      console.log('bubbleRect:', bubbleRect)
      console.log('parentRect:', parentRect)

      console.log('spaceRight:', spaceRight)
      console.log('spaceLeft:', spaceLeft)

      console.log('bubbleMidY:', bubbleMidY)
      console.log('parentMidY:', parentMidY)

      console.log(`${vertical}-${horizontal}:`, `${vertical}-${horizontal}`)

    return `${vertical}-${horizontal}` as Dir;
  }
}
