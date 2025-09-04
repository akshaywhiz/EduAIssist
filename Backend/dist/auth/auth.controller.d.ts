import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
export declare class AuthController {
    private authService;
    private usersService;
    constructor(authService: AuthService, usersService: UsersService);
    googleAuth(): Promise<void>;
    googleAuthCallback(req: any): Promise<{
        url: string;
    }>;
    microsoftAuth(): Promise<void>;
    microsoftAuthCallback(req: any): Promise<{
        url: string;
    }>;
    getProfile(req: any): Promise<import("../users/entities/user.entity").User>;
    logout(): Promise<{
        message: string;
    }>;
    testLogin(body: {
        userType: 'admin' | 'teacher';
    }): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import("../users/entities/user.entity").UserRole;
            avatar: string;
        };
    } | {
        message: string;
    }>;
    testUnauthorizedLogin(body: {
        email: string;
    }): Promise<{
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
}
