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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const materials_service_1 = require("./materials.service");
const firebase_storage_service_1 = require("./storage/firebase-storage.service");
const chroma_service_1 = require("./ingest/chroma.service");
const pdf_ingest_service_1 = require("./ingest/pdf-ingest.service");
function filenameGenerator(_req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + (0, path_1.extname)(file.originalname));
}
let MaterialsController = class MaterialsController {
    constructor(materialsService, storage, chroma, pdfIngest) {
        this.materialsService = materialsService;
        this.storage = storage;
        this.chroma = chroma;
        this.pdfIngest = pdfIngest;
    }
    async listStudy(className, subjectName, q, page = '1', limit = '10') {
        return this.materialsService.listStudy({ class: className, subject: subjectName, q, page: Number(page), limit: Number(limit) });
    }
    async uploadStudy(file, teacherId, className, subjectName, vectorDbCollectionId) {
        const storagePath = `materials/${teacherId}/${Date.now()}_${file.originalname}`;
        return (async () => {
            const pdfCloudUrl = await this.storage.uploadBuffer(storagePath, file.buffer, file.mimetype);
            const collectionId = await this.chroma.createCollection(file.originalname);
            const saved = await this.materialsService.createStudy({
                teacherId,
                class: className,
                subject: subjectName,
                pdfCloudUrl,
                vectorDbCollectionId: collectionId,
                originalName: file.originalname,
                mimeType: file.mimetype,
                size: file.size,
            });
            if (process.env.INGEST_ENABLED === 'true') {
                const guardMb = Number(process.env.INGEST_HEAP_GUARD_MB || 1024);
                const usedMb = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
                if (usedMb < guardMb) {
                    console.log("Condition passed");
                    try {
                        const collectionExists = await this.chroma.collectionExists(collectionId);
                        if (!collectionExists) {
                            console.error(`[MaterialsController] Collection ${collectionId} does not exist. Cannot ingest PDF.`);
                            return saved;
                        }
                        console.log(`[MaterialsController] Collection ${collectionId} verified to exist. Proceeding with PDF ingestion.`);
                        this.pdfIngest
                            .ingestPdfBuffer(collectionId, file.buffer, file.originalname, { class: className, subject: subjectName, teacherId }, file.mimetype, file.size)
                            .then((result) => {
                            if (result.error) {
                                console.error(`[MaterialsController] PDF ingestion failed for ${file.originalname}:`, result.error);
                                if (result.details) {
                                    console.error(`[MaterialsController] Error details:`, result.details);
                                }
                            }
                            else {
                                console.log(`[MaterialsController] PDF ingestion successful for ${file.originalname}: ${result.segments} segments processed`);
                            }
                        })
                            .catch((error) => {
                            console.error(`[MaterialsController] PDF ingestion error for ${file.originalname}:`, error.message);
                        });
                    }
                    catch (error) {
                        console.error(`[MaterialsController] Failed to verify collection ${collectionId}:`, error.message);
                        return saved;
                    }
                }
                else {
                    console.log(`*******Skipping PDF ingestion due to high memory usage: ${usedMb}MB >= ${guardMb}MB`);
                    console.warn(`[MaterialsController] Skipping PDF ingestion due to high memory usage: ${usedMb}MB >= ${guardMb}MB`);
                }
            }
            return saved;
        })();
    }
    async uploadAnswers(file, req, teacherId, className, subjectName, vectorDbCollectionId) {
        const pdfCloudUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/api/uploads/${file.filename}`;
        const resolvedTeacherId = teacherId || req?.user?.id;
        return this.materialsService.createAnswer({
            teacherId: resolvedTeacherId,
            class: className || '-',
            subject: subjectName || '-',
            pdfCloudUrl,
            vectorDbCollectionId: vectorDbCollectionId || `ans_${Date.now()}`,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
        });
    }
    async testChromaConnection() {
        try {
            const connectionTest = await this.chroma.testConnection();
            return {
                success: true,
                connection: connectionTest,
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
    async testCollectionFlow() {
        try {
            const testResult = await this.chroma.testCollectionFlow('test-upload-flow');
            return {
                success: true,
                testResult,
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
    async listAllCollections() {
        try {
            const result = await this.chroma.listAllCollections();
            return {
                success: true,
                result,
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
    async validateCollection(collectionId) {
        try {
            const validation = await this.chroma.validateCollection(collectionId);
            return {
                success: true,
                collectionId,
                validation,
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            return {
                success: false,
                collectionId,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
    async testUpsert(collectionId) {
        try {
            const testResult = await this.chroma.testUpsert(collectionId);
            return {
                success: true,
                collectionId,
                testResult,
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            return {
                success: false,
                collectionId,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
    async debugCollection(collectionId) {
        try {
            const debugResult = await this.chroma.debugCollectionAccess(collectionId);
            return {
                success: true,
                collectionId,
                debugResult,
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            return {
                success: false,
                collectionId,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
    async testEmbeddings() {
        try {
            const collectionId = await this.chroma.createCollection('test-embeddings');
            const testDocs = [
                { id: 'test_1', text: 'This is a test document for embedding testing.', metadata: { test: true, type: 'embedding_test' } },
                { id: 'test_2', text: 'Another test document to verify embeddings work correctly.', metadata: { test: true, type: 'embedding_test' } }
            ];
            await this.chroma.upsertDocuments(collectionId, testDocs);
            const results = await this.chroma.fetchTopK(collectionId, 'test document', 5);
            return {
                success: true,
                collectionId,
                upsertSuccess: true,
                queryResults: results,
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
    async checkOllamaHealth() {
        try {
            const healthStatus = await this.chroma.checkOllamaHealth();
            return {
                success: true,
                ollamaHealth: healthStatus,
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
    async testEmbedding() {
        try {
            const testText = 'This is a test text for embedding generation.';
            const embedding = await this.chroma.generateEmbedding(testText);
            return {
                success: true,
                text: testText,
                embedding: {
                    dimensions: embedding.length,
                    sample: embedding.slice(0, 5)
                },
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
};
exports.MaterialsController = MaterialsController;
__decorate([
    (0, common_1.Get)('study'),
    (0, common_1.Header)('Cache-Control', 'no-cache, no-store, must-revalidate'),
    (0, common_1.Header)('Pragma', 'no-cache'),
    (0, common_1.Header)('Expires', '0'),
    __param(0, (0, common_1.Query)('class')),
    __param(1, (0, common_1.Query)('subject')),
    __param(2, (0, common_1.Query)('q')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "listStudy", null);
__decorate([
    (0, common_1.Post)('study'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: Number(process.env.MAX_FILE_SIZE || 10 * 1024 * 1024) },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('teacherId')),
    __param(2, (0, common_1.Body)('class')),
    __param(3, (0, common_1.Body)('subject')),
    __param(4, (0, common_1.Body)('vectorDbCollectionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "uploadStudy", null);
__decorate([
    (0, common_1.Post)('answers'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: Number(process.env.MAX_FILE_SIZE || 10 * 1024 * 1024) },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)('teacherId')),
    __param(3, (0, common_1.Body)('class')),
    __param(4, (0, common_1.Body)('subject')),
    __param(5, (0, common_1.Body)('vectorDbCollectionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "uploadAnswers", null);
__decorate([
    (0, common_1.Get)('test-chroma'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "testChromaConnection", null);
__decorate([
    (0, common_1.Get)('test-collection-flow'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "testCollectionFlow", null);
__decorate([
    (0, common_1.Get)('list-collections'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "listAllCollections", null);
__decorate([
    (0, common_1.Get)('collection/:collectionId/validate'),
    __param(0, (0, common_1.Param)('collectionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "validateCollection", null);
__decorate([
    (0, common_1.Get)('collection/:collectionId/test-upsert'),
    __param(0, (0, common_1.Param)('collectionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "testUpsert", null);
__decorate([
    (0, common_1.Get)('collection/:collectionId/debug'),
    __param(0, (0, common_1.Param)('collectionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "debugCollection", null);
__decorate([
    (0, common_1.Get)('test-embeddings'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "testEmbeddings", null);
__decorate([
    (0, common_1.Get)('ollama-health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "checkOllamaHealth", null);
__decorate([
    (0, common_1.Get)('test-embedding'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MaterialsController.prototype, "testEmbedding", null);
exports.MaterialsController = MaterialsController = __decorate([
    (0, common_1.Controller)('materials'),
    __metadata("design:paramtypes", [materials_service_1.MaterialsService,
        firebase_storage_service_1.FirebaseStorageService,
        chroma_service_1.ChromaService,
        pdf_ingest_service_1.PdfIngestService])
], MaterialsController);
//# sourceMappingURL=materials.controller.js.map