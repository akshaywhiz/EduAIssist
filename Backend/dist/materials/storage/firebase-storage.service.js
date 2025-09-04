"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseStorageService = void 0;
const common_1 = require("@nestjs/common");
const admin = require("firebase-admin");
let FirebaseStorageService = class FirebaseStorageService {
    constructor() {
        this.initialized = false;
    }
    init() {
        if (this.initialized)
            return;
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
        const bucket = process.env.FIREBASE_STORAGE_BUCKET;
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
                storageBucket: bucket,
            });
        }
        this.initialized = true;
    }
    async uploadBuffer(path, buffer, contentType) {
        this.init();
        const bucket = admin.storage().bucket();
        const file = bucket.file(path);
        await file.save(buffer, { contentType, resumable: false, public: true });
        await file.makePublic();
        return `https://storage.googleapis.com/${bucket.name}/${encodeURIComponent(path)}`;
    }
};
exports.FirebaseStorageService = FirebaseStorageService;
exports.FirebaseStorageService = FirebaseStorageService = __decorate([
    (0, common_1.Injectable)()
], FirebaseStorageService);
//# sourceMappingURL=firebase-storage.service.js.map