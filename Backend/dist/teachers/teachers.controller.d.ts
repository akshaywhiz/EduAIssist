import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
export declare class TeachersController {
    private readonly teachersService;
    constructor(teachersService: TeachersService);
    create(dto: CreateTeacherDto): Promise<import("./entities/teachers.entity").Teacher>;
    findAll(skip?: number, take?: number): Promise<{
        data: import("./entities/teachers.entity").Teacher[];
        total: number;
    }>;
    count(): Promise<number>;
    findOne(id: string): Promise<import("./entities/teachers.entity").Teacher>;
    update(id: string, dto: UpdateTeacherDto): Promise<import("./entities/teachers.entity").Teacher>;
    remove(id: string): Promise<void>;
}
