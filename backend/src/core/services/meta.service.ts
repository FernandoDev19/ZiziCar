import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QuoteData } from 'src/modules/quotes/interfaces/quote-data.interface';
import { ReservationConfirmationData } from '../interfaces/reservation-confirmation-data.interface';
import { RequestData } from 'src/modules/requests/interfaces/request-data.interface';

@Injectable()
export class MetaService {
  private url: string;
  private accessToken: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    @InjectQueue('message-queue') private readonly whatsappQueue: Queue
  ) {
    this.url = this.configService.get<string>('URL_META_WSP');
    this.accessToken = this.configService.get<string>('META_ACCESS_TOKEN');
  }

  async getProfileData(userId: string): Promise<AxiosResponse> {
    const url = `${this.url}/${userId}`;
    const params = {
      access_token: this.accessToken,
    };

    const response = await firstValueFrom(
      this.httpService.get(url, { params }),
    );
    return response.data;
  }

  async sendWhatsAppMessage(phone: string, message: string, type: 'text' | 'image' | 'video' | 'audio' | 'document', mediaId?: string): Promise<AxiosResponse> {
    const url = this.url;
    const headers = {
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };

    let messageData = {};

    if(type === 'text'){
      messageData = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: phone,
        type: type,
        text: {
          preview_url: false,
          body: message
        }
      }; 
    }else if(type === 'image'){
      messageData = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: phone,
        type: type,
        image: {
          id: mediaId,
          caption: message || ''
        }
      }; 
    }else if(type === 'video'){
      messageData = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: phone,
        type: type,
        video: {
          id: mediaId,
          caption: message || ''
        }
      }; 
    }else if(type === 'audio'){
      messageData = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: phone,
        type: type,
        audio: {
          id: mediaId
        }
      };
    }else if(type === 'document') {
      messageData = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: phone,
        type: type,
        document: {
          id: mediaId,
          caption: message || ''
        }
      };
    }

    const response = await firstValueFrom(
      this.httpService.post(url, messageData, { headers }),
    );
    return response.data;
  }

  async sendWhatsappMessageTemplateWelcomeToZizicar(
    phone: string,
    customerName: string,
  ) {
    const headers = {
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };

    const messageData = {
      messaging_product: 'whatsapp',
      to: phone,
      type: 'template',
      template: {
        name: 'welcome',
        language: {
          code: 'es',
        },
        components: [
          {
            type: 'header',
            parameters: [
              {
                type: 'image',
                image: {
                  link: 'https://imagenes-publicas-zzcr-s3.s3.amazonaws.com/zizicar-header.jpg',
                },
              },
            ],
          },
          {
            type: 'body',
            parameters: [
              {
                type: 'text',
                text: customerName,
              },
            ],
          },
        ],
      },
    };

    const response = await firstValueFrom(
      this.httpService.post(this.url, messageData, { headers }),
    );
    return response.data;
  }

  async sendWhatsappMessageTemplateRequestForProvider(
    phone: string,
    providerName: string,
    data: RequestData,
  ) { 
    const url = this.url;
    const headers = {
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };

    const messageData = {
      messaging_product: 'whatsapp',
      to: phone,
      type: 'template',
      template: {
        name: 'solicitud_de_cliente',
        language: {
          code: 'es',
        },
        components: [
          {
            type: 'body',
            parameters: [
              {
                type: 'text',
                text: providerName,
              },
              {
                type: 'text',
                text: data.gamma,
              },
              {
                type: 'text',
                text: data.transmission,
              },
              {
                type: 'text',
                text: data.daysOfRent
              },
              {
                type: 'text',
                text: data.entryCity + data.receiveAtAirport,
              },
              {
                type: 'text',
                text: data.entryDate,
              },
              {
                type: 'text',
                text: data.entryTime,
              },
              {
                type: 'text',
                text: data.devolutionCity + data.returnsAtAirport,
              },
              {
                type: 'text',
                text: data.devolutionDate,
              },
              {
                type: 'text',
                text: data.devolutionTime,
              },
              {
                type: 'text',
                text: data.comments || 'No hay comentarios',
              },
            ],
          },
          {
            type: 'button',
            sub_type: 'url',
            index: '0',
            parameters: [
              {
                type: 'text',
                text: data.id,
              },
            ],
          },
          {
            type: 'button',
            sub_type: 'quick_reply',
            index: '1',
            parameters: [
              {
                type: 'payload',
                payload: data.requestToProvider.find(obj => obj[phone])?.[phone],
              },
            ],
          },
          {
            type: 'button',
            sub_type: 'quick_reply',
            index: '2',
            parameters: [
              {
                type: 'payload',
                payload: data.id,
              },
            ],
          },
        ],
      },
    };

    const response = await firstValueFrom(
      this.httpService.post(url, messageData, { headers }),
    );
    return response.data;
  }

  async sendWhatsappMessageTemplateRequestForAdmins(
    phone: string,
    providerName: string,
    data: RequestData,
  ) {
    const url = this.url;
    const headers = {
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };

    const messageData = {
      messaging_product: 'whatsapp',
      to: phone,
      type: 'template',
      template: {
        name: 'solicitud_de_cliente',
        language: {
          code: 'es',
        },
        components: [
          {
            type: 'body',
            parameters: [
              {
                type: 'text',
                text: providerName,
              },
              {
                type: 'text',
                text: data.gamma,
              },
              {
                type: 'text',
                text: data.transmission,
              },
              {
                type: 'text',
                text: data.daysOfRent
              },
              {
                type: 'text',
                text: data.entryCity + data.receiveAtAirport,
              },
              {
                type: 'text',
                text: data.entryDate,
              },
              {
                type: 'text',
                text: data.entryTime,
              },
              {
                type: 'text',
                text: data.devolutionCity + data.returnsAtAirport,
              },
              {
                type: 'text',
                text: data.devolutionDate,
              },
              {
                type: 'text',
                text: data.devolutionTime,
              },
              {
                type: 'text',
                text: data.comments || 'No hay comentarios',
              },
            ],
          },
          {
            type: 'button',
            sub_type: 'url',
            index: '0',
            parameters: [
              {
                type: 'text',
                text: data.id,
              },
            ],
          },
          {
            type: 'button',
            sub_type: 'quick_reply',
            index: '1',
            parameters: [
              {
                type: 'payload',
                payload: data.id,
              },
            ],
          },
          {
            type: 'button',
            sub_type: 'quick_reply',
            index: '2',
            parameters: [
              {
                type: 'payload',
                payload: data.id,
              },
            ],
          },
        ],
      },
    };

    const response = await firstValueFrom(
      this.httpService.post(url, messageData, { headers }),
    );
    return response.data;
  }

  async sendWhatsappMessageTemplateThanksForQuoting(providerPhone: string, cotizacionNo: number){
    const url = this.url;
    const headers = {
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };

    const messageData = {
      messaging_product: 'whatsapp',
      to: providerPhone,
      type: 'template',
      template: {
        name: 'gracias_por_cotizar',
        language: {
          code: 'es',
        },
        components: [
          {
            type: 'body',
            parameters: [
              {
                type: 'text',
                text: cotizacionNo,
              },
            ],
          },
        ],
      },
    };

    const response = await firstValueFrom(
      this.httpService.post(url, messageData, { headers }),
    );
    return response.data;
  }

  async sendExhaustedAnswer(data: { phone_client: string; provider_name: string; country: string; city: string; }){
    const headers = {
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };

    const messageData = {
      messaging_product: 'whatsapp',
      to: data.phone_client,
      type: 'template',
      template: {
        name: 'agotado',
        language: {
          code: 'es',
        },
        components: [
          {
            type: 'body',
            parameters: [
              {
                type: 'text',
                text: data.provider_name,
              },
              {
                type: 'text',
                text: data.country,
              },
              {
                type: 'text',
                text: data.city
              }
            ],
          }
        ],
      },
    };

    const response = await firstValueFrom(
      this.httpService.post(this.url, messageData, { headers }),
    );
    console.log('Agotado: ', response.data);

    return response.data;
  }

  async sendReservatonAlertToAdmins(
    phone_admin: string,
    admin_name: string,
    data: {
      provider_name: string;
      provider_phone: string;
      vehicle: string;
      transmission: string;
      model: number;
      total_value: number;
      percentage_of_rent: string;
      percentage_in_values: number;
      outstanding_balance: number;
      customer_name: string;
      phone_client: string;
      identification: string;
      id: string;
    }
  ){

    const headers = {
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };

    const messageData = {
      messaging_product: 'whatsapp',
      to: phone_admin,
      type: 'template',
      template: {
        name: 'customer_alert',
        language: {
          code: 'es',
        },
        components: [
          {
            type: 'body',
            parameters: [
              {
                type: 'text',
                text: admin_name,
              },
              {
                type: 'text',
                text: data.provider_name,
              },
              {
                type: 'text',
                text: data.vehicle,
              },
              {
                type: 'text',
                text: data.transmission,
              },
              {
                type: 'text',
                text: data.model,
              },
              {
                type: 'text',
                text: this.formatMoney(data.total_value),
              },
              {
                type: 'text',
                text: this.formatMoney(data.percentage_in_values),
              },
              {
                type: 'text',
                text: this.formatMoney(data.outstanding_balance),
              },
              {
                type: 'text',
                text: data.customer_name,
              },
              {
                type: 'text',
                text: data.phone_client,
              },
              {
                type: 'text',
                text: data.identification,
              },
              {
                type: 'text',
                text: data.provider_name,
              },
              {
                type: 'text',
                text: data.provider_phone,
              },
            ],
          },
          {
            type: 'button',
            sub_type: 'quick_reply',
            index: '0',
            parameters: [
              {
                type: 'payload',
                payload: data.phone_client,
              },
            ],
          }
        ],
      },
    };

    const response = await firstValueFrom(
      this.httpService.post(this.url, messageData, { headers }),
    );
    console.log('Cotizacion: ', response.data);
    return response.data;
  }

  async sendWhatssapMessageTemplateQuoteRequest(data: QuoteData) {
    const headers = {
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };

    const messageData = {
      messaging_product: 'whatsapp',
      to: data.phone_client,
      type: 'template',
      template: {
        name: 'cotizacion_solicitada_por_cliente',
        language: {
          code: 'es',
        },
        components: [
          {
            type: 'header',
            parameters: [
              {
                type: 'image',
                image: {
                  link: 'https://imagenes-publicas-zzcr-s3.s3.us-east-1.amazonaws.com/img-header-cotizacion.jpeg',
                },
              },
            ],
          },
          {
            type: 'body',
            parameters: [
              {
                type: 'text',
                text: data.quote_number
              },
              {
                type: 'text',
                text: this.formatMoney(data.rent),
              },
              {
                type: 'text',
                text: this.formatMoney(data.overtime),
              },
              {
                type: 'text',
                text: 'Máximo 3 horas extras',
              },
              {
                type: 'text',
                text: this.formatMoney(data.home_delivery),
              },
              {
                type: 'text',
                text: this.formatMoney(data.home_collection),
              },
              {
                type: 'text',
                text: this.formatMoney(data.return_or_collection_different_city),
              },
              {
                type: 'text',
                text: this.formatMoney(data.total_value),
              },
              {
                type: 'text',
                text: data.allowed_payment_method,
              },
              {
                type: 'text',
                text: data.brand,
              },
              {
                type: 'text',
                text: data.transmission,
              },
              {
                type: 'text',
                text: data.model + ' En adelante',
              },
              {
                type: 'text',
                text: data.color,
              },
              {
                type: 'text',
                text: data.plate_end_in,
              },
              {
                type: 'text',
                text: this.formatMoney(data.value_to_block_on_credit_card),
              }, 
              {
                type: 'text',
                text:  ((data.paymentMethodForWarranty.length > 1) ? data.paymentMethodForWarranty[0] + ' o ' + data.paymentMethodForWarranty[1] : data.paymentMethodForWarranty[0])
              },
              {
                type: 'text',
                text: data.available_kilometers,
              },
              {
                type: 'text',
                text: data.percentage_of_total_value,
              },
              {
                type: 'text',
                text: this.formatMoney(data.percentage_in_values),
              },
              {
                type: 'text',
                text: data.comments || 'No hay comentarios',
              },
            ],
          },
          {
            type: 'button',
            sub_type: 'url',
            index: '0',
            parameters: [
              {
                type: 'text',
                text: data.quote_id,
              },
            ],
          },
          {
            type: 'button',
            sub_type: 'url',
            index: '1',
            parameters: [
              {
                type: 'text',
                text: data.phone_client,
              },
            ],
          },
        ],
      },
    };

    const response = await firstValueFrom(
      this.httpService.post(this.url, messageData, { headers }),
    );
    console.log('Cotizacion: ', response.data);
    return response.data;
  }

  async sendReservationConfirmation(phone: string, phoneForThis: string, contactForThis: string, cityForThis: string, addressForThis: string, data: ReservationConfirmationData){
    const headers = {
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };

    const messageData = {
      messaging_product: 'whatsapp',
      to: phone,
      type: 'template',
      template: {
        name: 'reservation',
        language: {
          code: 'es',
        },
        components: [
          {
            type: 'header',
            parameters: [
              {
                type: 'image',
                image: {
                  link: 'https://imagenes-publicas-zzcr-s3.s3.us-east-1.amazonaws.com/img-header-reserva.jpeg',
                },
              },
            ],
          },
          {
            type: 'body',
            parameters: [
              {
                type: 'text',
                text: data.vehicle,
              },
              {
                type: 'text',
                text: data.transmission,
              },
              {
                type: 'text',
                text: data.model,
              },
              {
                type: 'text',
                text: data.entryCity,
              },
              {
                type: 'text',
                text: data.entryDateAndTime,
              },
              {
                type: 'text',
                text: data.days,
              },
              {
                type: 'text',
                text: this.formatMoney(data.totalOfRent),
              },
              {
                type: 'text',
                text: data.percentageOfRent,
              },
              {
                type: 'text',
                text: this.formatMoney(data.percentageInValues),
              },
              {
                type: 'text',
                text: data.agency,
              },
              {
                type: 'text',
                text: phoneForThis,
              },
              {
                type: 'text',
                text: contactForThis,
              },
              {
                type: 'text',
                text: cityForThis,
              },
              {
                type: 'text',
                text: addressForThis,
              },
            ],
          },
          {
            type: 'button',
            sub_type: 'url',
            index: '0',
            parameters: [
              {
                type: 'text',
                text: data.ids[0] + '/' + data.ids[1] + '/' + data.ids[2]
              },
            ],
          },
        ],
      },
    };

    const response = await firstValueFrom(
      this.httpService.post(this.url, messageData, { headers }),
    );
    console.log(response.data);
    return response.data;
  }

  async sendNewsMessages(phone: string){
    const headers = {
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };

    const messageData = {
      messaging_product: 'whatsapp',
      to: phone,
      type: 'template',
      template: {
        name: 'boletin_dos',
        language: {
          code: 'es',
        },
        components: [
          {
            type: 'header',
            parameters: [
              {
                type: 'image',
                image: {
                  link: 'https://imagenes-publicas-zzcr-s3.s3.us-east-1.amazonaws.com/boletin2.jpg',
                },
              },
            ],
          }
        ],
      },
    };

    const response = await firstValueFrom(
      this.httpService.post(this.url, messageData, { headers }),
    );
    console.log(response.data);
    return response.data;
  }

  private formatMoney(
    amount: number,
    currency: string = 'COP',
    locale: string = 'es-ES',
  ): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
}
