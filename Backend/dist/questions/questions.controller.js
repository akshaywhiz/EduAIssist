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
exports.QuestionsController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const question_entity_1 = require("./entities/question.entity");
const PDFDocument = require('pdfkit');
const question_generation_service_1 = require("./question-generation.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let QuestionsController = class QuestionsController {
    constructor(qg, questionRepo) {
        this.qg = qg;
        this.questionRepo = questionRepo;
    }
    async generate(examId, body, req) {
        const userId = req?.user?.id;
        console.log('[QuestionsController] Received request body:', body);
        const collectionId = body.vectorCollectionID || body.collectionId;
        console.log('[QuestionsController] Resolved collectionId:', collectionId);
        return this.qg.generateOrCreate(examId, { ...body, collectionId }, userId);
    }
    async byExam(examId) {
        return this.questionRepo.find({ where: { examId }, order: { order: 'ASC' } });
    }
    async asPdf(examId, res) {
        const questions = await this.questionRepo.find({ where: { examId }, order: { order: 'ASC' } });
        const doc = new PDFDocument({ margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="question-paper.pdf"');
        doc.pipe(res);
        doc.fontSize(18).text('Question Paper', { align: 'center' });
        doc.moveDown();
        questions.forEach((q, idx) => {
            doc.fontSize(12).text(`${idx + 1}. (${q.marks} marks) ${q.questionText}`);
            if (q.options?.length) {
                q.options.forEach((o, i) => doc.text(`   ${String.fromCharCode(65 + i)}. ${o}`));
            }
            doc.moveDown(0.5);
        });
        doc.end();
    }
    async update(id, body) {
        await this.questionRepo.update({ id }, body);
        return this.questionRepo.findOne({ where: { id } });
    }
    async regenerate(id) {
        const q = await this.questionRepo.findOne({ where: { id } });
        if (!q)
            return null;
        return this.qg.regenerateQuestion(q);
    }
};
exports.QuestionsController = QuestionsController;
__decorate([
    (0, common_1.Post)('generate/:examId'),
    __param(0, (0, common_1.Param)('examId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], QuestionsController.prototype, "generate", null);
__decorate([
    (0, common_1.Get)('by-exam/:examId'),
    __param(0, (0, common_1.Param)('examId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuestionsController.prototype, "byExam", null);
__decorate([
    (0, common_1.Get)('pdf/:examId'),
    __param(0, (0, common_1.Param)('examId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QuestionsController.prototype, "asPdf", null);
__decorate([
    (0, common_1.Post)('update/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QuestionsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)('regenerate/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuestionsController.prototype, "regenerate", null);
exports.QuestionsController = QuestionsController = __decorate([
    (0, common_1.Controller)('questions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(1, (0, typeorm_1.InjectRepository)(question_entity_1.Question)),
    __metadata("design:paramtypes", [question_generation_service_1.QuestionGenerationService,
        typeorm_2.Repository])
], QuestionsController);
//# sourceMappingURL=questions.controller.js.map