export declare class FirebaseStorageService {
    private initialized;
    private init;
    uploadBuffer(path: string, buffer: Buffer, contentType?: string): Promise<string>;
}
