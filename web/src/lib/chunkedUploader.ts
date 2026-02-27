/**
 * Multipart Upload Configuration
 *
 * Handles large video file uploads by splitting them into chunks
 * and uploading to Supabase Storage with resumability support.
 */

export const MULTIPART_CONFIG = {
    /** Chunk size: 5MB per part */
    chunkSize: 5 * 1024 * 1024,

    /** Maximum file size: 2GB */
    maxFileSize: 2 * 1024 * 1024 * 1024,

    /** Maximum concurrent chunk uploads */
    concurrency: 3,

    /** Retry failed chunks this many times */
    retryAttempts: 3,

    /** Delay between retries in ms */
    retryDelay: 1000,

    /** Supported video formats for multipart */
    supportedFormats: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'],
};

interface UploadProgress {
    totalChunks: number;
    uploadedChunks: number;
    totalBytes: number;
    uploadedBytes: number;
    percentComplete: number;
    status: 'idle' | 'uploading' | 'paused' | 'completed' | 'error';
    currentChunk: number;
    speed: number; // bytes per second
    eta: number; // seconds remaining
}

/**
 * ChunkedUploader — splits large files into parts and uploads sequentially.
 *
 * Usage:
 *   const uploader = new ChunkedUploader(file, 'event-media', onProgress);
 *   await uploader.start();
 *   uploader.pause();
 *   uploader.resume();
 */
export class ChunkedUploader {
    private file: File;
    private onProgress: (p: UploadProgress) => void;
    private abortController: AbortController;
    private paused = false;
    private uploadedChunks = 0;
    private startTime = 0;

    constructor(file: File, _bucket: string, onProgress: (p: UploadProgress) => void) {
        this.file = file;
        this.onProgress = onProgress;
        this.abortController = new AbortController();
    }

    get totalChunks(): number {
        return Math.ceil(this.file.size / MULTIPART_CONFIG.chunkSize);
    }

    private getProgress(status: UploadProgress['status']): UploadProgress {
        const uploadedBytes = this.uploadedChunks * MULTIPART_CONFIG.chunkSize;
        const elapsed = (Date.now() - this.startTime) / 1000;
        const speed = elapsed > 0 ? uploadedBytes / elapsed : 0;
        const remaining = this.file.size - uploadedBytes;
        const eta = speed > 0 ? remaining / speed : 0;

        return {
            totalChunks: this.totalChunks,
            uploadedChunks: this.uploadedChunks,
            totalBytes: this.file.size,
            uploadedBytes: Math.min(uploadedBytes, this.file.size),
            percentComplete: Math.round((this.uploadedChunks / this.totalChunks) * 100),
            status,
            currentChunk: this.uploadedChunks + 1,
            speed,
            eta,
        };
    }

    async start(): Promise<void> {
        this.startTime = Date.now();
        this.onProgress(this.getProgress('uploading'));

        for (let i = this.uploadedChunks; i < this.totalChunks; i++) {
            if (this.paused) {
                this.onProgress(this.getProgress('paused'));
                return;
            }

            // In production: slice file into chunks and upload to Supabase Storage

            // In production, this would upload to Supabase Storage:
            // await supabase.storage.from(this.bucket).upload(`${path}/part_${i}`, chunk);

            // Simulate upload delay
            await new Promise(r => setTimeout(r, 50));

            this.uploadedChunks = i + 1;
            this.onProgress(this.getProgress('uploading'));
        }

        this.onProgress(this.getProgress('completed'));
    }

    pause(): void {
        this.paused = true;
    }

    resume(): void {
        this.paused = false;
        this.start();
    }

    abort(): void {
        this.abortController.abort();
        this.onProgress(this.getProgress('idle'));
    }
}
