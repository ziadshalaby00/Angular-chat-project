import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OverflowCard {
  readonly collection = new Map<string, string>();
  setCardOverFlow(cardId: string, name: string) {
    const lastCardId = this.collection.get(name);

    if (lastCardId && lastCardId !== cardId) {
      document
        .getElementById(lastCardId)
        ?.classList.remove('z-999');
    }

    document
      .getElementById(cardId)
      ?.classList.add('z-999');

    this.collection.set(name, cardId);
  }
}
