import { User } from '../../users/entities/user.entity';
import { Class } from '../../classes/entities/class.entity';
import { Subject } from '../../subjects/entities/subject.entity';
import { Question } from '../../questions/entities/question.entity';
import { Evaluation } from '../../evaluations/entities/evaluation.entity';
export declare enum ExamType {
    UNIT_TEST = "unit_test",
    MIDTERM = "midterm",
    FINAL = "final",
    ASSIGNMENT = "assignment"
}
export declare enum ExamStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
    ACTIVE = "active",
    COMPLETED = "completed",
    ARCHIVED = "archived"
}
export declare class Exam {
    id: string;
    title: string;
    description: string;
    type: ExamType;
    status: ExamStatus;
    totalMarks: number;
    duration: number;
    scheduledAt: Date;
    startTime: Date;
    endTime: Date;
    instructions: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy: User;
    createdById: string;
    class: Class;
    classId: string;
    subject: Subject;
    subjectId: string;
    questions: Question[];
    evaluations: Evaluation[];
}
