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
exports.Report = exports.ReportType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const class_entity_1 = require("../../classes/entities/class.entity");
const subject_entity_1 = require("../../subjects/entities/subject.entity");
var ReportType;
(function (ReportType) {
    ReportType["STUDENT_REPORT_CARD"] = "student_report_card";
    ReportType["CLASS_PERFORMANCE"] = "class_performance";
    ReportType["SUBJECT_ANALYSIS"] = "subject_analysis";
    ReportType["EXAM_SUMMARY"] = "exam_summary";
})(ReportType || (exports.ReportType = ReportType = {}));
let Report = class Report {
};
exports.Report = Report;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Report.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Report.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ReportType,
        default: ReportType.STUDENT_REPORT_CARD,
    }),
    __metadata("design:type", String)
], Report.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json' }),
    __metadata("design:type", Object)
], Report.prototype, "data", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Report.prototype, "filePath", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Report.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Report.prototype, "studentName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Report.prototype, "academicYear", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Report.prototype, "term", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Report.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Report.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'generatedById' }),
    __metadata("design:type", user_entity_1.User)
], Report.prototype, "generatedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Report.prototype, "generatedById", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => class_entity_1.Class, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'classId' }),
    __metadata("design:type", class_entity_1.Class)
], Report.prototype, "class", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Report.prototype, "classId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => subject_entity_1.Subject, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'subjectId' }),
    __metadata("design:type", subject_entity_1.Subject)
], Report.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Report.prototype, "subjectId", void 0);
exports.Report = Report = __decorate([
    (0, typeorm_1.Entity)('reports')
], Report);
//# sourceMappingURL=report.entity.js.map