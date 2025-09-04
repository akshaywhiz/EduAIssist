import { Repository } from 'typeorm';
import { Exam } from '../exams/entities/exam.entity';
import { Question } from './entities/question.entity';
import { ChromaService } from '../materials/ingest/chroma.service';
import { Material } from '../materials/entities/material.entity';
export declare class QuestionGenerationService {
    private readonly examRepo;
    private readonly questionRepo;
    private readonly materialRepo;
    private readonly chroma;
    private ollamaBase;
    private model;
    private timeoutMs;
    constructor(examRepo: Repository<Exam>, questionRepo: Repository<Question>, materialRepo: Repository<Material>, chroma: ChromaService);
    generateOrCreate(examId: string, body: {
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
        materialId?: string;
    }, createdById?: string): Promise<any>;
    generateForExam(examId: string, config: {
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
        collectionId?: string;
        materialId?: string;
    }): Promise<any>;
    private buildEnhancedPrompt;
    private ollama;
    private parseQuestions;
    private generateFallback;
    regenerateQuestion(question: Question): Promise<Question>;
}
