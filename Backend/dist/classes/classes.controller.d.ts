import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Repository } from 'typeorm';
import { Class } from './entities/class.entity';
export declare class ClassesController {
    private readonly classesService;
    private readonly classesRepo;
    constructor(classesService: ClassesService, classesRepo: Repository<Class>);
    create(createClassDto: CreateClassDto): Promise<Class>;
    findAll(): Promise<Class[]>;
    count(): Promise<{
        total: number;
    }>;
    findMyClasses(req: any): Promise<Class[]>;
    findOne(id: string): Promise<Class>;
    update(id: string, updateClassDto: UpdateClassDto): Promise<Class>;
    remove(id: string): Promise<void>;
}
