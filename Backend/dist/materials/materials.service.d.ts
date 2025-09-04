import { Repository } from 'typeorm';
import { Material } from './entities/material.entity';
import { Class } from '../classes/entities/class.entity';
import { Subject } from '../subjects/entities/subject.entity';
export declare class MaterialsService {
    private readonly materialsRepo;
    private readonly classesRepo;
    private readonly subjectsRepo;
    constructor(materialsRepo: Repository<Material>, classesRepo: Repository<Class>, subjectsRepo: Repository<Subject>);
    createStudy(params: {
        teacherId: string;
        class: string;
        subject: string;
        pdfCloudUrl: string;
        vectorDbCollectionId: string;
        originalName: string;
        mimeType?: string;
        size?: number;
    }): Promise<Material>;
    createAnswer(params: {
        teacherId: string;
        class: string;
        subject: string;
        pdfCloudUrl: string;
        vectorDbCollectionId?: string;
        originalName: string;
        mimeType?: string;
        size?: number;
    }): Promise<Material>;
    listStudy(params: {
        class?: string;
        subject?: string;
        q?: string;
        page: number;
        limit: number;
    }): Promise<{
        items: any[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
}
