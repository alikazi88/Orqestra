/**
 * Security Configuration for Storage Uploads
 *
 * Defines policies for malicious content scanning on all file uploads.
 * Used by storage upload handlers to validate files before persisting.
 */

export const SECURITY_CONFIG = {
    /** Maximum file size per upload (in bytes) */
    maxFileSize: 50 * 1024 * 1024, // 50MB

    /** Allowed MIME types for uploads */
    allowedMimeTypes: [
        // Images
        'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
        // Videos
        'video/mp4', 'video/webm', 'video/quicktime',
        // Documents
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
        'text/csv',
    ],

    /** File extensions that are BLOCKED (executable/dangerous) */
    blockedExtensions: [
        '.exe', '.bat', '.cmd', '.sh', '.ps1', '.vbs', '.js', '.mjs',
        '.php', '.py', '.rb', '.pl', '.jar', '.class', '.dll', '.so',
        '.app', '.dmg', '.msi', '.deb', '.rpm',
        '.scr', '.pif', '.com', '.hta', '.cpl', '.inf', '.reg',
    ],

    /** Content scanning rules */
    contentScanning: {
        enabled: true,
        /** Check for embedded scripts in SVG uploads */
        scanSvgForScripts: true,
        /** Check for ZIP bombs (highly compressed files) */
        detectZipBombs: true,
        /** Maximum decompressed-to-compressed ratio before flagging */
        maxCompressionRatio: 100,
        /** Quarantine suspicious files instead of deleting */
        quarantineOnDetection: true,
        /** Log all scan results */
        logAllScans: true,
    },

    /** Rate limiting for uploads */
    rateLimiting: {
        maxUploadsPerMinute: 10,
        maxUploadsPerHour: 100,
        maxTotalStoragePerUser: 5 * 1024 * 1024 * 1024, // 5GB
    },

    /** Content Security Policy headers */
    cspHeaders: {
        'Content-Security-Policy': "default-src 'self'; img-src 'self' data: blob: https:; media-src 'self' blob:; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
    },
};

/**
 * Validates a file before upload.
 * Returns { valid: true } or { valid: false, reason: string }
 */
export function validateUpload(file: { name: string; size: number; type: string }): { valid: boolean; reason?: string } {
    // Check file size
    if (file.size > SECURITY_CONFIG.maxFileSize) {
        return { valid: false, reason: `File exceeds maximum size of ${SECURITY_CONFIG.maxFileSize / (1024 * 1024)}MB` };
    }

    // Check MIME type
    if (!SECURITY_CONFIG.allowedMimeTypes.includes(file.type)) {
        return { valid: false, reason: `File type "${file.type}" is not allowed` };
    }

    // Check blocked extensions
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (SECURITY_CONFIG.blockedExtensions.includes(ext)) {
        return { valid: false, reason: `File extension "${ext}" is blocked for security reasons` };
    }

    return { valid: true };
}
