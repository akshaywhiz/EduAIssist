import { Class } from '../../classes/entities/class.entity';
import { Exam } from '../../exams/entities/exam.entity';
export declare class Subject {
    id: string;
    name: string;
    description: string;
    code: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    class: Class;
    classId: string;
    exams: Exam[];
}
