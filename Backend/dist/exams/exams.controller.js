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
exports.ExamsController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const exam_entity_1 = require("./entities/exam.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ExamsController = class ExamsController {
    constructor(repo) {
        this.repo = repo;
    }
    async list(q, page = '1', limit = '10') {
        const where = {};
        if (q)
            where.title = (0, typeorm_2.Like)(`%${q}%`);
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;
        const [rows, total] = await this.repo.findAndCount({ where, order: { createdAt: 'DESC' }, take, skip, relations: ['class', 'subject'] });
        const items = rows.map((e) => ({
            ...e,
            className: e.class?.name ?? undefined,
            subjectName: e.subject?.name ?? undefined,
        }));
        return { items, total, page: Number(page), limit: take, pages: Math.ceil(total / take) };
    }
};
exports.ExamsController = ExamsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ExamsController.prototype, "list", null);
exports.ExamsController = ExamsController = __decorate([
    (0, common_1.Controller)('exams'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, typeorm_1.InjectRepository)(exam_entity_1.Exam)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ExamsController);
//# sourceMappingURL=exams.controller.js.map