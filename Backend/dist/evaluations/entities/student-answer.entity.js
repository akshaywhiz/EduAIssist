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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentAnswer = void 0;
const typeorm_1 = require("typeorm");
const question_entity_1 = require("../../questions/entities/question.entity");
const evaluation_entity_1 = require("./evaluation.entity");
let StudentAnswer = class StudentAnswer {
};
exports.StudentAnswer = StudentAnswer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], StudentAnswer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], StudentAnswer.prototype, "answerText", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], StudentAnswer.prototype, "answerImagePath", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], StudentAnswer.prototype, "marksObtained", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], StudentAnswer.prototype, "aiEvaluation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], StudentAnswer.prototype, "aiScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], StudentAnswer.prototype, "teacherFeedback", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], StudentAnswer.prototype, "isEvaluated", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], StudentAnswer.prototype, "isVerifiedByTeacher", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], StudentAnswer.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], StudentAnswer.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => question_entity_1.Question, (question) => question.studentAnswers),
    (0, typeorm_1.JoinColumn)({ name: 'questionId' }),
    __metadata("design:type", question_entity_1.Question)
], StudentAnswer.prototype, "question", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StudentAnswer.prototype, "questionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => evaluation_entity_1.Evaluation, (evaluation) => evaluation.answers, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'evaluationId' }),
    __metadata("design:type", evaluation_entity_1.Evaluation)
], StudentAnswer.prototype, "evaluation", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StudentAnswer.prototype, "evaluationId", void 0);
exports.StudentAnswer = StudentAnswer = __decorate([
    (0, typeorm_1.Entity)('student_answers')
], StudentAnswer);
//# sourceMappingURL=student-answer.entity.js.map