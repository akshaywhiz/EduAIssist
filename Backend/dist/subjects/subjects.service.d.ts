import { Repository } from 'typeorm';
import { Subject } from './entities/subject.entity';
export declare class SubjectsService {
    private readonly subjectsRepo;
    constructor(subjectsRepo: Repository<Subject>);
    findAll(): Promise<Subject[]>;
}
