"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PdfIngestService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfIngestService = void 0;
const common_1 = require("@nestjs/common");
const pdfParse = require("pdf-parse");
const chroma_service_1 = require("./chroma.service");
let PdfIngestService = PdfIngestService_1 = class PdfIngestService {
    constructor(chroma) {
        this.chroma = chroma;
        this.logger = new common_1.Logger(PdfIngestService_1.name);
    }
    chunk(text, chunkSize = 1200, overlap = 150) {
        const cleaned = text.replace(/\s+/g, ' ').trim();
        const maxChunks = Number(process.env.INGEST_MAX_CHUNKS || 300);
        const chunks = [];
        let i = 0;
        let chunkCount = 0;
        while (i < cleaned.length && chunkCount < maxChunks) {
            const end = Math.min(i + chunkSize, cleaned.length);
            const slice = cleaned.slice(i, end);
            if (slice.trim().length > 50) {
                chunks.push({ id: `p_${chunkCount}`, text: slice });
                chunkCount++;
            }
            i = end - overlap;
            if (i < 0)
                i = 0;
            if (i >= cleaned.length)
                break;
            if (chunkCount > 0 && chunkCount % 100 === 0) {
                const usedMemory = process.memoryUsage().heapUsed / 1024 / 1024;
                if (usedMemory > 1500) {
                    this.logger.warn(`Memory usage high (${Math.round(usedMemory)}MB), limiting chunks to ${chunkCount}`);
                    break;
                }
            }
        }
        this.logger.log(`Created ${chunks.length} chunks from ${cleaned.length} characters (${Math.round(cleaned.length / 1024)}KB)`);
        return chunks;
    }
    async ingestPdfBuffer(collectionId, buffer, filename, metadata, mimeType, sizeBytes) {
        try {
            if (!mimeType || !/pdf/i.test(mimeType)) {
                this.logger.warn(`Skipping ingestion for non-PDF file: ${filename}`);
                return { segments: 0, error: 'Not a PDF file' };
            }
            const maxBytes = Number(process.env.INGEST_MAX_BYTES || 12 * 1024 * 1024);
            this.logger.log(`Processing PDF: ${filename}, Size: ${Math.round((sizeBytes || 0) / 1024)}KB, Max allowed: ${Math.round(maxBytes / 1024 / 1024)}MB`);
            if (sizeBytes && sizeBytes > maxBytes) {
                this.logger.warn(`Skipping ingestion for large PDF (${Math.round(sizeBytes / 1024 / 1024)}MB > ${Math.round(maxBytes / 1024 / 1024)}MB): ${filename}`);
                return { segments: 0, error: 'File too large' };
            }
            const initialMemory = process.memoryUsage().heapUsed / 1024 / 1024;
            this.logger.log(`Initial memory usage: ${Math.round(initialMemory)}MB`);
            if (initialMemory > 1000) {
                this.logger.warn(`High initial memory usage (${Math.round(initialMemory)}MB), PDF processing may be limited`);
            }
            const originalWarn = console.warn;
            console.warn = (...args) => {
                const msg = (args && args[0]) ? String(args[0]) : '';
                if (msg.includes('undefined function') || msg.includes('bad XRef'))
                    return;
                originalWarn.apply(console, args);
            };
            const maxPages = Number(process.env.INGEST_MAX_PAGES || 80);
            this.logger.log(`Attempting to parse PDF with max ${maxPages} pages`);
            let data;
            try {
                data = await pdfParse(buffer, {
                    max: maxPages,
                    normalizeWhitespace: true,
                    disableCombineTextItems: false
                }).finally(() => { console.warn = originalWarn; });
            }
            catch (parseError) {
                console.warn = originalWarn;
                if (parseError.message?.includes('bad XRef') || parseError.message?.includes('Invalid PDF')) {
                    this.logger.error(`PDF parsing failed due to corrupted file structure: ${filename}`, parseError.message);
                    return {
                        segments: 0,
                        error: 'PDF is corrupted or has invalid structure. Please try uploading a different version of this file.',
                        details: parseError.message
                    };
                }
                if (parseError.message?.includes('password')) {
                    this.logger.error(`PDF is password protected: ${filename}`);
                    return {
                        segments: 0,
                        error: 'PDF is password protected. Please remove the password and try again.',
                        details: 'Password protected PDF'
                    };
                }
                throw parseError;
            }
            if (!data || !data.text || data.text.trim().length === 0) {
                this.logger.warn(`No text content extracted from PDF: ${filename}`);
                return {
                    segments: 0,
                    error: 'No readable text content found in PDF. The file might be image-based or corrupted.',
                    details: 'Empty text content'
                };
            }
            this.logger.log(`Successfully extracted ${data.text.length} characters from PDF: ${filename}`);
            const afterExtractionMemory = process.memoryUsage().heapUsed / 1024 / 1024;
            this.logger.log(`Memory after text extraction: ${Math.round(afterExtractionMemory)}MB`);
            const chunks = this.chunk(data.text);
            this.logger.log(`Created ${chunks.length} text chunks from PDF: ${filename}`);
            const maxChunks = Number(process.env.INGEST_MAX_CHUNKS || 300);
            const capped = chunks.slice(0, maxChunks);
            if (capped.length < chunks.length) {
                this.logger.warn(`Limited chunks from ${chunks.length} to ${capped.length} for PDF: ${filename}`);
            }
            data.text = null;
            global.gc && global.gc();
            const batchSize = Number(process.env.INGEST_BATCH_SIZE || 25);
            let successfulBatches = 0;
            for (let start = 0; start < capped.length; start += batchSize) {
                try {
                    const batchMemory = process.memoryUsage().heapUsed / 1024 / 1024;
                    if (batchMemory > 1800) {
                        this.logger.warn(`Memory usage too high (${Math.round(batchMemory)}MB), stopping batch processing`);
                        break;
                    }
                    const batch = capped.slice(start, start + batchSize).map((c, idx) => ({
                        id: `${c.id}_${start + idx}`,
                        text: c.text,
                        metadata: {
                            filename,
                            ...metadata,
                            idx: start + idx,
                            totalChunks: capped.length,
                            batchNumber: Math.floor(start / batchSize) + 1
                        }
                    }));
                    this.logger.log(`Processing batch ${Math.floor(start / batchSize) + 1}/${Math.ceil(capped.length / batchSize)}`);
                    this.logger.log(`Batch size: ${batch.length} documents`);
                    this.logger.log(`Sample document ID: ${batch[0]?.id}`);
                    this.logger.log(`Sample text length: ${batch[0]?.text?.length || 0} characters`);
                    this.logger.log(`Sample metadata:`, batch[0]?.metadata);
                    await this.chroma.upsertDocuments(collectionId, batch);
                    successfulBatches++;
                    this.logger.log(`Successfully processed batch ${Math.floor(start / batchSize) + 1}/${Math.ceil(capped.length / batchSize)} for PDF: ${filename}`);
                    batch.length = 0;
                    if (start % (batchSize * 2) === 0) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                }
                catch (batchError) {
                    this.logger.error(`Failed to process batch ${Math.floor(start / batchSize) + 1} for PDF: ${filename}`, batchError.message);
                    if (batchError.response) {
                        this.logger.error(`HTTP Status: ${batchError.response.status}`);
                        this.logger.error(`Response Data:`, batchError.response.data);
                        this.logger.error(`Yes from Response Data: complete`);
                    }
                }
            }
            capped.length = 0;
            chunks.length = 0;
            global.gc && global.gc();
            const totalSegments = successfulBatches * batchSize;
            const finalMemory = process.memoryUsage().heapUsed / 1024 / 1024;
            this.logger.log(`Successfully ingested ${totalSegments} segments from PDF: ${filename} into collection: ${collectionId}`);
            this.logger.log(`Final memory usage: ${Math.round(finalMemory)}MB (started at ${Math.round(initialMemory)}MB)`);
            return {
                segments: totalSegments,
                totalChunks: capped.length,
                successfulBatches,
                collectionId,
                memoryUsage: {
                    initial: Math.round(initialMemory),
                    final: Math.round(finalMemory)
                }
            };
        }
        catch (err) {
            this.logger.error(`PDF ingest failed for ${filename}:`, err.message);
            let errorMessage = 'PDF processing failed';
            let errorDetails = err.message;
            if (err.message?.includes('bad XRef')) {
                errorMessage = 'PDF file is corrupted or has invalid structure';
                errorDetails = 'The PDF cross-reference table is invalid. This usually means the file is corrupted.';
            }
            else if (err.message?.includes('Invalid PDF')) {
                errorMessage = 'Invalid PDF format';
                errorDetails = 'The file does not appear to be a valid PDF document.';
            }
            else if (err.message?.includes('ENOMEM') || err.message?.includes('JavaScript heap out of memory')) {
                errorMessage = 'Insufficient memory to process PDF';
                errorDetails = 'The PDF is too large or complex to process with available memory. Try uploading a smaller file or splitting the PDF.';
            }
            return {
                segments: 0,
                error: errorMessage,
                details: errorDetails,
                originalError: err.message
            };
        }
    }
};
exports.PdfIngestService = PdfIngestService;
exports.PdfIngestService = PdfIngestService = PdfIngestService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [chroma_service_1.ChromaService])
], PdfIngestService);
//# sourceMappingURL=pdf-ingest.service.js.map