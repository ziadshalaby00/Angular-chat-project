import { Service } from '@angular/core';

@Service()
export class CompressionService {
    public async compressFile(file: File): Promise<File> {
        if (file.type.startsWith('image/')) {
            return this.compressImage(file);
        }

        return file;
    }

    private async compressImage(file: File): Promise<File> {
        const bitmap = await createImageBitmap(file);
        try {
            const maxWidth = 1920;
            const maxHeight = 1920;

            let width = bitmap.width;
            let height = bitmap.height;

            const scale = Math.min(
                1,
                maxWidth / width,
                maxHeight / height
            );

            width = Math.round(width * scale);
            height = Math.round(height * scale);

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d')!;

            ctx.drawImage(bitmap, 0, 0, width, height);

            const blob = await new Promise<Blob>((resolve, reject) => {
                canvas.toBlob(
                    blob => blob
                    ? resolve(blob)
                    : reject(new Error('Image compression failed')),
                    'image/webp',
                    0.75
                );
            });

            return new File(
                [blob],
                file.name.replace(/\.[^.]+$/, '.webp'),
                { type: 'image/webp' }
            );
        } finally {
            bitmap.close();
        }
    }
}
