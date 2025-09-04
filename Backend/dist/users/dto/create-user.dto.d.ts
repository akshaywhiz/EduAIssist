import { UserRole } from '../entities/user.entity';
export declare class CreateUserDto {
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    role: UserRole;
    googleId?: string;
    microsoftId?: string;
    isActive?: boolean;
}
