import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CalcMSettingsDir {
  recalculateDirection(
    messageBubble: ElementRef<HTMLElement> | undefined, 
    parentContainer: ElementRef<HTMLElement> | undefined
  ) {
    const bubbleRect =
      messageBubble?.nativeElement.getBoundingClientRect();

    const parentRect =
      parentContainer?.nativeElement.getBoundingClientRect();

    const spaceRight = (parentRect?.right ?? 0) - (bubbleRect?.right ?? 0);
    const spaceLeft = (bubbleRect?.right ?? 0) - (parentRect?.left ?? 0);

    return spaceRight < 200 && spaceLeft > spaceRight ? 'left' : 'right'
  }
}
