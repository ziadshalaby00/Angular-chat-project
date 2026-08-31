import { Component, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { File_message } from '../../services/chat-service/chat-service';

@Component({
  selector: 'app-file',
  imports: [],
  templateUrl: './file.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './file.css',
})
export class FileComp {
  readonly file_message = input.required<File_message>();

  getFileCategory(fileType: string): 'image' | 'video' | 'audio' | 'pdf' | 'document' | 'code' | 'archive' | 'unknown' {
    if (!fileType) return 'unknown';

    if (fileType.startsWith('image/')) return 'image';
    if (fileType.startsWith('video/')) return 'video';
    if (fileType.startsWith('audio/')) return 'audio';

    if (fileType === 'application/pdf') return 'pdf';

    if (
      fileType.includes('word') ||
      fileType.includes('excel') ||
      fileType.includes('powerpoint') ||
      fileType === 'text/plain' ||
      fileType.includes('opendocument')
    ) {
      return 'document';
    }

    if (
      fileType.startsWith('text/') ||
      fileType === 'application/javascript' ||
      fileType === 'application/json' ||
      fileType === 'application/xml' ||
      fileType === 'text/csv'
    ) {
      return 'code';
    }

    if (
      fileType.includes('zip') ||
      fileType.includes('rar') ||
      fileType.includes('7z') ||
      fileType.includes('tar') ||
      fileType.includes('gzip')
    ) {
      return 'archive';
    }

    return 'unknown';
  }

  formatFileSize(size: number): string {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  readonly isImageZoomOpen = signal(false);

  openImageZoom() {
    this.isImageZoomOpen.set(true);
  }

  closeImageZoom() {
    this.isImageZoomOpen.set(false);
  }
}
