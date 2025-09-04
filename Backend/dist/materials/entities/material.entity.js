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
exports.Material = exports.MaterialType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
var MaterialType;
(function (MaterialType) {
    MaterialType["STUDY"] = "study";
    MaterialType["ANSWER"] = "answer";
})(MaterialType || (exports.MaterialType = MaterialType = {}));
let Material = class Material {
};
exports.Material = Material;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Material.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: MaterialType }),
    __metadata("design:type", String)
], Material.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Material.prototype, "teacherId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.id, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'teacherId' }),
    __metadata("design:type", user_entity_1.User)
], Material.prototype, "teacher", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 32 }),
    __metadata("design:type", String)
], Material.prototype, "class", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 128 }),
    __metadata("design:type", String)
], Material.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 2048 }),
    __metadata("design:type", String)
], Material.prototype, "pdfCloudUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 191 }),
    __metadata("design:type", String)
], Material.prototype, "vectorDbCollectionId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Material.prototype, "originalName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Material.prototype, "mimeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'bigint' }),
    __metadata("design:type", String)
], Material.prototype, "size", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Material.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Material.prototype, "updatedAt", void 0);
exports.Material = Material = __decorate([
    (0, typeorm_1.Entity)('materials')
], Material);
//# sourceMappingURL=material.entity.js.map