import { User } from '../../users/entities/user.entity';
import { Subject } from '../../subjects/entities/subject.entity';
import { Exam } from '../../exams/entities/exam.entity';
export declare class Class {
    id: string;
    name: string;
    description: string;
    grade: string;
    section: string;
    academicYear: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    teacher: User;
    teacherId: string;
    subjects: Subject[];
    exams: Exam[];
}
