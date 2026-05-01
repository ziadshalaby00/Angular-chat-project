import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RecordService {
  // holds current playing audio element
  private readonly currentAudio = signal<HTMLAudioElement | null>(null);

  setCurrent(audio: HTMLAudioElement) {
    const current = this.currentAudio();

    // If there's one that's been used before and its value is different
    if (current && current !== audio) {
      current.pause();
    }

    this.currentAudio.set(audio);
  }

  clear(audio: HTMLAudioElement) {
    if (this.currentAudio() === audio) {
      this.currentAudio.set(null);
    }
  }
}
