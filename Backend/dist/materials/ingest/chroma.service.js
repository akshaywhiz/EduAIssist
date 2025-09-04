"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChromaService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const uuid_1 = require("uuid");
let ChromaService = class ChromaService {
    constructor() {
        this.base = process.env.CHROMA_BASE_URL || 'http://localhost:8000';
    }
    async createCollection(name) {
        try {
            const id = (0, uuid_1.v4)();
            console.log(`[ChromaService] Creating collection with ID: ${id} for source: ${name}`);
            const response = await axios_1.default.post(`${this.base}/api/v1/collections`, {
                name: id,
                metadata: { source: name },
                embedding_function: 'all-MiniLM-L6-v2'
            }, {
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(`[ChromaService] Collection created successfully. Response status: ${response.status}`);
            console.log(`[ChromaService] Collection response data:`, response.data);
            const actualCollectionId = id;
            console.log(`[ChromaService] ChromaDB returned collection ID: ${actualCollectionId} (our UUID: ${id})`);
            const exists = await this.collectionExists(actualCollectionId);
            if (!exists) {
                throw new Error(`Collection ${actualCollectionId} was not created successfully in ChromaDB`);
            }
            console.log(`[ChromaService] Collection ${actualCollectionId} verified to exist in ChromaDB`);
            return actualCollectionId;
        }
        catch (error) {
            console.error(`[ChromaService] Failed to create collection for source ${name}:`, error.message);
            if (error.response) {
                console.error(`[ChromaService] HTTP Status: ${error.response.status}`);
                console.error(`[ChromaService] Response Data:`, error.response.data);
            }
            throw new Error(`Failed to create ChromaDB collection: ${error.message}`);
        }
    }
    async upsertDocuments(collectionId, docs) {
        console.log('*****upsertDocuments function called with collectionId:', collectionId);
        try {
            console.log(`[ChromaService] Verifying collection ${collectionId} exists before upsert...`);
            const collectionDetails = await this.getCollection(collectionId);
            const actualCollectionId = collectionDetails.id;
            console.log(`[ChromaService] Using actual collection ID: ${actualCollectionId} for upsert`);
            const documentsWithEmbeddings = await Promise.all(docs.map(async (doc) => {
                const embedding = await this.generateEmbedding(doc.text);
                return {
                    id: doc.id,
                    text: doc.text,
                    metadata: doc.metadata || {},
                    embedding: embedding
                };
            }));
            console.log(`[ChromaService] Generated embeddings for ${documentsWithEmbeddings.length} documents`);
            console.log("emnedd", {
                embeddings: documentsWithEmbeddings.map((d) => d.embedding)
            });
            const res = await axios_1.default.post(`${this.base}/api/v1/collections/${actualCollectionId}/upsert`, {
                ids: documentsWithEmbeddings.map((d) => d.id),
                documents: documentsWithEmbeddings.map((d) => d.text),
                metadatas: documentsWithEmbeddings.map((d) => d.metadata),
                embeddings: documentsWithEmbeddings.map((d) => d.embedding)
            });
            console.log(`[ChromaService] Successfully upserted ${documentsWithEmbeddings.length} documents with embeddings. Status: ${res.status}`);
        }
        catch (error) {
            console.error(`[ChromaService] Failed to upsert documents to collection ${collectionId}:`, error.message);
            throw new Error(`Failed to upsert documents: ${error.message}`);
        }
    }
    async fetchTopK(collectionId, query, k = 12) {
        try {
            const res = await axios_1.default.post(`${this.base}/api/v1/collections/${collectionId}/query`, {
                query_texts: [query],
                n_results: k,
            }, { timeout: 15000 });
            const docs = (res.data?.documents?.[0]) || (res.data?.results?.[0]?.documents) || [];
            return docs;
        }
        catch (err) {
            const status = err?.response?.status;
            const detail = err?.response?.data ? JSON.stringify(err.response.data) : '';
            throw new Error(`Chroma query failed${status ? ` (HTTP ${status})` : ''} ${detail}`.trim());
        }
    }
    async getCollection(collectionId) {
        const res = await axios_1.default.get(`${this.base}/api/v1/collections/${collectionId}`);
        return res.data;
    }
    async count(collectionId) {
        console.log("*****url is  ==> count *******", `${this.base}/api/v1/collections/${collectionId}/count`);
        const res = await axios_1.default.get(`${this.base}/api/v1/collections/${collectionId}/count`);
        console.log("*****Result cout ns {cnt} *******", res);
        const cnt = res.data;
        console.log("*****Result cout ns {cnt} *******", cnt);
        return res.data;
    }
    async getDocuments(collectionId) {
        console.log("*****url is  ==> getDocuments *******", `${this.base}/api/v1/collections/${collectionId}/get`);
        const res = await axios_1.default.post(`${this.base}/api/v1/collections/${collectionId}/get`, {
            include: ["documents"],
        });
        console.log("*****Result getDocuments ns {res} *******", res);
        return res.data?.documents || [];
    }
    async collectionExists(collectionId) {
        try {
            const res = await axios_1.default.get(`${this.base}/api/v1/collections/${collectionId}`);
            console.log("*****collectionExists ==> collectionExists *******", res.data);
            return res.data;
        }
        catch (error) {
            if (error.response?.status === 404) {
                return false;
            }
            throw error;
        }
    }
    async getCollectionStats(collectionId) {
        try {
            const exists = await this.collectionExists(collectionId);
            if (!exists) {
                return { exists: false, count: 0 };
            }
            console.log("*****collectionExist ==> getCollectionStats *******", exists.id);
            const count = await this.count(exists.id);
            console.log("*****count  ==> getCollectionStats *******", count);
            const collection = await this.getCollection(collectionId);
            console.log("*****collection is  ==> getCollectionStats *******", collection);
            return {
                exists: true,
                count,
                metadata: collection.metadata
            };
        }
        catch (error) {
            console.error(`[ChromaService] Error getting collection stats for ${collectionId}:`, error.message);
            return { exists: false, count: 0 };
        }
    }
    async testConnection() {
        try {
            console.log(`[ChromaService] Testing connection to ChromaDB at: ${this.base}`);
            const heartbeat = await axios_1.default.get(`${this.base}/api/v1/heartbeat`, { timeout: 5000 });
            console.log(`[ChromaService] ChromaDB heartbeat response:`, heartbeat.data);
            const collections = await axios_1.default.get(`${this.base}/api/v1/collections`, { timeout: 5000 });
            console.log(`[ChromaService] Available collections:`, collections.data);
            return {
                status: 'connected',
                details: {
                    baseUrl: this.base,
                    heartbeat: heartbeat.data,
                    collections: collections.data
                }
            };
        }
        catch (error) {
            console.error(`[ChromaService] Connection test failed:`, error.message);
            if (error.code === 'ECONNREFUSED') {
                return {
                    status: 'connection_refused',
                    details: { error: 'ChromaDB service is not running or not accessible' }
                };
            }
            if (error.response) {
                return {
                    status: 'http_error',
                    details: {
                        status: error.response.status,
                        data: error.response.data,
                        error: error.message
                    }
                };
            }
            return {
                status: 'unknown_error',
                details: { error: error.message }
            };
        }
    }
    async validateCollection(collectionId) {
        const issues = [];
        try {
            const exists = await this.collectionExists(collectionId);
            if (!exists) {
                issues.push(`Collection '${collectionId}' does not exist`);
                return { valid: false, issues };
            }
            const collection = await this.getCollection(collectionId);
            console.log(`[ChromaService] Collection details for ${collectionId}:`, collection);
            if (!collection.metadata) {
                issues.push('Collection has no metadata');
            }
            const count = await this.count(collectionId);
            console.log(`[ChromaService] Collection ${collectionId} has ${count} documents`);
            if (count === 0) {
                issues.push('Collection is empty (no documents)');
            }
            return {
                valid: issues.length === 0,
                issues
            };
        }
        catch (error) {
            issues.push(`Error validating collection: ${error.message}`);
            return { valid: false, issues };
        }
    }
    async testUpsert(collectionId) {
        try {
            console.log(`[ChromaService] Testing upsert with minimal payload to collection: ${collectionId}`);
            console.log(`[ChromaService] Using base URL: ${this.base}`);
            console.log(`[ChromaService] Step 1: Checking if collection exists via our method...`);
            const exists = await this.collectionExists(collectionId);
            console.log(`[ChromaService] Collection exists check result: ${exists}`);
            if (!exists) {
                return {
                    success: false,
                    error: `Collection ${collectionId} does not exist according to our check`,
                    details: { exists: false }
                };
            }
            console.log(`[ChromaService] Step 2: Getting collection details...`);
            try {
                const collectionDetails = await this.getCollection(collectionId);
                console.log(`[ChromaService] Collection details:`, collectionDetails);
            }
            catch (getError) {
                console.error(`[ChromaService] Failed to get collection details:`, getError.message);
            }
            console.log(`[ChromaService] Step 3: Testing upsert with minimal payload...`);
            console.log(`[ChromaService] Resolving collection identifier for ChromaDB API...`);
            const resolved = await this.resolveCollectionIdentifier(collectionId);
            if (!resolved.exists) {
                return {
                    success: false,
                    error: `Collection ${collectionId} could not be resolved for ChromaDB API access`,
                    details: { exists: false, resolved }
                };
            }
            console.log(`[ChromaService] Collection resolved: ID=${resolved.id}, Name=${resolved.name}`);
            const apiIdentifier = resolved.name || resolved.id;
            const testPayload = {
                ids: ['test_1'],
                documents: ['This is a test document for debugging.'],
                metadatas: [{ test: true, timestamp: new Date().toISOString() }]
            };
            console.log(`[ChromaService] Test payload:`, testPayload);
            console.log(`[ChromaService] Making request to: ${this.base}/api/v1/collections/${apiIdentifier}/upsert`);
            const res = await axios_1.default.post(`${this.base}/api/v1/collections/${apiIdentifier}/upsert`, testPayload, {
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(`[ChromaService] Test upsert successful. Status: ${res.status}`);
            if (res.data) {
                console.log(`[ChromaService] Test response:`, res.data);
            }
            return {
                success: true,
                details: { status: res.status, response: res.data }
            };
        }
        catch (error) {
            console.error(`[ChromaService] Test upsert failed:`, error.message);
            if (error.response) {
                console.error(`[ChromaService] Test HTTP Status: ${error.response.status}`);
                console.error(`[ChromaService] Test Response Data:`, error.response.data);
                console.error(`[ChromaService] Test Response Headers:`, error.response.headers);
            }
            if (error.response?.data?.error === 'InvalidCollection') {
                console.error(`[ChromaService] ChromaDB says collection doesn't exist, but our check says it does!`);
                console.error(`[ChromaService] This suggests a ChromaDB API configuration issue.`);
                try {
                    console.log(`[ChromaService] Attempting to list all collections...`);
                    const collectionsRes = await axios_1.default.get(`${this.base}/api/v1/collections`);
                    console.log(`[ChromaService] Available collections:`, collectionsRes.data);
                }
                catch (listError) {
                    console.error(`[ChromaService] Failed to list collections:`, listError.message);
                }
            }
            return {
                success: false,
                error: error.message,
                details: error.response?.data || error.message
            };
        }
    }
    async debugCollectionAccess(collectionId) {
        try {
            console.log(`[ChromaService] Debugging collection access for: ${collectionId}`);
            const results = {
                baseUrl: this.base,
                collectionId,
                tests: {}
            };
            try {
                console.log(`[ChromaService] Test 1: Direct GET request to /api/v1/collections/${collectionId}`);
                const getRes = await axios_1.default.get(`${this.base}/api/v1/collections/${collectionId}`);
                results.tests.directGet = { success: true, status: getRes.status, data: getRes.data };
                console.log(`[ChromaService] Direct GET successful:`, getRes.status);
            }
            catch (getError) {
                results.tests.directGet = { success: false, error: getError.message, status: getError.response?.status };
                console.error(`[ChromaService] Direct GET failed:`, getError.message);
            }
            try {
                console.log(`[ChromaService] Test 2: Collection count request`);
                const countRes = await axios_1.default.post(`${this.base}/api/v1/collections/${collectionId}/count`);
                results.tests.count = { success: true, status: countRes.status, data: countRes.data };
                console.log(`[ChromaService] Count successful:`, countRes.status);
            }
            catch (countError) {
                results.tests.count = { success: false, error: countError.message, status: countError.response?.status };
                console.error(`[ChromaService] Count failed:`, countError.message);
            }
            try {
                console.log(`[ChromaService] Test 3: List all collections`);
                const listRes = await axios_1.default.get(`${this.base}/api/v1/collections`);
                results.tests.listAll = { success: true, status: listRes.status, data: listRes.data };
                console.log(`[ChromaService] List all successful:`, listRes.status);
            }
            catch (listError) {
                results.tests.listAll = { success: false, error: listError.message, status: listError.response?.status };
                console.error(`[ChromaService] List all failed:`, listError.message);
            }
            return { success: true, details: results };
        }
        catch (error) {
            console.error(`[ChromaService] Debug collection access failed:`, error.message);
            return { success: false, details: { error: error.message } };
        }
    }
    async resolveCollectionIdentifier(collectionId) {
        try {
            console.log(`[ChromaService] Resolving collection identifier: ${collectionId}`);
            try {
                const collection = await this.getCollection(collectionId);
                console.log(`[ChromaService] Collection found directly with ID:`, collection);
                return { id: collectionId, name: collection.name || collectionId, exists: true };
            }
            catch (directError) {
                console.log(`[ChromaService] Direct access failed, trying to find by name...`);
            }
            try {
                const collectionsRes = await axios_1.default.get(`${this.base}/api/v1/collections`);
                const collections = collectionsRes.data;
                console.log(`[ChromaService] Available collections:`, collections);
                const foundCollection = collections.find((col) => col.id === collectionId || col.name === collectionId);
                if (foundCollection) {
                    console.log(`[ChromaService] Found collection:`, foundCollection);
                    return {
                        id: foundCollection.id || foundCollection.name,
                        name: foundCollection.name || foundCollection.id,
                        exists: true
                    };
                }
                console.log(`[ChromaService] Collection not found in available collections`);
                return { id: collectionId, name: collectionId, exists: false };
            }
            catch (listError) {
                console.error(`[ChromaService] Failed to list collections:`, listError.message);
                return { id: collectionId, name: collectionId, exists: false };
            }
        }
        catch (error) {
            console.error(`[ChromaService] Collection resolution failed:`, error.message);
            return { id: collectionId, name: collectionId, exists: false };
        }
    }
    async listAllCollections() {
        try {
            console.log(`[ChromaService] Listing all collections from ChromaDB...`);
            const response = await axios_1.default.get(`${this.base}/api/v1/collections`);
            const collections = response.data;
            console.log(`[ChromaService] Found ${collections.length} collections:`, collections);
            const detailedCollections = await Promise.all(collections.map(async (col) => {
                try {
                    const details = await this.getCollection(col.id || col.name);
                    return {
                        ...col,
                        details,
                        documentCount: await this.count(col.id || col.name)
                    };
                }
                catch (error) {
                    return {
                        ...col,
                        error: error.message
                    };
                }
            }));
            return {
                success: true,
                collections: detailedCollections
            };
        }
        catch (error) {
            console.error(`[ChromaService] Failed to list collections:`, error.message);
            return {
                success: false,
                collections: [],
                error: error.message
            };
        }
    }
    async testCollectionFlow(sourceName) {
        try {
            console.log(`[ChromaService] Testing complete collection flow for source: ${sourceName}`);
            console.log(`[ChromaService] Step 1: Creating collection...`);
            const collectionId = await this.createCollection(sourceName);
            console.log(`[ChromaService] Collection created with ID: ${collectionId}`);
            console.log(`[ChromaService] Step 2: Verifying collection exists...`);
            const exists = await this.collectionExists(collectionId);
            console.log(`[ChromaService] Collection exists check: ${exists}`);
            console.log(`[ChromaService] Step 3: Resolving collection identifier...`);
            const resolved = await this.resolveCollectionIdentifier(collectionId);
            console.log(`[ChromaService] Resolved identifier:`, resolved);
            console.log(`[ChromaService] Step 4: Testing upsert...`);
            const testDocs = [
                { id: 'test_1', text: 'This is a test document for collection flow testing.', metadata: { test: true } }
            ];
            await this.upsertDocuments(collectionId, testDocs);
            console.log(`[ChromaService] Test upsert successful`);
            console.log(`[ChromaService] Step 5: Testing query...`);
            const results = await this.fetchTopK(collectionId, 'test', 5);
            console.log(`[ChromaService] Query results:`, results);
            return {
                success: true,
                details: {
                    collectionId,
                    exists,
                    resolved,
                    upsertSuccess: true,
                    queryResults: results
                }
            };
        }
        catch (error) {
            console.error(`[ChromaService] Collection flow test failed:`, error.message);
            return {
                success: false,
                details: { error: error.message }
            };
        }
    }
    async generateEmbedding(text) {
        try {
            console.log(`[ChromaService] Generating embedding for text of length: ${text.length}`);
            const ollamaBase = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
            const model = process.env.OLLAMA_MODEL_NOMIC_EMBED || 'mistral';
            const timeoutMs = Number(process.env.OLLAMA_TIMEOUT_MS || 60000);
            console.log(`[ChromaService] Using Ollama at ${ollamaBase} with model ${model}`);
            const response = await axios_1.default.post(`${ollamaBase}/api/embed`, {
                model: model,
                input: text
            }, {
                timeout: timeoutMs,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log("embedding", response);
            const embedding = response.data?.embeddings;
            if (!embedding || !Array.isArray(embedding)) {
                console.error(`[ChromaService] Invalid embedding response from Ollama:`, response.data);
                throw new Error('Invalid embedding response from Ollama');
            }
            console.log(`[ChromaService] Generated embedding with ${embedding.length} dimensions`);
            return embedding;
        }
        catch (error) {
            console.error(`[ChromaService] Failed to generate embedding:`, error.message);
            throw new Error(`Failed to generate embedding using Ollama: ${error.message}`);
        }
    }
    async checkOllamaAvailability() {
        try {
            const ollamaBase = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
            const model = process.env.OLLAMA_MODEL || 'mistral';
            console.log(`[ChromaService] Checking Ollama availability at ${ollamaBase} with model ${model}`);
            const healthResponse = await axios_1.default.get(`${ollamaBase}/api/tags`, { timeout: 5000 });
            if (healthResponse.status !== 200) {
                return { available: false, model, error: 'Ollama health check failed' };
            }
            const models = healthResponse.data?.models || [];
            const modelExists = models.some((m) => m.name === model);
            if (!modelExists) {
                console.warn(`[ChromaService] Model ${model} not found in available models:`, models.map((m) => m.name));
                return { available: false, model, error: `Model ${model} not found` };
            }
            console.log(`[ChromaService] Ollama is available with model ${model}`);
            return { available: true, model };
        }
        catch (error) {
            console.error(`[ChromaService] Ollama availability check failed:`, error.message);
            return {
                available: false,
                model: process.env.OLLAMA_MODEL || 'mistral',
                error: error.message
            };
        }
    }
    async checkOllamaHealth() {
        try {
            const ollamaBase = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
            const model = process.env.OLLAMA_MODEL || 'mistral';
            console.log(`[ChromaService] Checking Ollama health at ${ollamaBase}`);
            const healthResponse = await axios_1.default.get(`${ollamaBase}/api/tags`, { timeout: 10000 });
            if (healthResponse.status !== 200) {
                return {
                    healthy: false,
                    model,
                    details: { error: 'Ollama health check failed', status: healthResponse.status }
                };
            }
            const models = healthResponse.data?.models || [];
            const modelInfo = models.find((m) => m.name === model);
            if (!modelInfo) {
                return {
                    healthy: false,
                    model,
                    details: {
                        error: `Model ${model} not found`,
                        availableModels: models.map((m) => m.name)
                    }
                };
            }
            const modelDetails = {
                name: modelInfo.name,
                size: modelInfo.size,
                modifiedAt: modelInfo.modified_at,
                available: true
            };
            console.log(`[ChromaService] Ollama is healthy with model ${model}:`, modelDetails);
            return {
                healthy: true,
                model,
                details: modelDetails
            };
        }
        catch (error) {
            console.error(`[ChromaService] Ollama health check failed:`, error.message);
            return {
                healthy: false,
                model: process.env.OLLAMA_MODEL || 'mistral',
                details: { error: error.message, code: error.code }
            };
        }
    }
};
exports.ChromaService = ChromaService;
exports.ChromaService = ChromaService = __decorate([
    (0, common_1.Injectable)()
], ChromaService);
//# sourceMappingURL=chroma.service.js.map