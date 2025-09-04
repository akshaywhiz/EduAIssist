import { Exam } from '../../exams/entities/exam.entity';
import { StudentAnswer } from '../../evaluations/entities/student-answer.entity';
export declare enum QuestionType {
    MULTIPLE_CHOICE = "multiple_choice",
    SHORT_ANSWER = "short_answer",
    LONG_ANSWER = "long_answer",
    ESSAY = "essay",
    FILL_IN_BLANK = "fill_in_blank"
}
export declare enum DifficultyLevel {
    EASY = "easy",
    MEDIUM = "medium",
    HARD = "hard"
}
export declare class Question {
    id: string;
    questionText: string;
    type: QuestionType;
    difficulty: DifficultyLevel;
    marks: number;
    order: number;
    options: string[];
    correctAnswer: string;
    explanation: string;
    keywords: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    exam: Exam;
    examId: string;
    studentAnswers: StudentAnswer[];
}
