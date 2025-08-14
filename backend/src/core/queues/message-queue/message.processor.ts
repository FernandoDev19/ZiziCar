import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MetaService } from '../../services/meta.service';

@Processor('message-queue')
export class MessageProcessor {
  constructor(private readonly metaService: MetaService) {}

  @Process('send-template-request-for-provider')
  async handleSendMessage(job: Job) {
    const { data } = job.data;
    let index = 0;
    for(let phone of data.phones){
      try {
        const result = await this.metaService.sendWhatsappMessageTemplateRequestForProvider(phone, data.providerName[index], data);
        console.log(`Message sent to ${phone}`, result);
      } catch (error) {
        console.error(`Failed to send message to ${phone}`, error);
      }finally {
        index++;
      }
    }
  }

  @Process('send-template-request-for-admin')
  async handleSendMessageForAdmins(job: Job) {
    const { data } = job.data;
    let index = 0;
    for(let phone of data.phones){
      try {
        const result = await this.metaService.sendWhatsappMessageTemplateRequestForAdmins(phone, data.providerName[index], data);
        console.log(`Message sent to ${phone}`, result);
      } catch (error) {
        console.error(`Failed to send message to ${phone}`, error);
      }finally {
        index++;
      }
    }
  }

  @Process('reservation-alert-queue')
  async sendReservationAlert(job: Job){
    const { data } = job.data;
    let index = 0;
    for(let phone of data.admin_phones){
      try{
        const result = await this.metaService.sendReservatonAlertToAdmins(phone, data.admin_names[index], data)
        console.log(`Alert sent to ${data.admin_names[index]}`, result);
      }catch (error) {
        console.error('Failed to send message to ' + data.admin_names[index] + ' ' + error);
      }finally {
        index++;
      }
    }
  }

  @Process('send-news')
  async sendNewsMessages(job: Job){
    const { data } = job.data;
    console.log(data.phones)
    let index = 0;
    for(let phone of data.phones){
      try{
        const result = await this.metaService.sendNewsMessages(phone);
        console.log('Send new to '+ phone);
      }catch (error) {
        console.error('Failed to send message to ' + phone + ' ' + error);
      }finally {
        index++;
      }
    }
  }

}
