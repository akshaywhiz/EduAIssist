import { OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
export declare class SeedService implements OnApplicationBootstrap {
    private readonly usersRepo;
    private readonly logger;
    constructor(usersRepo: Repository<User>);
    onApplicationBootstrap(): Promise<void>;
    private seedUsers;
}
