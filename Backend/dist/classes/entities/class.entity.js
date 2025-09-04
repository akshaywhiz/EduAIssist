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
exports.Class = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const subject_entity_1 = require("../../subjects/entities/subject.entity");
const exam_entity_1 = require("../../exams/entities/exam.entity");
let Class = class Class {
};
exports.Class = Class;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Class.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Class.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Class.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Class.prototype, "grade", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Class.prototype, "section", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Class.prototype, "academicYear", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Class.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Class.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Class.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.classes),
    (0, typeorm_1.JoinColumn)({ name: 'teacherId' }),
    __metadata("design:type", user_entity_1.User)
], Class.prototype, "teacher", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Class.prototype, "teacherId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => subject_entity_1.Subject, (subject) => subject.class),
    __metadata("design:type", Array)
], Class.prototype, "subjects", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => exam_entity_1.Exam, (exam) => exam.class),
    __metadata("design:type", Array)
], Class.prototype, "exams", void 0);
exports.Class = Class = __decorate([
    (0, typeorm_1.Entity)('classes')
], Class);
//# sourceMappingURL=class.entity.js.map