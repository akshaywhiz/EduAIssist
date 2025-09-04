import { Request } from 'express';
import { MaterialsService } from './materials.service';
import { FirebaseStorageService } from './storage/firebase-storage.service';
import { ChromaService } from './ingest/chroma.service';
import { PdfIngestService } from './ingest/pdf-ingest.service';
export declare class MaterialsController {
    private readonly materialsService;
    private readonly storage;
    private readonly chroma;
    private readonly pdfIngest;
    constructor(materialsService: MaterialsService, storage: FirebaseStorageService, chroma: ChromaService, pdfIngest: PdfIngestService);
    listStudy(className?: string, subjectName?: string, q?: string, page?: string, limit?: string): Promise<{
        items: any[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    uploadStudy(file: Express.Multer.File, teacherId: string, className: string, subjectName: string, vectorDbCollectionId: string): Promise<import("./entities/material.entity").Material>;
    uploadAnswers(file: Express.Multer.File, req: Request, teacherId?: string, className?: string, subjectName?: string, vectorDbCollectionId?: string): Promise<import("./entities/material.entity").Material>;
    testChromaConnection(): Promise<{
        success: boolean;
        connection: {
            status: string;
            details: any;
        };
        timestamp: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        timestamp: string;
        connection?: undefined;
    }>;
    testCollectionFlow(): Promise<{
        success: boolean;
        testResult: {
            success: boolean;
            details: any;
        };
        timestamp: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        timestamp: string;
        testResult?: undefined;
    }>;
    listAllCollections(): Promise<{
        success: boolean;
        result: {
            success: boolean;
            collections: any[];
            error?: string;
        };
        timestamp: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        timestamp: string;
        result?: undefined;
    }>;
    validateCollection(collectionId: string): Promise<{
        success: boolean;
        collectionId: string;
        validation: {
            valid: boolean;
            issues: string[];
        };
        timestamp: string;
        error?: undefined;
    } | {
        success: boolean;
        collectionId: string;
        error: any;
        timestamp: string;
        validation?: undefined;
    }>;
    testUpsert(collectionId: string): Promise<{
        success: boolean;
        collectionId: string;
        testResult: {
            success: boolean;
            error?: string;
            details?: any;
        };
        timestamp: string;
        error?: undefined;
    } | {
        success: boolean;
        collectionId: string;
        error: any;
        timestamp: string;
        testResult?: undefined;
    }>;
    debugCollection(collectionId: string): Promise<{
        success: boolean;
        collectionId: string;
        debugResult: {
            success: boolean;
            details: any;
        };
        timestamp: string;
        error?: undefined;
    } | {
        success: boolean;
        collectionId: string;
        error: any;
        timestamp: string;
        debugResult?: undefined;
    }>;
    testEmbeddings(): Promise<{
        success: boolean;
        collectionId: string;
        upsertSuccess: boolean;
        queryResults: string[];
        timestamp: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        timestamp: string;
        collectionId?: undefined;
        upsertSuccess?: undefined;
        queryResults?: undefined;
    }>;
    checkOllamaHealth(): Promise<{
        success: boolean;
        ollamaHealth: {
            healthy: boolean;
            model: string;
            details: any;
        };
        timestamp: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        timestamp: string;
        ollamaHealth?: undefined;
    }>;
    testEmbedding(): Promise<{
        success: boolean;
        text: string;
        embedding: {
            dimensions: number;
            sample: number[];
        };
        timestamp: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        timestamp: string;
        text?: undefined;
        embedding?: undefined;
    }>;
}
