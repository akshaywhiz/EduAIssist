import { Repository } from 'typeorm';
import { Teacher } from './entities/teachers.entity';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
export declare class TeachersService {
    private teacherRepo;
    constructor(teacherRepo: Repository<Teacher>);
    create(dto: CreateTeacherDto): Promise<Teacher>;
    findAll(skip?: number, take?: number): Promise<{
        data: Teacher[];
        total: number;
    }>;
    count(): Promise<number>;
    findOne(id: number): Promise<Teacher>;
    update(id: number, dto: UpdateTeacherDto): Promise<Teacher>;
    remove(id: number): Promise<void>;
}
