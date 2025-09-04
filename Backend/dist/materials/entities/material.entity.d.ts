import { User } from '../../users/entities/user.entity';
export declare enum MaterialType {
    STUDY = "study",
    ANSWER = "answer"
}
export declare class Material {
    id: string;
    type: MaterialType;
    teacherId: string;
    teacher: User;
    class: string;
    subject: string;
    pdfCloudUrl: string;
    vectorDbCollectionId: string;
    originalName: string;
    mimeType: string;
    size: string;
    createdAt: Date;
    updatedAt: Date;
}
