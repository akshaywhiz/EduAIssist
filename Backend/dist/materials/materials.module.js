"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const material_entity_1 = require("./entities/material.entity");
const materials_service_1 = require("./materials.service");
const materials_controller_1 = require("./materials.controller");
const firebase_storage_service_1 = require("./storage/firebase-storage.service");
const chroma_service_1 = require("./ingest/chroma.service");
const pdf_ingest_service_1 = require("./ingest/pdf-ingest.service");
const class_entity_1 = require("../classes/entities/class.entity");
const subject_entity_1 = require("../subjects/entities/subject.entity");
let MaterialsModule = class MaterialsModule {
};
exports.MaterialsModule = MaterialsModule;
exports.MaterialsModule = MaterialsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([material_entity_1.Material, class_entity_1.Class, subject_entity_1.Subject])],
        controllers: [materials_controller_1.MaterialsController],
        providers: [materials_service_1.MaterialsService, firebase_storage_service_1.FirebaseStorageService, chroma_service_1.ChromaService, pdf_ingest_service_1.PdfIngestService],
        exports: [materials_service_1.MaterialsService],
    })
], MaterialsModule);
//# sourceMappingURL=materials.module.js.map