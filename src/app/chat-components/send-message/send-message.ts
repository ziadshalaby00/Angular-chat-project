import { Component, effect, ElementRef, inject, input, signal, viewChild } from '@angular/core';
import { SendMessageService } from '../../services/send-message/send-message';
import { Text } from '../text/text';
import { FileComp } from '../file/file';
import { Audio } from '../audio/audio';

@Component({
  selector: 'app-send-message',
  // imports: [Text, FileComp, Audio],
  templateUrl: './send-message.html',
  styleUrl: './send-message.css',
})
export class SendMessage {
  readonly sendMessageService: SendMessageService = inject(SendMessageService);
  readonly chatId = input.required<number>();

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
  
  // ====== Recording Properties ======
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private audioStream: MediaStream | null = null;

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

  // ====== Real Audio Recording Methods ======
  async startRecording() {
    try {
      // Request microphone access
      this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Create MediaRecorder
      this.mediaRecorder = new MediaRecorder(this.audioStream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.recordedBlob.set(audioBlob);
      };

      // Start recording
      this.mediaRecorder.start();
      this.isRecording.set(true);
      this.seconds = 0;
      this.recordingTime.set('00:00');

      // Start timer
      this.recordingInterval = setInterval(() => {
        this.seconds++;
        const mins = Math.floor(this.seconds / 60).toString().padStart(2, '0');
        const secs = (this.seconds % 60).toString().padStart(2, '0');
        this.recordingTime.set(`${mins}:${secs}`);
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
      this.cleanup();
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    
    this.isRecording.set(false);
    if (this.recordingInterval) clearInterval(this.recordingInterval);
    
    // Stop all tracks in the stream
    this.audioStream?.getTracks().forEach(track => track.stop());
  }

  deleteRecording() {
    this.recordedBlob.set(null);
    this.seconds = 0;
    this.recordingTime.set('00:00');
    this.audioChunks = [];
    this.cleanup();
  }

  // ====== Cleanup ======

  private cleanup() {
    this.audioStream?.getTracks().forEach(track => track.stop());
    this.audioStream = null;
    this.mediaRecorder = null;
  }

  onSend() {
    this.sendMessageService.sendMessage(
      {
        text: this.message(),
        file: this.selectedFiles(),
        audio: this.recordedBlob()
      },
      this.chatId()
    )

    // Reset everything
    this.message.set('');
    this.selectedFiles.set([]);
    this.deleteRecording()
    
    const textarea = this.messageInput()?.nativeElement;
    if (textarea) textarea.style.height = 'auto';
  }

  cancelReply() {
    this.sendMessageService.replyToMessage.set(null);
  }
}