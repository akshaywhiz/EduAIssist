import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string): Promise<User | null>;
    login(user: User): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import("../users/entities/user.entity").UserRole;
            avatar: string;
        };
    }>;
    googleLogin(req: any): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import("../users/entities/user.entity").UserRole;
            avatar: string;
        };
    }>;
    microsoftLogin(req: any): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import("../users/entities/user.entity").UserRole;
            avatar: string;
        };
    }>;
    getProfile(userId: string): Promise<User>;
}
