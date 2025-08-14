import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailService } from 'src/core/services/mail.service';
import { finished } from 'stream';

@Processor('message-queue')
export class MailProcessor {
  constructor(private readonly mailService: MailService) {}

  @Process('send-mail-template-confirmation-reservation')
  async sendMailsConfirmationReservation(job: Job) {
    const { data } = job.data;
    let index = 0;
    for(let email of data.emails){
      try {
        const result = await this.mailService.sendMailConfirmationReservation(email, data.mailData);
        console.log(`Confirmation sent to ${email}`, result);
      } catch (error) {
        console.error(`Failed to send Confirmation to ${email}`, error);
      }finally {
        index++;
      }
    }
  }

  @Process('send-mail-new-request')
  async sendMailsNewRequest(job: Job){
    const { data } = job.data;
    let index = 0;
    for(let email of data.emails){
        try{
            const result = await this.mailService.sendMailNewRequest(
                email,
                data.roles[index],
                data.request,
              );
              console.log('New Request sent to', email, result);
        }catch(error){
            console.error(`Failed to send new Request  to ${email}`, error);
        }finally{
            index++;
        }
    }
  }

}
