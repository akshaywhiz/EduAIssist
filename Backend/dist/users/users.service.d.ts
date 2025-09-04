import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private readonly usersRepo;
    constructor(usersRepo: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findByGoogleId(googleId: string): Promise<User | null>;
    findByMicrosoftId(microsoftId: string): Promise<User | null>;
    findTeachers(): Promise<User[]>;
    findAdmins(): Promise<User[]>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: string): Promise<void>;
    createOrUpdateOAuthUser(oauthData: {
        email: string;
        firstName: string;
        lastName: string;
        avatar?: string;
        googleId?: string;
        microsoftId?: string;
    }): Promise<User>;
}
