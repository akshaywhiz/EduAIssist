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
exports.MaterialsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const material_entity_1 = require("./entities/material.entity");
const typeorm_3 = require("typeorm");
const class_entity_1 = require("../classes/entities/class.entity");
const subject_entity_1 = require("../subjects/entities/subject.entity");
let MaterialsService = class MaterialsService {
    constructor(materialsRepo, classesRepo, subjectsRepo) {
        this.materialsRepo = materialsRepo;
        this.classesRepo = classesRepo;
        this.subjectsRepo = subjectsRepo;
    }
    async createStudy(params) {
        if (!params.teacherId || !params.class || !params.subject || !params.pdfCloudUrl) {
            throw new common_1.BadRequestException('teacherId, class, subject and pdfCloudUrl are required');
        }
        const material = this.materialsRepo.create({
            type: material_entity_1.MaterialType.STUDY,
            teacherId: params.teacherId,
            class: params.class,
            subject: params.subject,
            pdfCloudUrl: params.pdfCloudUrl,
            vectorDbCollectionId: params.vectorDbCollectionId,
            originalName: params.originalName,
            mimeType: params.mimeType,
            size: params.size?.toString(),
        });
        return this.materialsRepo.save(material);
    }
    async createAnswer(params) {
        const material = this.materialsRepo.create({
            type: material_entity_1.MaterialType.ANSWER,
            teacherId: params.teacherId,
            class: params.class,
            subject: params.subject,
            pdfCloudUrl: params.pdfCloudUrl,
            vectorDbCollectionId: params.vectorDbCollectionId,
            originalName: params.originalName,
            mimeType: params.mimeType,
            size: params.size?.toString(),
        });
        return this.materialsRepo.save(material);
    }
    async listStudy(params) {
        const where = { type: material_entity_1.MaterialType.STUDY };
        if (params.class)
            where.class = params.class;
        if (params.subject)
            where.subject = params.subject;
        if (params.q)
            where.originalName = (0, typeorm_3.Like)(`%${params.q}%`);
        const [itemsRaw, total] = await this.materialsRepo.findAndCount({
            where,
            order: { createdAt: 'DESC' },
            skip: (params.page - 1) * params.limit,
            take: params.limit,
            select: {
                id: true,
                type: true,
                pdfCloudUrl: true,
                originalName: true,
                class: true,
                subject: true,
                vectorDbCollectionId: true,
                createdAt: true,
            },
        });
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const classIds = Array.from(new Set(itemsRaw.map((i) => i.class).filter((v) => typeof v === 'string' && uuidRegex.test(v))));
        const subjectIds = Array.from(new Set(itemsRaw.map((i) => i.subject).filter((v) => typeof v === 'string' && uuidRegex.test(v))));
        let classMap = {};
        let subjectMap = {};
        if (classIds.length > 0) {
            const cls = await this.classesRepo.find({ where: { id: (0, typeorm_2.In)(classIds) } });
            classMap = Object.fromEntries(cls.map((c) => [c.id, c.name]));
        }
        if (subjectIds.length > 0) {
            const subs = await this.subjectsRepo.find({ where: { id: (0, typeorm_2.In)(subjectIds) } });
            subjectMap = Object.fromEntries(subs.map((s) => [s.id, s.name]));
        }
        const items = itemsRaw.map((i) => ({
            ...i,
            class: classMap[i.class] ?? i.class,
            subject: subjectMap[i.subject] ?? i.subject,
        }));
        return {
            items,
            total,
            page: params.page,
            limit: params.limit,
            pages: Math.ceil(total / params.limit),
        };
    }
};
exports.MaterialsService = MaterialsService;
exports.MaterialsService = MaterialsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(material_entity_1.Material)),
    __param(1, (0, typeorm_1.InjectRepository)(class_entity_1.Class)),
    __param(2, (0, typeorm_1.InjectRepository)(subject_entity_1.Subject)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], MaterialsService);
//# sourceMappingURL=materials.service.js.map