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
exports.TeachersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const teachers_entity_1 = require("./entities/teachers.entity");
let TeachersService = class TeachersService {
    constructor(teacherRepo) {
        this.teacherRepo = teacherRepo;
    }
    async create(dto) {
        const teacher = this.teacherRepo.create(dto);
        return this.teacherRepo.save(teacher);
    }
    async findAll(skip = 0, take = 10) {
        const [data, total] = await this.teacherRepo.findAndCount({
            skip,
            take,
        });
        return { data, total };
    }
    async count() {
        return this.teacherRepo.count();
    }
    async findOne(id) {
        const teacher = await this.teacherRepo.findOne({ where: { id } });
        if (!teacher)
            throw new common_1.NotFoundException(`Teacher with ID ${id} not found`);
        return teacher;
    }
    async update(id, dto) {
        const teacher = await this.findOne(id);
        Object.assign(teacher, dto);
        return this.teacherRepo.save(teacher);
    }
    async remove(id) {
        const teacher = await this.findOne(id);
        await this.teacherRepo.remove(teacher);
    }
};
exports.TeachersService = TeachersService;
exports.TeachersService = TeachersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(teachers_entity_1.Teacher)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TeachersService);
//# sourceMappingURL=teachers.service.js.map