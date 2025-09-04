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
exports.Question = exports.DifficultyLevel = exports.QuestionType = void 0;
const typeorm_1 = require("typeorm");
const exam_entity_1 = require("../../exams/entities/exam.entity");
const student_answer_entity_1 = require("../../evaluations/entities/student-answer.entity");
var QuestionType;
(function (QuestionType) {
    QuestionType["MULTIPLE_CHOICE"] = "multiple_choice";
    QuestionType["SHORT_ANSWER"] = "short_answer";
    QuestionType["LONG_ANSWER"] = "long_answer";
    QuestionType["ESSAY"] = "essay";
    QuestionType["FILL_IN_BLANK"] = "fill_in_blank";
})(QuestionType || (exports.QuestionType = QuestionType = {}));
var DifficultyLevel;
(function (DifficultyLevel) {
    DifficultyLevel["EASY"] = "easy";
    DifficultyLevel["MEDIUM"] = "medium";
    DifficultyLevel["HARD"] = "hard";
})(DifficultyLevel || (exports.DifficultyLevel = DifficultyLevel = {}));
let Question = class Question {
};
exports.Question = Question;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Question.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Question.prototype, "questionText", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: QuestionType,
        default: QuestionType.SHORT_ANSWER,
    }),
    __metadata("design:type", String)
], Question.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: DifficultyLevel,
        default: DifficultyLevel.MEDIUM,
    }),
    __metadata("design:type", String)
], Question.prototype, "difficulty", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Question.prototype, "marks", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Question.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Question.prototype, "options", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Question.prototype, "correctAnswer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Question.prototype, "explanation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], Question.prototype, "keywords", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Question.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Question.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Question.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => exam_entity_1.Exam, (exam) => exam.questions, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'examId' }),
    __metadata("design:type", exam_entity_1.Exam)
], Question.prototype, "exam", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Question.prototype, "examId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => student_answer_entity_1.StudentAnswer, (answer) => answer.question),
    __metadata("design:type", Array)
], Question.prototype, "studentAnswers", void 0);
exports.Question = Question = __decorate([
    (0, typeorm_1.Entity)('questions')
], Question);
//# sourceMappingURL=question.entity.js.map