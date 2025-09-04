"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const question_entity_1 = require("./entities/question.entity");
const exam_entity_1 = require("../exams/entities/exam.entity");
const material_entity_1 = require("../materials/entities/material.entity");
const questions_controller_1 = require("./questions.controller");
const question_generation_service_1 = require("./question-generation.service");
const chroma_service_1 = require("../materials/ingest/chroma.service");
let QuestionsModule = class QuestionsModule {
};
exports.QuestionsModule = QuestionsModule;
exports.QuestionsModule = QuestionsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([question_entity_1.Question, exam_entity_1.Exam, material_entity_1.Material])],
        controllers: [questions_controller_1.QuestionsController],
        providers: [question_generation_service_1.QuestionGenerationService, chroma_service_1.ChromaService],
        exports: [question_generation_service_1.QuestionGenerationService],
    })
], QuestionsModule);
//# sourceMappingURL=questions.module.js.map