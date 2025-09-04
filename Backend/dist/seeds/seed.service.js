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
var SeedService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
let SeedService = SeedService_1 = class SeedService {
    constructor(usersRepo) {
        this.usersRepo = usersRepo;
        this.logger = new common_1.Logger(SeedService_1.name);
    }
    async onApplicationBootstrap() {
        try {
            await this.seedUsers();
        }
        catch (error) {
            this.logger.error('Seed failed', error);
        }
    }
    async seedUsers() {
        const existingAdmin = await this.usersRepo.findOne({
            where: { email: 'admin@eduaissist.com' },
        });
        if (!existingAdmin) {
            const admin = this.usersRepo.create({
                email: 'admin@eduaissist.com',
                firstName: 'Admin',
                lastName: 'User',
                role: user_entity_1.UserRole.ADMIN,
                isActive: true,
            });
            await this.usersRepo.save(admin);
            this.logger.log('Seeded default admin user');
        }
        const existingTeacher = await this.usersRepo.findOne({
            where: { email: 'teacher@eduaissist.com' },
        });
        if (!existingTeacher) {
            const teacher = this.usersRepo.create({
                email: 'teacher@eduaissist.com',
                firstName: 'John',
                lastName: 'Smith',
                role: user_entity_1.UserRole.TEACHER,
                isActive: true,
            });
            await this.usersRepo.save(teacher);
            this.logger.log('Seeded default teacher user');
        }
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = SeedService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SeedService);
//# sourceMappingURL=seed.service.js.map