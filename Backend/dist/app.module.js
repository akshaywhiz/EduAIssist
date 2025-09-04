"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const classes_module_1 = require("./classes/classes.module");
const subjects_module_1 = require("./subjects/subjects.module");
const exams_module_1 = require("./exams/exams.module");
const questions_module_1 = require("./questions/questions.module");
const evaluations_module_1 = require("./evaluations/evaluations.module");
const reports_module_1 = require("./reports/reports.module");
const seed_service_1 = require("./seeds/seed.service");
const user_entity_1 = require("./users/entities/user.entity");
const class_entity_1 = require("./classes/entities/class.entity");
const subject_entity_1 = require("./subjects/entities/subject.entity");
const exam_entity_1 = require("./exams/entities/exam.entity");
const question_entity_1 = require("./questions/entities/question.entity");
const student_answer_entity_1 = require("./evaluations/entities/student-answer.entity");
const evaluation_entity_1 = require("./evaluations/entities/evaluation.entity");
const report_entity_1 = require("./reports/entities/report.entity");
const material_entity_1 = require("./materials/entities/material.entity");
const materials_module_1 = require("./materials/materials.module");
const teachers_module_1 = require("./teachers/teachers.module");
const teachers_entity_1 = require("./teachers/entities/teachers.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: process.env.DB_HOST || 'localhost',
                port: Number(process.env.DB_PORT || 3306),
                username: process.env.DB_USERNAME || 'root',
                password: (process.env.DB_PASSWORD ?? 'password'),
                database: process.env.DB_DATABASE || 'eduaissist',
                entities: [
                    user_entity_1.User,
                    class_entity_1.Class,
                    subject_entity_1.Subject,
                    exam_entity_1.Exam,
                    question_entity_1.Question,
                    student_answer_entity_1.StudentAnswer,
                    evaluation_entity_1.Evaluation,
                    report_entity_1.Report,
                    material_entity_1.Material,
                    teachers_entity_1.Teacher
                ],
                synchronize: (process.env.DB_SYNC === 'true'),
                logging: false,
            }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            classes_module_1.ClassesModule,
            subjects_module_1.SubjectsModule,
            exams_module_1.ExamsModule,
            questions_module_1.QuestionsModule,
            evaluations_module_1.EvaluationsModule,
            reports_module_1.ReportsModule,
            materials_module_1.MaterialsModule,
            teachers_module_1.TeachersModule
        ],
        providers: [seed_service_1.SeedService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map