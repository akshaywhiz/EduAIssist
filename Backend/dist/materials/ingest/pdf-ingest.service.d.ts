import { ChromaService } from './chroma.service';
export declare class PdfIngestService {
    private readonly chroma;
    private readonly logger;
    constructor(chroma: ChromaService);
    private chunk;
    ingestPdfBuffer(collectionId: string, buffer: Buffer, filename: string, metadata: Record<string, any>, mimeType?: string, sizeBytes?: number): Promise<{
        segments: number;
        error: string;
        details?: undefined;
        totalChunks?: undefined;
        successfulBatches?: undefined;
        collectionId?: undefined;
        memoryUsage?: undefined;
        originalError?: undefined;
    } | {
        segments: number;
        error: string;
        details: any;
        totalChunks?: undefined;
        successfulBatches?: undefined;
        collectionId?: undefined;
        memoryUsage?: undefined;
        originalError?: undefined;
    } | {
        segments: number;
        totalChunks: number;
        successfulBatches: number;
        collectionId: string;
        memoryUsage: {
            initial: number;
            final: number;
        };
        error?: undefined;
        details?: undefined;
        originalError?: undefined;
    } | {
        segments: number;
        error: string;
        details: any;
        originalError: any;
        totalChunks?: undefined;
        successfulBatches?: undefined;
        collectionId?: undefined;
        memoryUsage?: undefined;
    }>;
}
