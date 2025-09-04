import { Repository } from 'typeorm';
import { Class } from './entities/class.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
export declare class ClassesService {
    private readonly classesRepo;
    constructor(classesRepo: Repository<Class>);
    create(createClassDto: CreateClassDto): Promise<Class>;
    findAll(): Promise<Class[]>;
    findOne(id: string): Promise<Class>;
    findByTeacher(teacherId: string): Promise<Class[]>;
    update(id: string, updateClassDto: UpdateClassDto): Promise<Class>;
    remove(id: string): Promise<void>;
    count(): Promise<number>;
}
