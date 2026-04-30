import { Component, ElementRef, signal, viewChild } from '@angular/core';

@Component({
  selector: 'app-send-message',
  imports: [],
  templateUrl: './send-message.html',
  styleUrl: './send-message.css',
})
export class SendMessage {
  readonly messageInput = viewChild<ElementRef<HTMLTextAreaElement>>('messageInput');
  readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  readonly message = signal<string>('');
  readonly selectedFiles = signal<File[]>([]);
  readonly isRecording = signal<boolean>(false);
  readonly recordedBlob = signal<Blob | null>(null);
  readonly recordingTime = signal<string>('00:00');
  readonly waveBars = signal<number[]>(Array(20).fill(20));

  private recordingInterval?: ReturnType<typeof setInterval>;
  private seconds = 0;

  onInput(event: Event) {
    const value = (event.target as HTMLTextAreaElement).value;
    this.message.set(value);
    this.autoResize();
  }

  autoResize() {
    const textarea = this.messageInput()?.nativeElement;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 128) + 'px';
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles.set(Array.from(input.files));
      this.message.set('');
    }
    input.value = '';
  }

  removeFile(file: File) {
    this.selectedFiles.update(files => files.filter(f => f !== file));
  }

  getFileIcon(file: File): string {
    const type = file.type;
    if (type.startsWith('image/')) return 'fas fa-image';
    if (type.startsWith('video/')) return 'fas fa-video';
    if (type.startsWith('audio/')) return 'fas fa-music';
    if (type.includes('pdf')) return 'fas fa-file-pdf';
    if (type.includes('text')) return 'fas fa-file-lines';
    return 'fas fa-file';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  startRecording() {
    this.isRecording.set(true);
    this.seconds = 0;
    this.recordingTime.set('00:00');
    
    this.recordingInterval = setInterval(() => {
      this.seconds++;
      const mins = Math.floor(this.seconds / 60).toString().padStart(2, '0');
      const secs = (this.seconds % 60).toString().padStart(2, '0');
      this.recordingTime.set(`${mins}:${secs}`);
    }, 1000);
  }

  stopRecording() {
    this.isRecording.set(false);
    if (this.recordingInterval) clearInterval(this.recordingInterval);
    
    // Fake blob for demo - replace with actual MediaRecorder blob
    this.recordedBlob.set(new Blob(['audio'], { type: 'audio/webm' }));
  }

  deleteRecording() {
    this.recordedBlob.set(null);
    this.seconds = 0;
    this.recordingTime.set('00:00');
  }

  onSend() {
    console.log('message', this.message())
    console.log('files', this.selectedFiles())
    console.log('audio', this.recordedBlob())
    
    // Reset everything
    this.message.set('');
    this.selectedFiles.set([]);
    this.recordedBlob.set(null);
    this.seconds = 0;
    this.recordingTime.set('00:00');
    
    const textarea = this.messageInput()?.nativeElement;
    if (textarea) textarea.style.height = 'auto';
  }
}
