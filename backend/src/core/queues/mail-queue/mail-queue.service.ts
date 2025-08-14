import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class MailQueueService {
    constructor(@InjectQueue('mail-queue') private readonly mailQueue: Queue){}

    async sendMailTemplateConfirmationReservation(data: Object){
        await this.mailQueue.add('send-mail-template-confirmation-reservation', {
            data
        })
    }

    async sendMailNewRequest(data: Object){
        await this.mailQueue.add('send-mail-new-request', {
            data
        });
    }
}
