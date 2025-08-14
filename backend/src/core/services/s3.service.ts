import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
    private s3: S3Client;
    private readonly BUCKET_NAME: string;

    constructor(private configService: ConfigService) {
        this.s3 = new S3Client({
            region: this.configService.get<string>('AWS_REGION'),
            credentials: {
                accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
            },
        });
        this.BUCKET_NAME = this.configService.get<string>('AWS_BUCKET_NAME');
    }

    async uploadFile(buffer: Buffer, fileName: string, mimetype: string): Promise<string> {
        const params = {
            Bucket: this.BUCKET_NAME,
            Key: fileName,
            Body: buffer,
            ContentType: mimetype,
        };

        try {
            await this.s3.send(new PutObjectCommand(params));
            return `https://${this.BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
        } catch (err) {
            throw new Error(`Error uploading file: ${err.message}`);
        }
    }
}
