import {
  Component,
  ElementRef,
  input,
  signal,
  effect,
  OnDestroy,
  viewChild,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Audio_message } from '../../services/chat-service/chat-service';
import { RecordService } from '../../services/record-service/record-service';

@Component({
  selector: 'app-audio',
  imports: [CommonModule],
  templateUrl: './audio.html',
  styleUrl: './audio.css',
})
export class Audio implements OnDestroy {
  readonly record = input.required<Audio_message>();
  private recordService = inject(RecordService)
  
  // Audio element ref
  readonly audioRef = viewChild.required<ElementRef<HTMLAudioElement>>('audioPlayer');
  
  // State signals
  readonly isPlaying = signal(false);
  readonly currentTime = signal(0);
  readonly duration = signal(0);
  readonly playbackRate = signal(1);
  readonly isLoading = signal(false);
  
  // 30 bar  
  readonly waveformBars = signal<number[]>([]);
  
  private audioElement!: HTMLAudioElement;
  private animationFrameId: number = 0;
  
  constructor() {
    this.waveformBars.set(
      Array.from({ length: 30 }, () => Math.random() * 0.7 + 0.3)
    );
    
    effect(() => {
      const audio = this.audioRef()?.nativeElement;
      if (audio) {
        this.audioElement = audio;
        this.setupAudioEvents();
      }
    });
  }
  
  private setupAudioEvents() {
    this.audioElement.addEventListener('loadedmetadata', () => {
      this.duration.set(this.audioElement.duration || this.record().audio_duration);
      this.isLoading.set(false);
    });
    
    this.audioElement.addEventListener('loadstart', () => {
      this.isLoading.set(true);
    });
    
    this.audioElement.addEventListener('play', () => {
      this.isPlaying.set(true);
      this.startProgressUpdate();
    });
    
    this.audioElement.addEventListener('pause', () => {
      this.isPlaying.set(false);
      this.stopProgressUpdate();
    });
    
    this.audioElement.addEventListener('ended', () => {
      this.isPlaying.set(false);
      this.currentTime.set(0);
      this.stopProgressUpdate();

      this.recordService.clear(this.audioElement);
    });
    
    this.audioElement.addEventListener('error', () => {
      this.isLoading.set(false);
      console.error('Error loading audio');
    });
  }
  
  private startProgressUpdate() {
    const update = () => {
      if (this.audioElement && !this.audioElement.paused) {
        this.currentTime.set(this.audioElement.currentTime);
        this.animationFrameId = requestAnimationFrame(update);
      }
    };
    this.animationFrameId = requestAnimationFrame(update);
  }
  
  private stopProgressUpdate() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
  
  togglePlay() {
    if (!this.audioElement) return;

    if (this.isPlaying()) {
      this.audioElement.pause();
      this.recordService.clear(this.audioElement);
    } else {
      this.recordService.setCurrent(this.audioElement);

      this.audioElement
        .play()
        .catch(err => console.error('Play error:', err));
    }
  }
  
  seekTo(event: MouseEvent) {
    if (!this.audioElement || !this.duration()) return;
    
    const waveformContainer = event.currentTarget as HTMLElement;
    const rect = waveformContainer.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    
    const newTime = percentage * this.duration();
    this.audioElement.currentTime = newTime;
    this.currentTime.set(newTime);
  }
  
  setPlaybackRate(rate: number) {
    this.playbackRate.set(rate);
    if (this.audioElement) {
      this.audioElement.playbackRate = rate;
    }
  }
  
  formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  
  // Calculate progress percentage for the waveform fill
  get progressPercentage(): number {
    const dur = this.duration() || this.record().audio_duration;
    if (!dur) return 0;
    return (this.currentTime() / dur) * 100;
  }
  
  // Get bar color based on position (played vs unplayed)
  getBarColor(index: number): string {
    const totalBars = this.waveformBars().length;
    const barPercentage = (index / totalBars) * 100;
    return barPercentage <= this.progressPercentage ? '#06b6d4' : '#d1d5db';
  }
  
  ngOnDestroy() {
    this.stopProgressUpdate();

    if (this.audioElement) {
      this.recordService.clear(this.audioElement);

      this.audioElement.pause();
      this.audioElement.src = '';
    }
  }
}