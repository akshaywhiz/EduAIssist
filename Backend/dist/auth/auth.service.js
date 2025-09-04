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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async validateUser(email) {
        return this.usersService.findByEmail(email);
    }
    async login(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                avatar: user.avatar,
            },
        };
    }
    async googleLogin(req) {
        const { user: oauthUser } = req;
        const existingUser = await this.usersService.findByEmail(oauthUser.email);
        if (!existingUser) {
            throw new common_1.UnauthorizedException('User not authorized to access this platform');
        }
        const user = await this.usersService.createOrUpdateOAuthUser({
            email: oauthUser.email,
            firstName: oauthUser.firstName,
            lastName: oauthUser.lastName,
            avatar: oauthUser.avatar,
            googleId: oauthUser.googleId,
        });
        return this.login(user);
    }
    async microsoftLogin(req) {
        const { user: oauthUser } = req;
        const existingUser = await this.usersService.findByEmail(oauthUser.email);
        if (!existingUser) {
            throw new common_1.UnauthorizedException('User not authorized to access this platform');
        }
        const user = await this.usersService.createOrUpdateOAuthUser({
            email: oauthUser.email,
            firstName: oauthUser.firstName,
            lastName: oauthUser.lastName,
            microsoftId: oauthUser.microsoftId,
        });
        return this.login(user);
    }
    async getProfile(userId) {
        return this.usersService.findOne(userId);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map