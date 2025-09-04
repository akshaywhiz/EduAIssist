import { User } from '../../users/entities/user.entity';
import { Exam } from '../../exams/entities/exam.entity';
import { StudentAnswer } from './student-answer.entity';
export declare enum EvaluationStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    AI_COMPLETED = "ai_completed",
    TEACHER_REVIEW = "teacher_review",
    COMPLETED = "completed"
}
export declare class Evaluation {
    id: string;
    studentName: string;
    studentId: string;
    totalMarksObtained: number;
    percentage: number;
    status: EvaluationStatus;
    overallFeedback: string;
    grade: string;
    submittedAt: Date;
    evaluatedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    exam: Exam;
    examId: string;
    evaluatedBy: User;
    evaluatedById: string;
    answers: StudentAnswer[];
}
