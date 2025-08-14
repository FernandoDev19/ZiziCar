import { Module } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { WebhooksController } from './webhooks.controller';
import { HttpModule } from '@nestjs/axios';
import { S3Service } from 'src/core/services/s3.service';

@Module({
  imports: [
    HttpModule
  ],
  controllers: [WebhooksController],
  providers: [WebhooksService, S3Service],
})
export class WebhooksModule {}
