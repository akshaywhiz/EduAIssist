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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const auth_service_1 = require("./auth.service");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const users_service_1 = require("../users/users.service");
let AuthController = class AuthController {
    constructor(authService, usersService) {
        this.authService = authService;
        this.usersService = usersService;
    }
    async googleAuth() {
    }
    async googleAuthCallback(req) {
        try {
            const result = await this.authService.googleLogin(req);
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            return {
                url: `${frontendUrl}/auth/callback?token=${result.access_token}`,
            };
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
                return {
                    url: `${frontendUrl}/auth/callback?error=unauthorized`,
                };
            }
            throw error;
        }
    }
    async microsoftAuth() {
    }
    async microsoftAuthCallback(req) {
        try {
            const result = await this.authService.microsoftLogin(req);
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            return {
                url: `${frontendUrl}/auth/callback?token=${result.access_token}`,
            };
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
                return {
                    url: `${frontendUrl}/auth/callback?error=unauthorized`,
                };
            }
            throw error;
        }
    }
    async getProfile(req) {
        return this.authService.getProfile(req.user.id);
    }
    async logout() {
        return { message: 'Logged out successfully' };
    }
    async testLogin(body) {
        const isAdmin = body?.userType === 'admin';
        const email = isAdmin ? 'admin@eduaissist.com' : 'teacher@eduaissist.com';
        const firstName = isAdmin ? 'Admin' : 'John';
        const lastName = isAdmin ? 'User' : 'Smith';
        let user = await this.usersService.findByEmail(email);
        if (!user) {
            return { message: 'User not authorized' };
        }
        return this.authService.login(user);
    }
    async testUnauthorizedLogin(body) {
        const user = await this.usersService.findByEmail(body.email);
        if (!user) {
            throw new common_1.UnauthorizedException('User not authorized to access this platform');
        }
        return this.authService.login(user);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('google'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('google/callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    (0, common_1.Redirect)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuthCallback", null);
__decorate([
    (0, common_1.Get)('microsoft'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('microsoft')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "microsoftAuth", null);
__decorate([
    (0, common_1.Get)('microsoft/callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('microsoft')),
    (0, common_1.Redirect)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "microsoftAuthCallback", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('test-login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "testLogin", null);
__decorate([
    (0, common_1.Post)('test-unauthorized-login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "testUnauthorizedLogin", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService, users_service_1.UsersService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map