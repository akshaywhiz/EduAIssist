import { Repository } from 'typeorm';
import { Exam } from './entities/exam.entity';
export declare class ExamsController {
    private readonly repo;
    constructor(repo: Repository<Exam>);
    list(q?: string, page?: string, limit?: string): Promise<{
        items: {
            className: any;
            subjectName: any;
            id: string;
            title: string;
            description: string;
            type: import("./entities/exam.entity").ExamType;
            status: import("./entities/exam.entity").ExamStatus;
            totalMarks: number;
            duration: number;
            scheduledAt: Date;
            startTime: Date;
            endTime: Date;
            instructions: string;
            createdAt: Date;
            updatedAt: Date;
            createdBy: import("../users/entities/user.entity").User;
            createdById: string;
            class: import("../classes/entities/class.entity").Class;
            classId: string;
            subject: import("../subjects/entities/subject.entity").Subject;
            subjectId: string;
            questions: import("../questions/entities/question.entity").Question[];
            evaluations: import("../evaluations/entities/evaluation.entity").Evaluation[];
        }[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
}
