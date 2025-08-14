import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
import { MetaService } from 'src/core/services/meta.service';
import { ReservationConfirmationData } from 'src/core/interfaces/reservation-confirmation-data.interface';
import { ProvidersService } from '../providers/providers.service';
import { UserActiveInterface } from 'src/common/interfaces/active-user.interface';
import { Role } from 'src/common/enums/role.enum';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  GetRequestDataInterface,
  RequestData,
} from './interfaces/request-data.interface';
import { MessageQueueService } from 'src/core/queues/message-queue/message-queue.service';
import { MailQueueService } from 'src/core/queues/mail-queue/mail-queue.service';

@Injectable()
export class RequestsService {
  private temporalUserAdmin: UserActiveInterface = {
    email: 'jose.diaz@milanocar.com',
    role: Role.ADMIN,
  };

  constructor(
    private readonly prisma: PrismaService,
    private metaService: MetaService,
    private providerService: ProvidersService,
    private messageQueueService: MessageQueueService,
    private mailQueueService: MailQueueService,
  ) {}

  async create(createRequestDto: Prisma.RequestCreateInput) {
    const resultado = await this.prisma.request.create({
      data: createRequestDto,
    });

    if (resultado) {
      await this.sendEmailNewRequest(resultado as GetRequestDataInterface);
      await this.sendMessagesOfRequest(resultado as GetRequestDataInterface);
    }
    
    return resultado;
  }

  async findAll(user: UserActiveInterface) {
    switch (user.role) {
      case Role.ADMIN:
        const allRequests = await this.prisma.request.findMany({
          include: {
            ZIC_ADM_CUSTOMERS: {
              include: {
                ZIC_ADM_QUOTES: true,
              },
            },
            ZIC_ADM_REQUEST_PROVIDER: {
              include: {
                ZIC_ADM_PROVIDERS: {
                  include: {
                    ZIC_ADM_GLOBAL_CITIES: { select: { name: true } },
                    ZIC_ADM_STATES: { select: { name: true } },
                    ZIC_ADM_COUNTRIES: { select: { name: true } },
                  },
                },
              },
            },
            ZIC_REQ_CITIES_ZIC_REQ_REQUESTS_id_entry_cityToZIC_REQ_CITIES: {
              select: { name: true },
            },
            ZIC_REQ_CITIES_ZIC_REQ_REQUESTS_id_devolution_cityToZIC_REQ_CITIES:
              {
                select: { name: true },
              },
            ZIC_ADM_TRANSMISSION: { select: { name: true } },
            gamma: { select: { name: true } },
            ZIC_ADM_QUOTES: true,
            ZIC_REQ_ANSWERS: true,
          },
        });

        if (!allRequests || allRequests.length === 0) {
          throw new NotFoundException('Requests not found');
        }

        return allRequests.map((request) => ({
          id: request.id,
          sent_to:
            request.ZIC_ADM_REQUEST_PROVIDER?.map(
              (rp) => rp.ZIC_ADM_PROVIDERS,
            ) || [],
          quotes: request.ZIC_ADM_QUOTES || [],
          answers: request.ZIC_REQ_ANSWERS || [],
          customer: request.ZIC_ADM_CUSTOMERS || [],
          name: request.name,
          email: request.email,
          phone: request.phone,
          comments: request.comments,
          entry_city:
            request
              .ZIC_REQ_CITIES_ZIC_REQ_REQUESTS_id_entry_cityToZIC_REQ_CITIES
              ?.name || 'Entry city not found',
          receive_at_airport: request.receive_at_airport ? 'Aeropuerto' : '',
          devolution_city:
            request
              .ZIC_REQ_CITIES_ZIC_REQ_REQUESTS_id_devolution_cityToZIC_REQ_CITIES
              ?.name || 'Devolution city not found',
          returns_at_airport: request.returns_at_airport ? 'Aeropuerto' : '',
          devolution_date: request.devolution_date
            ? format(new Date(request.devolution_date), 'PPPP', { locale: es })
            : '',
          entry_date: request.entry_date
            ? format(new Date(request.entry_date), 'PPPP', { locale: es })
            : '',
          entry_date_unformatted: request.entry_date,
          devolution_date_unformatted: request.devolution_date,
          devolution_time: request.devolution_time,
          entry_time: request.entry_time,
          gamma: request.gamma?.name || 'Gamma not found',
          transmission:
            request.ZIC_ADM_TRANSMISSION?.name || 'Transmission not found',
          days_of_rent: this.getDaysOfRent(
            request.entry_date.toString(),
            request.devolution_date.toString(),
          ),
          created_at: request.created_at,
        }));

      case Role.PROVIDER:
        const provider = await this.prisma.provider.findFirst({
          where: {
            email: user.email,
          },
          select: {
            id: true,
          },
        });

        if (!provider) {
          throw new NotFoundException('Provider not found');
        }

        const requestsOfThisProvider =
          await this.prisma.zIC_ADM_REQUEST_PROVIDER.findMany({
            where: {
              provider_id: provider.id,
            },
            include: {
              ZIC_REQ_REQUESTS: {
                include: {
                  ZIC_REQ_CITIES_ZIC_REQ_REQUESTS_id_entry_cityToZIC_REQ_CITIES:
                    true, // Ciudad de entrada
                  ZIC_REQ_CITIES_ZIC_REQ_REQUESTS_id_devolution_cityToZIC_REQ_CITIES:
                    true, // Ciudad de devolución
                  ZIC_ADM_TRANSMISSION: true, // Transmisión
                  gamma: true, // Gamma
                  ZIC_ADM_QUOTES: {
                    where: { renter_id: provider.id }, // Cotizaciones del proveedor
                  },
                  ZIC_REQ_ANSWERS: {
                    where: { renter_id: provider.id }, // Respuestas específicas
                  },
                },
              },
            },
          });

        const allRequestsForProvider = requestsOfThisProvider.map(
          (entry) => entry.ZIC_REQ_REQUESTS,
        );

        return allRequestsForProvider.map((request) => ({
          id: request.id,
          quotes: request.ZIC_ADM_QUOTES || [],
          answers: request.ZIC_REQ_ANSWERS || [],
          name: request.name,
          email: request.email,
          phone: request.phone,
          comments: request.comments,
          entry_city:
            request
              .ZIC_REQ_CITIES_ZIC_REQ_REQUESTS_id_entry_cityToZIC_REQ_CITIES
              ?.name || 'Entry city not found',
          receive_at_airport: request.receive_at_airport ? 'Aeropuerto' : '',
          devolution_city:
            request
              .ZIC_REQ_CITIES_ZIC_REQ_REQUESTS_id_devolution_cityToZIC_REQ_CITIES
              ?.name || 'Devolution city not found',
          returns_at_airport: request.returns_at_airport ? 'Aeropuerto' : '',
          devolution_date: request.devolution_date
            ? format(new Date(request.devolution_date), 'PPPP', { locale: es })
            : '',
          entry_date: request.entry_date
            ? format(new Date(request.entry_date), 'PPPP', { locale: es })
            : '',
          entry_date_unformatted: request.entry_date,
          devolution_date_unformatted: request.devolution_date,
          devolution_time: request.devolution_time,
          entry_time: request.entry_time,
          gamma: request.gamma?.name || 'Gamma not found',
          transmission:
            request.ZIC_ADM_TRANSMISSION?.name || 'Transmission not found',
          days_of_rent: this.getDaysOfRent(
            request.entry_date.toString(),
            request.devolution_date.toString(),
          ),
          created_at: request.created_at,
        }));

      case Role.EMPLOYE:
        // Código específico para employee, si es necesario
        return /* aquí colocar lo que retornar para employee */;

      default:
        throw new UnauthorizedException();
    }
  }

  async countAll(user: UserActiveInterface, condition: string) {
    const conditionsAvailable = [
      'all',
      'quotes',
      'unquotes',
      'answers',
      'expireds',
    ];
    if (user.role === Role.ADMIN) {
      if (conditionsAvailable.includes(condition)) {
        if (condition === 'all') {
          return await this.prisma.request.count();
        } else if (condition === 'quotes') {
          return await this.prisma.zIC_ADM_QUOTES.count();
        } else if (condition === 'unquotes') {
          return await this.prisma.request.count({
            where: {
              ZIC_ADM_QUOTES: {
                none: {},
              },
              ZIC_REQ_ANSWERS: {
                none: {},
              },
            },
          });
        } else if (condition === 'answers') {
          return await this.prisma.zIC_REQ_ANSWERS.count();
        } else if (condition === 'expireds') {
          return await this.prisma.request.count({
            where: {
              entry_date: {
                lt: new Date(),
              },
            },
          });
        }
      } else {
        throw new BadRequestException('Incorrect condition');
      }
    } else if (user.role === Role.PROVIDER || user.role === Role.EMPLOYE) {
      const provider = await this.prisma.provider.findFirst({
        where: {
          email: user.email,
        },
      });

      if (conditionsAvailable.includes(condition)) {
        if (condition === 'all') {
          return await this.prisma.zIC_ADM_REQUEST_PROVIDER.count({
            where: {
              provider_id: provider.id,
            },
          });
        } else if (condition === 'quotes') {
          return await this.prisma.zIC_ADM_QUOTES.count({
            where: {
              renter_id: provider.id,
            },
          });
        } else if (condition === 'unquotes') {
          return await this.prisma.request.count({
            where: {
              ZIC_ADM_REQUEST_PROVIDER: {
                some: {
                  provider_id: provider.id,
                },
              },
              ZIC_ADM_QUOTES: {
                none: {
                  renter_id: provider.id,
                },
              },
              ZIC_REQ_ANSWERS: {
                none: {
                  renter_id: provider.id,
                },
              },
            },
          });
        } else if (condition === 'answers') {
          return await this.prisma.zIC_REQ_ANSWERS.count({
            where: {
              renter_id: provider.id,
            },
          });
        }
      } else {
        throw new BadRequestException('Incorrect condition');
      }
    } else {
      throw new UnauthorizedException();
    }
  }

  async findOne(id: string) {
    const request = await this.prisma.request.findUnique({
      where: {
        id: id,
      },
      include: {
        ZIC_REQ_CITIES_ZIC_REQ_REQUESTS_id_entry_cityToZIC_REQ_CITIES: {
          select: {
            name: true,
          },
        },
        ZIC_REQ_CITIES_ZIC_REQ_REQUESTS_id_devolution_cityToZIC_REQ_CITIES: {
          select: {
            name: true,
          },
        },
        gamma: {
          select: {
            name: true,
          },
        },
        ZIC_ADM_TRANSMISSION: {
          select: {
            name: true,
          },
        },
      },
    });
    if (!request) {
      throw new NotFoundException('Request not found');
    }

    const dataRequest = {
      id: request.id,
      sent_to: request.sent_to,
      quotes: request.quotes,
      answers: request.answers,
      name: request.name,
      email: request.email,
      phone: request.phone,
      comments: request.comments || null,
      entry_city:
        request.ZIC_REQ_CITIES_ZIC_REQ_REQUESTS_id_entry_cityToZIC_REQ_CITIES
          ?.name || 'No disponible',
      receive_at_airport: request.receive_at_airport ? 'Aeropuerto' : '',
      devolution_city:
        request
          .ZIC_REQ_CITIES_ZIC_REQ_REQUESTS_id_devolution_cityToZIC_REQ_CITIES
          ?.name || 'No disponible',
      returns_at_airport: request.returns_at_airport ? 'Aeropuerto' : '',
      devolution_date: request.devolution_date,
      entry_date: request.entry_date,
      days_of_rent: this.getDaysOfRent(
        request.entry_date.toString(),
        request.devolution_date.toString(),
      ),
      devolution_time: request.devolution_time,
      entry_time: request.entry_time,
      gamma: request.gamma?.name || 'No disponible',
      transmission: request.ZIC_ADM_TRANSMISSION?.name || 'No disponible',
      created_at: request.created_at,
    };

    return dataRequest;
  }

  async remove(user: UserActiveInterface, id: string) {
    if (user.role != Role.ADMIN) {
      throw new UnauthorizedException(
        'Solo un administrador puede eliminar solicitudes.',
      );
    }

    const requestExist = await this.findOne(id);

    try {
      await this.prisma.zIC_ADM_CUSTOMERS.deleteMany({
        where: { request_id: id },
      });
      await this.prisma.zIC_ADM_REQUEST_PROVIDER.deleteMany({
        where: { request_id: id },
      });
      await this.prisma.zIC_ADM_QUOTES.deleteMany({
        where: { request_id: id },
      });
      await this.prisma.zIC_REQ_ANSWERS.deleteMany({
        where: { request_id: id },
      });

      const requestToDelete = await this.prisma.request.delete({
        where: { id },
      });

      return requestToDelete;
    } catch (error) {
      throw new BadRequestException('Error al eliminar la solicitud.', error);
    }
  }

  async sendReservationAlert(data: {
    customerId: string;
    requestId: string;
    quoteId: string;
  }) {
    const users = await this.prisma.user.findMany({
      where: {
        role: Role.ADMIN,
      },
      select: {
        phone: true,
        name: true,
      },
    });
    const provCustQuote = await this.prisma.zIC_ADM_CUSTOMERS.findFirst({
      where: {
        id: data.customerId,
        quote_id: data.quoteId,
      },
      include: {
        ZIC_ADM_QUOTES: {
          include: {
            ZIC_ADM_PROVIDERS: {
              select: {
                name: true,
                phone: true,
              },
            },
            ZIC_ADM_TRANSMISSION: {
              select: {
                name: true,
              },
            },
            ZIC_REQ_REQUESTS: {
              include: {
                ZIC_REQ_CITIES_ZIC_REQ_REQUESTS_id_devolution_cityToZIC_REQ_CITIES:
                  {
                    select: {
                      name: true,
                    },
                  },
                ZIC_REQ_CITIES_ZIC_REQ_REQUESTS_id_entry_cityToZIC_REQ_CITIES: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (
      !provCustQuote ||
      !provCustQuote.ZIC_ADM_QUOTES ||
      !provCustQuote.ZIC_ADM_QUOTES.ZIC_REQ_REQUESTS ||
      !provCustQuote.ZIC_ADM_QUOTES.ZIC_ADM_PROVIDERS
    ) {
      throw new Error(
        'Los datos necesarios para generar la alerta no están completos.',
      );
    }
    const adminphones = users.map((user) => {
      return user.phone || '';
    });
    const adminNames = users.map((user) => {
      return user.name;
    });

    const dataForAdmins = {
      admin_names: adminNames,
      admin_phones: adminphones,
      provider_name:
        provCustQuote.ZIC_ADM_QUOTES.ZIC_ADM_PROVIDERS.name || 'Desconocido',
      provider_phone:
        provCustQuote.ZIC_ADM_QUOTES.ZIC_ADM_PROVIDERS.phone || 'No disponible',
      vehicle: provCustQuote.ZIC_ADM_QUOTES.brand || 'No especificado',
      transmission:
        provCustQuote.ZIC_ADM_QUOTES.ZIC_ADM_TRANSMISSION?.name ||
        'No especificada',
      model: provCustQuote.ZIC_ADM_QUOTES.model || 0,
      total_value: provCustQuote.ZIC_ADM_QUOTES.total_value || 0,
      percentage_of_rent:
        provCustQuote.ZIC_ADM_QUOTES.percentage_of_total_value || '0%',
      percentage_in_values:
        provCustQuote.ZIC_ADM_QUOTES.percentage_in_values || 0,
      outstanding_balance:
        (provCustQuote.ZIC_ADM_QUOTES.total_value || 0) -
        (provCustQuote.ZIC_ADM_QUOTES.percentage_in_values || 0),
      customer_name: provCustQuote.credit_card_holder_name || 'No especificado',
      phone_client: provCustQuote.phone || 'No disponible',
      identification: provCustQuote.identification || 'No disponible',
      id: data.customerId,
    };

    await this.messageQueueService.queueSendReservationAlert(dataForAdmins);

    return dataForAdmins;
  }

  async sendReservationConfirmation(data: ReservationConfirmationData) {
    if (!data.phones || data.phones.length < 2) {
      throw new Error('At least two phone numbers are required');
    }

    const customer = await this.prisma.zIC_ADM_CUSTOMERS.findFirst({
      where: {
        phone: data.phones[0],
      },
      include: {
        ZIC_ADM_QUOTES: {
          include: {
            ZIC_ADM_PROVIDERS: {
              where: {
                phone: data.phones[1],
              },
              include: {
                ZIC_ADM_GLOBAL_CITIES: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            ZIC_ADM_TRANSMISSION: {
              select: {
                name: true,
              },
            },
          },
        },
        ZIC_REQ_REQUESTS: {
          include: {
            ZIC_REQ_CITIES_ZIC_REQ_REQUESTS_id_entry_cityToZIC_REQ_CITIES: {
              select: {
                name: true,
              },
            },
            ZIC_REQ_CITIES_ZIC_REQ_REQUESTS_id_devolution_cityToZIC_REQ_CITIES:
              {
                select: {
                  name: true,
                },
              },
          },
        },
      },
    });

    const provider = customer.ZIC_ADM_QUOTES.ZIC_ADM_PROVIDERS;
    const quote = customer.ZIC_ADM_QUOTES;
    const request = customer.ZIC_REQ_REQUESTS;

    const dataForEmail = {
      emails: [customer.email || '', provider.email],
      mailData: {
        entryCity:
          request.ZIC_REQ_CITIES_ZIC_REQ_REQUESTS_id_entry_cityToZIC_REQ_CITIES
            .name || 'No disponible',
        devolutionCity:
          request
            .ZIC_REQ_CITIES_ZIC_REQ_REQUESTS_id_devolution_cityToZIC_REQ_CITIES
            .name || 'No disponible',
        entryDateTime:
          (await this.formatDate(request.entry_date.toString())) +
          ' ' +
          request.entry_time,
        devolutionDateTime:
          (await this.formatDate(request.devolution_date.toString())) +
          ' ' +
          request.devolution_time,
        daysOfRent: await this.getDaysOfRent(
          request.entry_date.toString(),
          request.devolution_date.toString(),
        ),
        createdAt: await this.formatDate(request.created_at.toString()),
        vehicle: quote.brand,
        transmission: quote.ZIC_ADM_TRANSMISSION.name || 'No disponible',
        model: quote.model,
        totalValue: await this.formatMoney(quote.total_value),
        percentage_of_total_value: quote.percentage_of_total_value,
        percentage_in_values: await this.formatMoney(
          quote.percentage_in_values,
        ),
        outstandingBalance: await this.formatMoney(
          quote?.total_value - quote?.percentage_in_values,
        ),
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
      },
    };
    await this.mailQueueService.sendMailTemplateConfirmationReservation(
      dataForEmail,
    );

    const resultados = [];

    let index = 1;
    for (const phone of data.phones) {
      try {
        const resultado = await this.metaService.sendReservationConfirmation(
          phone,
          data.phones[index],
          data.contact[index],
          data.city[index],
          data.address[index],
          data,
        );
        resultados.push({ phone, status: 'Success', resultado });
        index--;
      } catch (error) {
        console.error(`Failed to send confirmation to ${phone}:`, error);
        resultados.push({
          phone,
          status: 'Error',
          error: `Error al enviar mensaje de confirmacion: ${error}`,
        });
      }
    }

    return { status: 201, resultados };
  }

  private async saveRequestSendTo(
    data: Prisma.ZIC_ADM_REQUEST_PROVIDERCreateInput,
  ) {
    try {
      const result = this.prisma.zIC_ADM_REQUEST_PROVIDER.create({
        data: data,
      });

      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(
          'Error al intentar obtener a que proveedor llego la solicitud',
        );
      }
      throw new BadRequestException('Ocurrió un error inesperado');
    }
  }

  private async sendMessagesOfRequest(resultado: GetRequestDataInterface) {
    const user = this.temporalUserAdmin;

    const request = await this.prisma.request.findUnique({
      where: {
        id: resultado.id,
      },
      include: {
        gamma: {
          select: {
            name: true,
          },
        },
        ZIC_ADM_TRANSMISSION: {
          select: {
            name: true,
          },
        },
        ZIC_REQ_CITIES_ZIC_REQ_REQUESTS_id_devolution_cityToZIC_REQ_CITIES: {
          select: {
            name: true,
          },
        },
        ZIC_REQ_CITIES_ZIC_REQ_REQUESTS_id_entry_cityToZIC_REQ_CITIES: {
          select: {
            name: true,
          },
        },
      },
    });

    // Formatear fechas
    const entryDateFormatted = this.formatDate(request.entry_date.toString());
    const devolutionDateFormatted = this.formatDate(
      request.devolution_date.toString(),
    );

    const users = await this.prisma.user.findMany({
      where: {
        role: Role.ADMIN,
      },
      select: {
        phone: true,
        name: true,
      },
    });

    const adminphones = users.map((user) => {
      return user.phone || '';
    });
    const adminNames = users.map((user) => {
      return user.name || '';
    });

    const providers = await this.providerService.findAll(user);
    const phones = [];
    const names = [];
    let requestToProviderArray: { [key: string]: string }[] = [];
    let sentTo: number = 0;
    for (const provider of providers) {
      if (
        typeof provider === 'object' &&
        provider !== null &&
        'phone' in provider
      ) {
        let citiesPreferencesArray: number[] = [];
        try {
          citiesPreferencesArray = JSON.parse(
            provider.cities_preferences || '[]',
          ) as number[];
        } catch (error) {
          console.error('Error al parsear cities_preferences:', error);
        }
        if (citiesPreferencesArray.includes(request.id_entry_city)) {
          phones.push(provider.phone);
          names.push(provider.name);
          const requestToProvider = await this.saveRequestSendTo({
            ZIC_REQ_REQUESTS: {
              connect: { id: resultado.id },
            },
            ZIC_ADM_PROVIDERS: {
              connect: {
                id: provider.id,
              },
            },
            sent_at: new Date(),
          });
          requestToProviderArray.push({ [provider.phone]: requestToProvider.id });
          sentTo++;
        } else if (
          provider.cities_preferences === null ||
          citiesPreferencesArray.length === 0
        ) {
          phones.push(provider.phone);
          names.push(provider.name);
          const requestToProvider = await this.saveRequestSendTo({
            ZIC_REQ_REQUESTS: {
              connect: { id: resultado.id },
            },
            ZIC_ADM_PROVIDERS: {
              connect: {
                id: provider.id,
              },
            },
            sent_at: new Date(),
          });
          requestToProviderArray.push({ [provider.phone]: requestToProvider.id });
          sentTo++;
        }
      } else if (typeof provider === 'string') {
        console.log(provider);
      }
    }

    const setSentToForRequest = await this.prisma.request.update({
      where: {
        id: resultado.id,
      },
      data: {
        sent_to: sentTo,
      },
    });

    const data: RequestData = {
      id: resultado.id,
      phones: phones,
      requestToProvider: requestToProviderArray,
      providerName: names,
      gamma: request.gamma?.name ?? 'No especifica',
      transmission: request.ZIC_ADM_TRANSMISSION?.name ?? 'No especifica',
      daysOfRent: this.getDaysOfRent(request.entry_date.toString(), request.devolution_date.toString()),
      entryCity:
        request.ZIC_REQ_CITIES_ZIC_REQ_REQUESTS_id_entry_cityToZIC_REQ_CITIES
          ?.name ?? 'No aplica',
      devolutionCity:
        request
          .ZIC_REQ_CITIES_ZIC_REQ_REQUESTS_id_devolution_cityToZIC_REQ_CITIES
          ?.name ?? 'No aplica',
      receiveAtAirport: request.receive_at_airport ? ' en Aeropuerto' : '',
      returnsAtAirport: request.returns_at_airport ? ' en Aeropuerto' : '',
      entryDate: (await entryDateFormatted) ?? 'No se pudo obtener la fecha',
      devolutionDate:
        (await devolutionDateFormatted) ?? 'No se pudo obtener la fecha',
      entryTime: request.entry_time,
      devolutionTime: request.devolution_time,
      comments: request.comments ?? 'No hay comentarios',
    };

    const dataForAdmins: RequestData = {
      id: resultado.id,
      phones: adminphones,
      providerName: adminNames,
      requestToProvider: [],
      gamma: request.gamma?.name ?? 'No especifica',
      transmission: request.ZIC_ADM_TRANSMISSION?.name ?? 'No especifica',
      daysOfRent: this.getDaysOfRent(request.entry_date.toString(), request.devolution_date.toString()),
      entryCity:
        request.ZIC_REQ_CITIES_ZIC_REQ_REQUESTS_id_entry_cityToZIC_REQ_CITIES
          ?.name ?? 'No aplica',
      devolutionCity:
        request
          .ZIC_REQ_CITIES_ZIC_REQ_REQUESTS_id_devolution_cityToZIC_REQ_CITIES
          ?.name ?? 'No aplica',
      receiveAtAirport: request.receive_at_airport ? ' en Aeropuerto' : '',
      returnsAtAirport: request.returns_at_airport ? ' en Aeropuerto' : '',
      entryDate: (await entryDateFormatted) ?? 'No se pudo obtener la fecha',
      devolutionDate:
        (await devolutionDateFormatted) ?? 'No se pudo obtener la fecha',
      entryTime: request.entry_time,
      devolutionTime: request.devolution_time,
      comments: request.comments ?? 'No hay comentarios',
    };

    try {
      await this.metaService.sendWhatsappMessageTemplateWelcomeToZizicar(
        request.phone,
        request.name,
      );
      this.messageQueueService.queueTemplateRequestForProvider(data);
      this.messageQueueService.queueTemplateRequestForAdmin(dataForAdmins);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async sendEmailNewRequest(createRequestDto: GetRequestDataInterface) {
    const users = await this.prisma.user.findMany({
      where: {
        OR: [{ role: Role.ADMIN }, { role: Role.PROVIDER }],
      },
    });

    const usersEmail = users.map((user) => user.email);
    const roles = users.map((user) => user.role);

    const dataForQueue = {
      emails: usersEmail,
      role: roles,
      request: createRequestDto,
    };
    await this.mailQueueService.sendMailNewRequest(dataForQueue);
  }

  async sendMessages() {
    const providers = await this.prisma.provider.findMany({
      select: {
        phone: true,
      },
    });
    const admins = await this.prisma.user.findMany({
      where: {
        role: Role.ADMIN,
      },
      select: {
        phone: true,
      },
    });

    const providersPhone: string[] = providers.map(
      (provider) => provider.phone,
    );
    const adminsPhone: string[] = admins.map((admin) => admin.phone || '');

    // Combinar ambos arreglos
    const phones = [...providersPhone, ...adminsPhone];
    console.log(phones);

    const data = {
      phones,
    };

    // Llamada al servicio para enviar mensajes
    this.messageQueueService.queueSendNewsMessages(data);
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
