export declare class ChromaService {
    private base;
    createCollection(name: string): Promise<string>;
    upsertDocuments(collectionId: string, docs: {
        id: string;
        text: string;
        metadata?: any;
    }[]): Promise<void>;
    fetchTopK(collectionId: string, query: string, k?: number): Promise<string[]>;
    getCollection(collectionId: string): Promise<any>;
    count(collectionId: string): Promise<number>;
    getDocuments(collectionId: string): Promise<string[]>;
    collectionExists(collectionId: string): Promise<any>;
    getCollectionStats(collectionId: string): Promise<{
        exists: boolean;
        count: number;
        metadata?: any;
    }>;
    testConnection(): Promise<{
        status: string;
        details: any;
    }>;
    validateCollection(collectionId: string): Promise<{
        valid: boolean;
        issues: string[];
    }>;
    testUpsert(collectionId: string): Promise<{
        success: boolean;
        error?: string;
        details?: any;
    }>;
    debugCollectionAccess(collectionId: string): Promise<{
        success: boolean;
        details: any;
    }>;
    resolveCollectionIdentifier(collectionId: string): Promise<{
        id: string;
        name: string;
        exists: boolean;
    }>;
    listAllCollections(): Promise<{
        success: boolean;
        collections: any[];
        error?: string;
    }>;
    testCollectionFlow(sourceName: string): Promise<{
        success: boolean;
        details: any;
    }>;
    generateEmbedding(text: string): Promise<number[]>;
    checkOllamaAvailability(): Promise<{
        available: boolean;
        model: string;
        error?: string;
    }>;
    checkOllamaHealth(): Promise<{
        healthy: boolean;
        model: string;
        details: any;
    }>;
}
