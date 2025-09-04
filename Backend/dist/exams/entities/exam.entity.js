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
exports.Exam = exports.ExamStatus = exports.ExamType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const class_entity_1 = require("../../classes/entities/class.entity");
const subject_entity_1 = require("../../subjects/entities/subject.entity");
const question_entity_1 = require("../../questions/entities/question.entity");
const evaluation_entity_1 = require("../../evaluations/entities/evaluation.entity");
var ExamType;
(function (ExamType) {
    ExamType["UNIT_TEST"] = "unit_test";
    ExamType["MIDTERM"] = "midterm";
    ExamType["FINAL"] = "final";
    ExamType["ASSIGNMENT"] = "assignment";
})(ExamType || (exports.ExamType = ExamType = {}));
var ExamStatus;
(function (ExamStatus) {
    ExamStatus["DRAFT"] = "draft";
    ExamStatus["PUBLISHED"] = "published";
    ExamStatus["ACTIVE"] = "active";
    ExamStatus["COMPLETED"] = "completed";
    ExamStatus["ARCHIVED"] = "archived";
})(ExamStatus || (exports.ExamStatus = ExamStatus = {}));
let Exam = class Exam {
};
exports.Exam = Exam;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Exam.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Exam.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Exam.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ExamType,
        default: ExamType.UNIT_TEST,
    }),
    __metadata("design:type", String)
], Exam.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ExamStatus,
        default: ExamStatus.DRAFT,
    }),
    __metadata("design:type", String)
], Exam.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Exam.prototype, "totalMarks", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Exam.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Exam.prototype, "scheduledAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Exam.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Exam.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Exam.prototype, "instructions", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Exam.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Exam.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.createdExams),
    (0, typeorm_1.JoinColumn)({ name: 'createdById' }),
    __metadata("design:type", user_entity_1.User)
], Exam.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Exam.prototype, "createdById", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => class_entity_1.Class, (classEntity) => classEntity.exams),
    (0, typeorm_1.JoinColumn)({ name: 'classId' }),
    __metadata("design:type", class_entity_1.Class)
], Exam.prototype, "class", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Exam.prototype, "classId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => subject_entity_1.Subject, (subject) => subject.exams),
    (0, typeorm_1.JoinColumn)({ name: 'subjectId' }),
    __metadata("design:type", subject_entity_1.Subject)
], Exam.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Exam.prototype, "subjectId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => question_entity_1.Question, (question) => question.exam),
    __metadata("design:type", Array)
], Exam.prototype, "questions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => evaluation_entity_1.Evaluation, (evaluation) => evaluation.exam),
    __metadata("design:type", Array)
], Exam.prototype, "evaluations", void 0);
exports.Exam = Exam = __decorate([
    (0, typeorm_1.Entity)('exams')
], Exam);
//# sourceMappingURL=exam.entity.js.map