import { Global, Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { MailService } from './services/mail.service';
import { PrismaRelationsService } from './services/prisma-relations.service';
import { MetaService } from './services/meta.service';
import { HttpModule } from '@nestjs/axios';
import { MessageQueueService } from './queues/message-queue/message-queue.service';
import { MessageProcessor } from './queues/message-queue/message.processor';
import { BullModule } from '@nestjs/bull';
import { S3Service } from './services/s3.service';
import { MailQueueService } from './queues/mail-queue/mail-queue.service';
import { MailProcessor } from './queues/mail-queue/mail.processor';

@Global()
@Module({
  imports: [
    HttpModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'message-queue',
    },
    {
      name: 'mail-queue',
    }),
  ],
  providers: [
    PrismaService,
    MailService,
    PrismaRelationsService,
    MetaService,
    MessageQueueService,
    MessageProcessor,
    MailQueueService,
    MailProcessor,
    S3Service,
    MailQueueService
  ],
  exports: [
    PrismaService,
    MailService,
    PrismaRelationsService,
    MetaService,
    MessageQueueService,
    MessageProcessor,
    MailQueueService,
    MailProcessor
  ],
})
export class GlobalModule {}
