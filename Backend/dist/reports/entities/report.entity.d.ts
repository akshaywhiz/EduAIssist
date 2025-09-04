import { User } from '../../users/entities/user.entity';
import { Class } from '../../classes/entities/class.entity';
import { Subject } from '../../subjects/entities/subject.entity';
export declare enum ReportType {
    STUDENT_REPORT_CARD = "student_report_card",
    CLASS_PERFORMANCE = "class_performance",
    SUBJECT_ANALYSIS = "subject_analysis",
    EXAM_SUMMARY = "exam_summary"
}
export declare class Report {
    id: string;
    title: string;
    type: ReportType;
    data: any;
    filePath: string;
    studentId: string;
    studentName: string;
    academicYear: string;
    term: string;
    createdAt: Date;
    updatedAt: Date;
    generatedBy: User;
    generatedById: string;
    class: Class;
    classId: string;
    subject: Subject;
    subjectId: string;
}
