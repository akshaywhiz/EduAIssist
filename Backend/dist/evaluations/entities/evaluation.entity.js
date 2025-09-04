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
exports.Evaluation = exports.EvaluationStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const exam_entity_1 = require("../../exams/entities/exam.entity");
const student_answer_entity_1 = require("./student-answer.entity");
var EvaluationStatus;
(function (EvaluationStatus) {
    EvaluationStatus["PENDING"] = "pending";
    EvaluationStatus["IN_PROGRESS"] = "in_progress";
    EvaluationStatus["AI_COMPLETED"] = "ai_completed";
    EvaluationStatus["TEACHER_REVIEW"] = "teacher_review";
    EvaluationStatus["COMPLETED"] = "completed";
})(EvaluationStatus || (exports.EvaluationStatus = EvaluationStatus = {}));
let Evaluation = class Evaluation {
};
exports.Evaluation = Evaluation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Evaluation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Evaluation.prototype, "studentName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Evaluation.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], Evaluation.prototype, "totalMarksObtained", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], Evaluation.prototype, "percentage", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EvaluationStatus,
        default: EvaluationStatus.PENDING,
    }),
    __metadata("design:type", String)
], Evaluation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Evaluation.prototype, "overallFeedback", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Evaluation.prototype, "grade", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Evaluation.prototype, "submittedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Evaluation.prototype, "evaluatedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Evaluation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Evaluation.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => exam_entity_1.Exam, (exam) => exam.evaluations),
    (0, typeorm_1.JoinColumn)({ name: 'examId' }),
    __metadata("design:type", exam_entity_1.Exam)
], Evaluation.prototype, "exam", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Evaluation.prototype, "examId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.evaluations, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'evaluatedById' }),
    __metadata("design:type", user_entity_1.User)
], Evaluation.prototype, "evaluatedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Evaluation.prototype, "evaluatedById", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => student_answer_entity_1.StudentAnswer, (answer) => answer.evaluation, { cascade: true }),
    __metadata("design:type", Array)
], Evaluation.prototype, "answers", void 0);
exports.Evaluation = Evaluation = __decorate([
    (0, typeorm_1.Entity)('evaluations')
], Evaluation);
//# sourceMappingURL=evaluation.entity.js.map