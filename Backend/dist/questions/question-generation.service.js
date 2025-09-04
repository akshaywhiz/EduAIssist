"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionGenerationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const exam_entity_1 = require("../exams/entities/exam.entity");
const question_entity_1 = require("./entities/question.entity");
const axios_1 = require("axios");
const chroma_service_1 = require("../materials/ingest/chroma.service");
const material_entity_1 = require("../materials/entities/material.entity");
let QuestionGenerationService = class QuestionGenerationService {
    constructor(examRepo, questionRepo, materialRepo, chroma) {
        this.examRepo = examRepo;
        this.questionRepo = questionRepo;
        this.materialRepo = materialRepo;
        this.chroma = chroma;
        this.ollamaBase = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
        this.model = process.env.OLLAMA_MODEL || 'mistral';
        this.timeoutMs = Number(process.env.OLLAMA_TIMEOUT_MS || 15000);
    }
    async generateOrCreate(examId, body, createdById) {
        let exam = await this.examRepo.findOne({ where: { id: examId } });
        if (!exam) {
            if (!body.classId || !body.subjectId) {
                throw new Error('Exam not found and classId/subjectId not provided to create one');
            }
            exam = await this.examRepo.save({
                title: body.title || `Question Paper - ${new Date().toLocaleDateString()}`,
                type: exam_entity_1.ExamType.UNIT_TEST,
                status: exam_entity_1.ExamStatus.DRAFT,
                totalMarks: body.maxMarks,
                duration: body.duration || 60,
                createdById: createdById || undefined,
                classId: body.classId,
                subjectId: body.subjectId,
            });
        }
        return this.generateForExam(exam.id, body);
    }
    async generateForExam(examId, config) {
        const exam = await this.examRepo.findOne({ where: { id: examId } });
        if (!exam)
            throw new Error('Exam not found');
        let collectionId = config.collectionId;
        console.log(`[QuestionGen] Initial collectionId from config: ${collectionId}`);
        if (!collectionId && config.materialId) {
            console.log(`[QuestionGen] No collectionId provided, resolving from materialId: ${config.materialId}`);
            const mat = await this.materialRepo.findOne({ where: { id: config.materialId } });
            if (mat) {
                console.log(`[QuestionGen] Found material:`, {
                    id: mat.id,
                    name: mat.originalName,
                    vectorDbCollectionId: mat.vectorDbCollectionId
                });
                collectionId = mat.vectorDbCollectionId || undefined;
            }
            else {
                console.error(`[QuestionGen] Material not found with ID: ${config.materialId}`);
            }
        }
        if (!collectionId) {
            throw new Error('No vector collection provided. Please select a study material/book.');
        }
        const marksPerQuestion = config.marksPerQuestion || { mcq: 1, short: 5, long: 10 };
        const questionCounts = config.questionCounts || {
            mcqCount: Math.round((config.maxMarks * config.weightage.mcq / 100) / marksPerQuestion.mcq),
            shortCount: Math.round((config.maxMarks * config.weightage.short / 100) / marksPerQuestion.short),
            longCount: Math.round((config.maxMarks * config.weightage.long / 100) / marksPerQuestion.long)
        };
        let bookContext = '';
        try {
            console.log(`[QuestionGen] Attempting to fetch content from collection: ${collectionId}`);
            const collectionStats = await this.chroma.getCollectionStats(collectionId);
            console.log(`[QuestionGen] Collection stats:`, collectionStats);
            if (!collectionStats.exists) {
                throw new Error(`Collection ${collectionId} does not exist`);
            }
            if (collectionStats.count === 0) {
                throw new Error(`Collection ${collectionId} has no documents`);
            }
            try {
                console.log('[QuestionGen] Attempting alternative content retrieval...');
                const collectionInfo = await this.chroma.getCollection(collectionId);
                console.log('[QuestionGen] Collection info:', collectionInfo);
                const docCount = await this.chroma.count(collectionInfo.id);
                console.log(`[QuestionGen] Collection has ${docCount} documents`);
                bookContext = '';
                if (docCount > 0) {
                    const firstDocs = await this.chroma.getDocuments(collectionInfo.id);
                    if (firstDocs && firstDocs.length > 0) {
                        const joined = firstDocs.join('\n---\n');
                        bookContext = joined.length > 12000 ? joined.slice(0, 12000) : joined;
                        console.log(`[QuestionGen] Alternative method successful, got ${bookContext.length} characters`);
                    }
                }
                if (!bookContext) {
                    console.warn('[QuestionGen] Failed to retrieve study material context; proceeding without context');
                    bookContext = '';
                }
            }
            catch (altError) {
                console.error('[QuestionGen] Alternative method also failed:', altError.message);
            }
        }
        catch (e) {
            console.error('[QuestionGen] Error retrieving study material context:', e.message);
        }
        const prompt = this.buildEnhancedPrompt({
            subject: exam.subjectId,
            grade: exam.classId,
            maxMarks: config.maxMarks,
            weightage: config.weightage,
            marksPerQuestion,
            questionCounts,
            context: bookContext,
            vectorCollectionId: collectionId,
        });
        try {
            const preview = prompt.length > 4000 ? prompt.slice(0, 4000) + '... [truncated]' : prompt;
            console.info('[QuestionGen] Ollama prompt preview:\n', preview);
        }
        catch { }
        let blocks = [];
        try {
            const completion = await this.ollama(prompt);
            blocks = this.parseQuestions(completion);
        }
        catch {
            blocks = [];
        }
        if (!blocks.length) {
            blocks = this.generateFallback(config, questionCounts, marksPerQuestion);
        }
        let order = 1;
        const toSave = [];
        for (const b of blocks) {
            toSave.push({
                examId: exam.id,
                questionText: b.text,
                type: b.type,
                difficulty: b.difficulty ?? question_entity_1.DifficultyLevel.MEDIUM,
                marks: b.marks,
                order: order++,
                options: b.options,
                correctAnswer: b.answer,
            });
        }
        const saved = await this.questionRepo.save(toSave);
        return saved;
    }
    buildEnhancedPrompt(args) {
        return `SYSTEM: You are an expert exam question paper generator. Your task is to generate questions STRICTLY from the provided textbook content. Do NOT invent facts beyond the context provided.

TASK: Create a comprehensive question paper for subject ${args.subject}, grade ${args.grade}.

CONSTRAINTS:
- Maximum Marks: ${args.maxMarks}
- MCQs: ${args.questionCounts.mcqCount} questions, ${args.marksPerQuestion.mcq} mark each
- Short Questions: ${args.questionCounts.shortCount} questions, ${args.marksPerQuestion.short} marks each  
- Long Questions: ${args.questionCounts.longCount} questions, ${args.marksPerQuestion.long} marks each

RULES:
1. Use ONLY the provided book content (vector collection: ${args.vectorCollectionId})
2. Do NOT repeat questions
3. Cover the ENTIRE book content, not just specific chapters
4. Clearly mention marks for each question
5. Ensure questions are balanced and cover different topics from the book

OUTPUT FORMAT (JSON only):
{
  "questions": [
    { 
      "type": "multiple_choice|short_answer|long_answer", 
      "marks": number, 
      "text": "Question text with clear mark indication", 
      "options": ["A","B","C","D"], 
      "answer": "Correct answer", 
      "difficulty": "easy|medium|hard" 
    }
  ]
}

BOOK CONTEXT (source text to base all questions on):
${args.context}

Generate exactly ${args.questionCounts.mcqCount} MCQs, ${args.questionCounts.shortCount} short questions, and ${args.questionCounts.longCount} long questions. Each question must be derived from the book content above.`;
    }
    async ollama(prompt) {
        console.log("***** ollama for generate questions *******", `${this.ollamaBase}/api/generate`);
        console.log("***** Passing prompt to ollama ==> ollama *******", prompt);
        const res = await axios_1.default.post(`${this.ollamaBase}/api/generate`, { model: this.model, prompt, stream: false }, { timeout: this.timeoutMs });
        return res.data?.response ?? '';
    }
    parseQuestions(response) {
        try {
            const start = response.indexOf('{');
            const end = response.lastIndexOf('}') + 1;
            const json = JSON.parse(response.slice(start, end));
            const out = Array.isArray(json.questions) ? json.questions : [];
            return out.map((q) => ({
                type: q.type === 'multiple_choice' ? question_entity_1.QuestionType.MULTIPLE_CHOICE : (q.type === 'long_answer' ? question_entity_1.QuestionType.LONG_ANSWER : question_entity_1.QuestionType.SHORT_ANSWER),
                marks: Number(q.marks || 1),
                text: String(q.text || ''),
                options: Array.isArray(q.options) ? q.options : undefined,
                answer: q.answer ? String(q.answer) : undefined,
                difficulty: q.difficulty?.toLowerCase() === 'hard' ? question_entity_1.DifficultyLevel.HARD : (q.difficulty?.toLowerCase() === 'easy' ? question_entity_1.DifficultyLevel.EASY : question_entity_1.DifficultyLevel.MEDIUM),
            }));
        }
        catch {
            return [];
        }
    }
    generateFallback(config, questionCounts, marksPerQuestion) {
        const questions = [];
        for (let i = 0; i < questionCounts.mcqCount; i++) {
            questions.push({
                type: question_entity_1.QuestionType.MULTIPLE_CHOICE,
                marks: marksPerQuestion.mcq,
                text: `MCQ ${i + 1} (${marksPerQuestion.mcq} mark): Write a suitable question for the syllabus topic.`,
                options: ['Option A', 'Option B', 'Option C', 'Option D'],
                answer: 'Option A',
                difficulty: question_entity_1.DifficultyLevel.MEDIUM,
            });
        }
        for (let i = 0; i < questionCounts.shortCount; i++) {
            questions.push({
                type: question_entity_1.QuestionType.SHORT_ANSWER,
                marks: marksPerQuestion.short,
                text: `Short Q${i + 1} (${marksPerQuestion.short} marks): Provide a brief explanation on a key concept from the syllabus.`,
                difficulty: question_entity_1.DifficultyLevel.MEDIUM,
            });
        }
        for (let i = 0; i < questionCounts.longCount; i++) {
            questions.push({
                type: question_entity_1.QuestionType.LONG_ANSWER,
                marks: marksPerQuestion.long,
                text: `Long Q${i + 1} (${marksPerQuestion.long} marks): Discuss in detail with examples from the syllabus.`,
                difficulty: question_entity_1.DifficultyLevel.MEDIUM,
            });
        }
        return questions;
    }
    async regenerateQuestion(question) {
        const prompt = `Regenerate a ${question.type} question worth ${question.marks} marks. Return JSON {"text":"...","options":[...],"answer":"..."}`;
        let text = '';
        let options;
        let answer;
        try {
            const resp = await this.ollama(prompt);
            const start = resp.indexOf('{');
            const end = resp.lastIndexOf('}') + 1;
            const json = JSON.parse(resp.slice(start, end));
            text = String(json.text || 'Regenerated question');
            if (Array.isArray(json.options))
                options = json.options;
            if (json.answer)
                answer = String(json.answer);
        }
        catch {
            text = 'Regenerated question: Write a detailed answer.';
        }
        question.questionText = text || question.questionText;
        if (question.type === question_entity_1.QuestionType.MULTIPLE_CHOICE && options)
            question.options = options;
        if (answer)
            question.correctAnswer = answer;
        return this.questionRepo.save(question);
    }
};
exports.QuestionGenerationService = QuestionGenerationService;
exports.QuestionGenerationService = QuestionGenerationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(exam_entity_1.Exam)),
    __param(1, (0, typeorm_1.InjectRepository)(question_entity_1.Question)),
    __param(2, (0, typeorm_1.InjectRepository)(material_entity_1.Material)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        chroma_service_1.ChromaService])
], QuestionGenerationService);
//# sourceMappingURL=question-generation.service.js.map