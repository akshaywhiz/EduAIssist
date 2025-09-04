import { Request } from 'express';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { Response } from 'express';
import { QuestionGenerationService } from './question-generation.service';
export declare class QuestionsController {
    private readonly qg;
    private readonly questionRepo;
    constructor(qg: QuestionGenerationService, questionRepo: Repository<Question>);
    generate(examId: string, body: {
        maxMarks: number;
        weightage: {
            mcq: number;
            short: number;
            long: number;
        };
        marksPerQuestion?: {
            mcq: number;
            short: number;
            long: number;
        };
        questionCounts?: {
            mcqCount: number;
            shortCount: number;
            longCount: number;
        };
        context?: string;
        classId?: string;
        subjectId?: string;
        title?: string;
        duration?: number;
        collectionId?: string;
        vectorCollectionID?: string;
        materialId?: string;
    }, req: Request): Promise<any>;
    byExam(examId: string): Promise<Question[]>;
    asPdf(examId: string, res: Response): Promise<void>;
    update(id: string, body: {
        questionText?: string;
        marks?: number;
        options?: string[];
        correctAnswer?: string;
    }): Promise<Question>;
    regenerate(id: string): Promise<Question>;
}
