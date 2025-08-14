import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class MessageQueueService {
  constructor(
    @InjectQueue('message-queue') private readonly messageQueue: Queue,
  ) {}

  async queueTemplateRequestForProvider(data: Object) {
    await this.messageQueue.add('send-template-request-for-provider', {
      data,
    });
  }

  async queueTemplateRequestForAdmin(data: Object) {
    await this.messageQueue.add('send-template-request-for-admin', {
      data,
    });
  }

  async queueSendReservationAlert(data: Object) {
    await this.messageQueue.add('reservation-alert-queue', {
      data,
    });
  }

  async queueSendNewsMessages(data: Object) {
    await this.messageQueue.add('send-news', {
      data,
    });
  }

}
