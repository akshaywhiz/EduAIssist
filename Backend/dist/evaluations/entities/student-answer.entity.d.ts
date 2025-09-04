import { Question } from '../../questions/entities/question.entity';
import { Evaluation } from './evaluation.entity';
export declare class StudentAnswer {
    id: string;
    answerText: string;
    answerImagePath: string;
    marksObtained: number;
    aiEvaluation: string;
    aiScore: number;
    teacherFeedback: string;
    isEvaluated: boolean;
    isVerifiedByTeacher: boolean;
    createdAt: Date;
    updatedAt: Date;
    question: Question;
    questionId: string;
    evaluation: Evaluation;
    evaluationId: string;
}
