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
exports.ClassesController = void 0;
const common_1 = require("@nestjs/common");
const classes_service_1 = require("./classes.service");
const create_class_dto_1 = require("./dto/create-class.dto");
const update_class_dto_1 = require("./dto/update-class.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const class_entity_1 = require("./entities/class.entity");
let ClassesController = class ClassesController {
    constructor(classesService, classesRepo) {
        this.classesService = classesService;
        this.classesRepo = classesRepo;
    }
    create(createClassDto) {
        return this.classesService.create(createClassDto);
    }
    findAll() {
        return this.classesService.findAll();
    }
    async count() {
        const total = await this.classesRepo.count({ where: { isActive: true } });
        return { total };
    }
    findMyClasses(req) {
        return this.classesService.findByTeacher(req.user.id);
    }
    findOne(id) {
        return this.classesService.findOne(id);
    }
    update(id, updateClassDto) {
        return this.classesService.update(id, updateClassDto);
    }
    remove(id) {
        return this.classesService.remove(id);
    }
};
exports.ClassesController = ClassesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.TEACHER),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_class_dto_1.CreateClassDto]),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('count'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClassesController.prototype, "count", null);
__decorate([
    (0, common_1.Get)('my-classes'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.TEACHER),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "findMyClasses", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.TEACHER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_class_dto_1.UpdateClassDto]),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "remove", null);
exports.ClassesController = ClassesController = __decorate([
    (0, common_1.Controller)('classes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(1, (0, typeorm_1.InjectRepository)(class_entity_1.Class)),
    __metadata("design:paramtypes", [classes_service_1.ClassesService,
        typeorm_2.Repository])
], ClassesController);
//# sourceMappingURL=classes.controller.js.map