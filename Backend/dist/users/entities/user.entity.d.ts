import { Class } from '../../classes/entities/class.entity';
import { Exam } from '../../exams/entities/exam.entity';
import { Evaluation } from '../../evaluations/entities/evaluation.entity';
export declare enum UserRole {
    ADMIN = "admin",
    TEACHER = "teacher",
    STUDENT = "student"
}
export declare class User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar: string;
    role: UserRole;
    googleId: string;
    microsoftId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    classes: Class[];
    createdExams: Exam[];
    evaluations: Evaluation[];
}
