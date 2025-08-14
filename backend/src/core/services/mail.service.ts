import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateRequestDto } from '../../modules/requests/dto/create-request.dto';
import { PrismaRelationsService } from 'src/core/services/prisma-relations.service';
import { GetRequestDataInterface } from 'src/modules/requests/interfaces/request-data.interface';
import { Role } from 'src/common/enums/role.enum';
import { GetDetailsOfReservation } from '../queues/mail-queue/models/get-details.model';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService, private prismaRelations: PrismaRelationsService) {}

  async sendMailNewRequest(emailToSend: string, role: string, request: GetRequestDataInterface){
    try {
      const gammaName = await this.prismaRelations.getGammaName(request.gamma_id);
      const transmissionName = await this.prismaRelations.getTransmissionName(request.transmission_id);
      const entryCityName = await this.prismaRelations.getCity(request.id_entry_city);
      const devolutionCityName = await this.prismaRelations.getCity(request.id_devolution_city);
      const devolutionDate = new Date(request.devolution_date);
      const formattedDevolutionDate = devolutionDate.toISOString().split('T')[0];
      const entryDate = new Date(request.entry_date);
      const formattedEntryDate = entryDate.toISOString().split('T')[0];

      if(role === Role.ADMIN){
        await this.mailerService.sendMail({
          to: emailToSend,
          subject: 'Se ha creado una nueva solicitud de Alquiler',
          template: './request-admin',
          context: {
            name: request.name || 'Nombre no proporcionado',
            phone: request.phone || 'Número no proporcionado',
            email: request.email || 'Email no proporcionado',
            comments: request.comments || 'Sin comentarios',
            gamma: gammaName || 'Gama no disponible',
            transmission: transmissionName || 'Transmisión no disponible',
            entryCity: entryCityName || 'Ciudad de entrada no disponible',
            receiveAtTheAirport: request.receive_at_airport ? 'Sí' : 'No',
            entryDateTime: (formattedEntryDate || '') + ' ' + (request.entry_time || ''),
            devolutionCity: devolutionCityName || 'Ciudad de devolución no disponible',
            returnsAtTheAirport: request.returns_at_airport ? 'Sí' : 'No',
            devolutionDateTime: (formattedDevolutionDate || '') + ' ' + (request.devolution_time || ''),
          },
        });
      }else if(role === Role.PROVIDER){
        await this.mailerService.sendMail({
          to: emailToSend,
          subject: 'Se ha creado una nueva solicitud de Alquiler',
          template: './request-provider',
          context: {
            comments: request.comments || 'Sin comentarios',
            gamma: gammaName || 'Gama no disponible',
            transmission: transmissionName || 'Transmisión no disponible',
            entryCity: entryCityName || 'Ciudad de entrada no disponible',
            receiveAtTheAirport: request.receive_at_airport ? 'Sí' : 'No',
            entryDateTime: (formattedEntryDate || '') + ' ' + (request.entry_time || ''),
            devolutionCity: devolutionCityName || 'Ciudad de devolución no disponible',
            returnsAtTheAirport: request.returns_at_airport ? 'Sí' : 'No',
            devolutionDateTime: (formattedDevolutionDate || '') + ' ' + (request.devolution_time || ''),
            requestId: request.id
          },
        });
      }
      console.log('Correo enviado con éxito');
    } catch (error) {
      console.error('Error al enviar el correo:', error);
    }
  }

  async sendMailConfirmationReservation(emailToSend: string, data: GetDetailsOfReservation){
    try{
      await this.mailerService.sendMail({
        to: emailToSend,
        subject: 'Confirmación de reserva',
        template: './details-of-request',
        context: data,
      })
    }catch(error){
      console.error('Error al enviar email.', error)
    }
  }

  async sendMail(options: any){
    try {
      await this.mailerService.sendMail(options);
      console.log('Correo enviado con éxito');
    } catch (error) {
      console.error('Error al enviar el correo:', error);
    }
  }
}
