import { BadRequestException, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { ReservationConfirmationData } from 'src/core/interfaces/reservation-confirmation-data.interface';
import { MailQueueService } from 'src/core/queues/mail-queue/mail-queue.service';
import { MetaService } from 'src/core/services/meta.service';
import { PrismaService } from 'src/prisma.service';

const remitentesCache = new Map<string, boolean>();

@Injectable()
export class WebhooksService {
  private readonly token = 'w3bh00kZ1Z1C4R@2024';

  constructor(
    private metaService: MetaService,
    private prismaService: PrismaService,
    private mailQueueService: MailQueueService
  ) {
    setInterval(
      () => {
        remitentesCache.clear();
        console.log('Cache de remitentes limpiada');
      },
      24 * 60 * 60 * 1000,
    );
  }

  webhook(query: any): string {
    console.log('Query completa:', query);

    const hubChallenge = query['hub.challenge'];
    const hubVerifyToken = query['hub.verify_token'];

    // Verificar si los parámetros están presentes
    if (!hubChallenge || !hubVerifyToken) {
      throw new BadRequestException('Faltan parámetros requeridos.');
    }

    // Si el token que generamos es el mismo que nos envía Facebook, retornamos el reto para validar
    if (this.token === hubVerifyToken) {
      return hubChallenge;
    }

    throw new BadRequestException('Token de verificación incorrecto.');
  }

  recibe(req: Request, res: Response) {
    // Enviar 200 OK inmediatamente para evitar reintentos de WhatsApp
    res.sendStatus(200);

    const responseData = req.body; // El cuerpo ya estará disponible aquí

    // Si no hay datos, terminamos la ejecución
    if (!responseData) {
      return;
    }

    try {
      // Desglosar el contenido de "entry" y "changes"
      if (responseData.entry && Array.isArray(responseData.entry)) {
        responseData.entry.forEach((entry: any) => {
          console.log('ID de la entrada:', entry.id);

          if (entry.changes && Array.isArray(entry.changes)) {
            entry.changes.forEach((change: any) => {
              console.log('Cambio detectado:', JSON.stringify(change, null, 2));

              // Procesar el mensaje recibido
              const value = change.value;
              if (value && value.messages && Array.isArray(value.messages)) {
                value.messages.forEach(async (message: any) => {
                  const sender = message.from;
                  let clientName = '';
                  if (Array.isArray(value.contacts)) {
                    value.contacts.forEach((contact: any) => {
                      clientName = contact.profile.name || '';
                      console.log(contact.profile);
                    });
                  }

                  if (message.type === 'text') {
                    this.typeText(message, clientName, sender);
                  } else if (message.type === 'button' && message.button) {
                    await this.typeButton(message, sender);
                  }else if (message.type === 'image') {
                   this.typeImage(message, clientName, sender);
                  } else if (message.type === 'video') {
                   this.typeVideo(message, clientName, sender);
                  } else if (message.type === 'audio') {
                    this.typeAudio(message, clientName, sender);
                  }else if (message.type === 'document') {
                   this.typeDocument(message, clientName, sender);
                  }
                });
              }
            });
          }
        });
      }
    } catch (error) {
      console.error('Error al procesar el JSON:', error);
    }
  }

  typeText(message: any, clientName: string, sender: any){
    let messageForAdmins = '';
    if (!remitentesCache.has(sender)) {
      const messageForClient =
        'Hola!\nRecuerda que este número es solo para enviar y recibir cotizaciones.\n\nSi necesitas comunicarte con servicio al cliente llama o escribe a esta linea:\n+573160547464\n\nSaludos!\nZiziCar';

      this.enviarRespuesta(messageForClient, sender);

      // Marcar al remitente como ya notificado
      remitentesCache.set(sender, true);
    }
    
      // Obtener el texto del mensaje y el remitente
      const text = message.text.body;
      messageForAdmins = `Mensaje de ${clientName}:\nTelefono: ${sender}\nMensaje: ${text}`;

      // Aquí puedes procesar el mensaje o enviar una respuesta
      this.enviarRespuesta(messageForAdmins, '+573005442580');
      this.enviarRespuesta(messageForAdmins, '+573015014223');
      this.enviarRespuesta(messageForAdmins, '+573002273340');
      this.enviarRespuesta(messageForAdmins, '+573007118020');
  }

  async typeButton(message: any, sender: any){
    const { text, payload } = message.button;
    if (text === 'Confirmar reserva') {
      const customer = await this.prismaService.zIC_ADM_CUSTOMERS.findFirst({
        where: {
          phone: payload
        },
        include: {
          ZIC_ADM_QUOTES: {
            include: {
              ZIC_ADM_PROVIDERS: {
                include: {
                  ZIC_ADM_GLOBAL_CITIES: {
                    select: {
                      name: true
                    }
                  }
                }
              },
              ZIC_ADM_TRANSMISSION: {
                select: {
                  name: true
                }
              }
            }
          },
          ZIC_REQ_REQUESTS: {
            include: {
              ZIC_REQ_CITIES_ZIC_REQ_REQUESTS_id_entry_cityToZIC_REQ_CITIES: {
                select: {
                  name: true
                }
              },
              ZIC_REQ_CITIES_ZIC_REQ_REQUESTS_id_devolution_cityToZIC_REQ_CITIES: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      });

      if (!customer) {
        console.error('No se encontró el cliente con el número de teléfono:', payload);
        this.enviarRespuesta('No se encontró información para confirmar la reserva.', sender);
        return;
      }

      if (customer.confirmed_payment === true) {
        this.enviarRespuesta('La reserva anteriormente ha sido confirmada.', sender);
        return;
      }

      const provider = customer?.ZIC_ADM_QUOTES?.ZIC_ADM_PROVIDERS;
      const quote = customer?.ZIC_ADM_QUOTES;
      const request = customer?.ZIC_REQ_REQUESTS;
      
      const dataFormatted: ReservationConfirmationData = {
        vehicle: quote?.brand,
        transmission: quote?.ZIC_ADM_TRANSMISSION?.name,
        model: quote?.model,
        entryCity: request.ZIC_REQ_CITIES_ZIC_REQ_REQUESTS_id_entry_cityToZIC_REQ_CITIES.name,
        entryDateAndTime: await this.formatDate(request?.entry_date?.toString()) || 'No disponible' + ' a las ' + request?.entry_time || '',
        days: this.getDaysOfRent(request.entry_date.toString(), request.devolution_date.toString()),
        totalOfRent: this.getDaysOfRent(request.entry_date.toString(), request.devolution_date.toString()),
        percentageOfRent: quote.percentage_of_total_value || '0%',
        percentageInValues: quote.percentage_in_values,
        agency: provider?.name || 'No disponible',
        phones: [customer.phone, provider?.phone || ''],
        contact: [customer.credit_card_holder_name, provider?.name || ''],
        city: [customer.city || 'No disponible', provider.ZIC_ADM_GLOBAL_CITIES.name || 'No disponible'],
        address: [customer.address, provider?.address || 'No disponible'],
        ids: [customer.id, customer.request_id, customer.quote_id]
      }
      
      await this.metaService.sendReservationConfirmation(customer.phone, dataFormatted.phones[1], dataFormatted.contact[1], dataFormatted.city[1], dataFormatted.address[1], dataFormatted);
      if(provider.phone){
        await this.metaService.sendReservationConfirmation(provider.phone, dataFormatted.phones[0], dataFormatted.contact[0], dataFormatted.city[0], dataFormatted.address[0], dataFormatted);
      }
      
      const sendEmails = await this.sendEmailsReservationConfirmation(customer, provider, quote, request);
      
      const customerToUpdate = await this.prismaService.zIC_ADM_CUSTOMERS.update({
        where: {
          id: customer.id
        },
        data: {
          confirmed_payment: true
        }
      });

      console.log('Payment Confirmed.', customerToUpdate);
    }else if(text === 'Agotado'){
      const providerRequest = await this.prismaService.zIC_ADM_REQUEST_PROVIDER.findFirst({
        where: {
          id: payload
        },
        include: {
          ZIC_REQ_REQUESTS: {
            select: {
              phone: true
            }
          },
          ZIC_ADM_PROVIDERS: {
            include: {
              ZIC_ADM_COUNTRIES: {
                select: {
                  name: true
                }
              },
              ZIC_ADM_GLOBAL_CITIES: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      })
      const answerCreate = await this.prismaService.zIC_REQ_ANSWERS.create({
        data: {
          request_id: providerRequest.request_id,
          renter_id: providerRequest.provider_id,
          answer_type: 'Agotado'
        }
      });

      const result = await this.metaService.sendExhaustedAnswer({
        phone_client: providerRequest.ZIC_REQ_REQUESTS?.phone,
        provider_name: providerRequest.ZIC_ADM_PROVIDERS?.name,
        country: providerRequest.ZIC_ADM_PROVIDERS?.ZIC_ADM_COUNTRIES?.name,
        city: providerRequest.ZIC_ADM_PROVIDERS?.ZIC_ADM_GLOBAL_CITIES?.name
      });

      console.log(result);

      await this.enviarRespuesta('Muchisimas gracias por responder.', providerRequest.ZIC_ADM_PROVIDERS?.phone);
    }else{
      console.error('Payload no encontrado en el mensaje del botón');
    }
  }

  private async sendEmailsReservationConfirmation(customer: any, provider: any, quote: any, request: any){
    const entryDate = request?.entry_date ? await this.formatDate(request.entry_date.toString()) : 'No disponible';
    const devolutionDate = request?.devolution_date ? await this.formatDate(request.devolution_date.toString()) : 'No disponible';
    const totalValueFormatted = await this.formatMoney(quote?.total_value || 0);
    const outstandingBalance = await this.formatMoney((quote?.total_value || 0) - (quote?.percentage_in_values || 0));

    const dataForEmail = {
      emails: [customer.email || '', provider.email || ''],
      mailData: {
        entryCity: request.ZIC_REQ_CITIES_ZIC_REQ_REQUESTS_id_entry_cityToZIC_REQ_CITIES.name || 'No disponible',
        devolutionCity: request.ZIC_REQ_CITIES_ZIC_REQ_REQUESTS_id_devolution_cityToZIC_REQ_CITIES.name || 'No disponible',
        entryDateTime: entryDate + ' ' + request.entry_time,
        devolutionDateTime: devolutionDate + ' ' + request.devolution_time,
        daysOfRent: await this.getDaysOfRent(request.entry_date.toString(), request.devolution_date.toString()),
        createdAt: await this.formatDate(request.created_at.toString()),
        vehicle: quote.brand,
        transmission: quote.ZIC_ADM_TRANSMISSION.name || 'No disponible',
        model: quote.model,
        totalValue: totalValueFormatted,
        percentage_of_total_value: quote.percentage_of_total_value,
        percentage_in_values: await this.formatMoney(quote.percentage_in_values),
        outstandingBalance: outstandingBalance,
        providerName: provider?.name,
        providerEmail: provider?.email,
        providerPhone: provider?.phone,
        providerCity: provider?.ZIC_ADM_GLOBAL_CITIES?.name || 'No disponible',
        providerAddress: provider?.address,
        customerName: customer.credit_card_holder_name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        customerIdentification: customer.identification,
        customerCity: customer.city,
        customerAddress: customer.address || 'No disponible',
      }
    };
    await this.mailQueueService.sendMailTemplateConfirmationReservation(dataForEmail);
  }

  typeImage(message: any, clientName: string, sender: any){
    let messageForAdmins = '';
    const imageId = message.image.id;
    const caption = message.image.caption || '';
    messageForAdmins =
      'Mensaje de: ' +
      clientName +
      '\nTelefono: ' +
      sender +
      '\nMensaje: ' +
      caption;
    if (imageId) {
      this.metaService.sendWhatsAppMessage(
        '+573005442580',
        messageForAdmins,
        'image',
        imageId,
      );
      this.metaService.sendWhatsAppMessage(
        '+573015014223',
        messageForAdmins,
        'image',
        imageId,
      );
      this.metaService.sendWhatsAppMessage(
        '+573002273340',
        messageForAdmins,
        'image',
        imageId,
      );
      this.metaService.sendWhatsAppMessage(
        '+573007118020',
        messageForAdmins,
        'image',
        imageId,
      );
    }
  }

  typeVideo(message: any, clientName: string, sender: any){
    let messageForAdmins = '';
    const videoId = message.video.id;
    const caption = message.video.caption || '';
    messageForAdmins =
      'Mensaje de: ' +
      clientName +
      '\nTelefono: ' +
      sender +
      '\nMensaje: ' +
      caption;

    if (videoId) {
      this.metaService.sendWhatsAppMessage(
        '+573005442580',
        messageForAdmins,
        'video',
        videoId,
      );
      this.metaService.sendWhatsAppMessage(
        '+573015014223',
        messageForAdmins,
        'video',
        videoId,
      );
      this.metaService.sendWhatsAppMessage(
        '+573002273340',
        messageForAdmins,
        'video',
        videoId,
      );
      this.metaService.sendWhatsAppMessage(
        '+573007118020',
        messageForAdmins,
        'video',
        videoId,
      );
    }
  }

  typeAudio(message: any, clientName: string, sender: any){
    let messageForAdmins = '';
    const audioId = message.audio.id;
    messageForAdmins =
      'Mensaje de: ' + clientName + '\nTelefono: ' + sender;

    if (audioId) {
      this.metaService.sendWhatsAppMessage(
        '+573005442580',
        messageForAdmins,
        'text',
      );
      this.metaService.sendWhatsAppMessage(
        '+573005442580',
        '',
        'audio',
        audioId,
      );
      this.metaService.sendWhatsAppMessage(
        '+573015014223',
        messageForAdmins,
        'text',
      );
      this.metaService.sendWhatsAppMessage(
        '+573015014223',
        '',
        'audio',
        audioId,
      );
      this.metaService.sendWhatsAppMessage(
        '+573002273340',
        messageForAdmins,
        'text',
      );
      this.metaService.sendWhatsAppMessage(
        '+573002273340',
        '',
        'audio',
        audioId,
      );
      this.metaService.sendWhatsAppMessage(
        '+573007118020',
        messageForAdmins,
        'text',
      );
      this.metaService.sendWhatsAppMessage(
        '+573007118020',
        '',
        'audio',
        audioId,
      );
    }
  }

  typeDocument(message: any, clientName: string, sender: any){
    let messageForAdmins = '';
    const documentId = message.document.id;
    const caption = message.document.caption || '';
    messageForAdmins =
      'Mensaje de: ' + clientName + '\nTelefono: ' + sender;

    if (documentId) {
      this.metaService.sendWhatsAppMessage(
        '+573005442580',
        messageForAdmins,
        'text',
      );
      this.metaService.sendWhatsAppMessage(
        '+573005442580',
        caption,
        'document',
        documentId,
      );
      this.metaService.sendWhatsAppMessage(
        '+573015014223',
        messageForAdmins,
        'text',
      );
      this.metaService.sendWhatsAppMessage(
        '+573015014223',
        caption,
        'document',
        documentId,
      );
      this.metaService.sendWhatsAppMessage(
        '+573002273340',
        messageForAdmins,
        'text',
      );
      this.metaService.sendWhatsAppMessage(
        '+573002273340',
        caption,
        'document',
        documentId,
      );
      this.metaService.sendWhatsAppMessage(
        '+573007118020',
        messageForAdmins,
        'text',
      );
      this.metaService.sendWhatsAppMessage(
        '+573007118020',
        caption,
        'document',
        documentId,
      );
    }
  }

  async enviarRespuesta(mensaje: string, remitente: string): Promise<void> {
    try {
      await this.metaService.sendWhatsAppMessage(remitente, mensaje, 'text');

      console.log('Mensaje de bienvenida enviado correctamente.');
    } catch (error) {
      console.error('Error al enviar el mensaje de bienvenida:', error);
    }
  }

  private async formatDate(date: string) {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  private getDaysOfRent(entryDate: string, devolutionDate: string) {
    const startDate = new Date(entryDate);
    const endDate = new Date(devolutionDate);
    const differenceInTime = endDate.getTime() - startDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return Math.ceil(differenceInDays);
  }
  
  private async formatMoney(
    amount: number,
    currency: string = 'COP',
    locale: string = 'es-ES',
  ) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
}
