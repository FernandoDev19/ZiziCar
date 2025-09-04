import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from 'src/prisma.service';
import { UserActiveInterface } from 'src/core/interfaces/active-user.interface';
import { Role } from 'src/core/enums/role.enum';
import { Prisma } from '@prisma/client';
import { GetDetailsOfReservation } from 'src/core/queues/mail-queue/models/get-details.model';

@Injectable()
export class CustomersService {
  constructor(private prismaService: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto) {

    const customerExist = await this.prismaService.zIC_ADM_CUSTOMERS.findFirst({
      where: {
        phone: createCustomerDto.phone
      }
    });

    if(customerExist){
      const customerUpdate = await this.update(customerExist.id, createCustomerDto as UpdateCustomerDto);
    }else{
      try{
        const customer = await this.prismaService.zIC_ADM_CUSTOMERS.create({
          data: {
            ZIC_REQ_REQUESTS: {
              connect: { id: createCustomerDto.request_id },
            },
            ZIC_ADM_QUOTES: {
              connect: { id: createCustomerDto.quote_id }
            },
            identification: createCustomerDto.identification,
            credit_card_holder_name: createCustomerDto.credit_card_holder_name,
            gender: createCustomerDto.gender || 'Prefiero no decirlo',
            birthdate: createCustomerDto.birthdate || null,
            email: createCustomerDto.email,
            phone: createCustomerDto.phone,
            country: createCustomerDto.country,
            city: createCustomerDto.city,
            address: createCustomerDto.address
          },
        });
  
        return customer;
      }catch(error){
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new BadRequestException('Error al intentar crear el cliente');
        }
        throw new BadRequestException('Ocurrió un error inesperado');
      }
    }
  }

  async findAll(user: UserActiveInterface) {
    await this.validateOwnerShip(user, Role.ADMIN);

    const customers = await this.prismaService.zIC_ADM_CUSTOMERS.findMany();

    if(customers.length === 0){ 
      throw new NotFoundException('Customers not found');
    }

    return customers;
  }

  async findAllWithoutConfirmingPayment(user: UserActiveInterface) {
    const customers = await this.prismaService.zIC_ADM_CUSTOMERS.findMany({
      where: {
        confirmed_payment: false,
        deleted_at: null
      }
    });

    if(!customers){
      throw new NotFoundException('Customers not found');
    }

    await this.validateOwnerShip(user, Role.ADMIN);

    return customers;
  }

  async findOneByPhone(phone: string) {
    const customer = await this.prismaService.zIC_ADM_CUSTOMERS.findFirst({
      where: {
        phone: phone,
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer with phone ' + phone + ' not found.');
    }

    return customer;
  }

  async findPartialByPhone(phone: string) {
    const customer = await this.prismaService.zIC_ADM_CUSTOMERS.findFirst({
      where: {
        phone: phone,
      },
      select: {
        credit_card_holder_name: true,
        email: true,
        phone: true,
        identification: true,
        city: true,
        address: true,
        created_at: true
      }
    });

    if (!customer) {
      throw new NotFoundException('Customer with phone ' + phone + ' not found.');
    }

    return customer;
  }

  async findOneByIdWithAllConditionsOfReservation(id: string){
    const customer = await this.prismaService.zIC_ADM_CUSTOMERS.findUnique({
      where: {
        id
      },
      include: {
        ZIC_ADM_QUOTES: {
          include: {
            ZIC_ADM_TRANSMISSION: {
              select: {
                name: true
              }
            },
            ZIC_ADM_PROVIDERS: {
              include: {
                ZIC_ADM_GLOBAL_CITIES: {
                  select: {
                    name: true
                  }
                }
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
    const request = customer.ZIC_REQ_REQUESTS;
    const quote = customer.ZIC_ADM_QUOTES;

    if(!customer || !quote || !request || !customer.ZIC_ADM_QUOTES.ZIC_ADM_PROVIDERS){
      throw new NotFoundException('Data not found');
    }

    const allConditionOfReservation: GetDetailsOfReservation = {
      entryCity: request?.ZIC_REQ_CITIES_ZIC_REQ_REQUESTS_id_entry_cityToZIC_REQ_CITIES?.name || 'No disponible',
      devolutionCity: request?.ZIC_REQ_CITIES_ZIC_REQ_REQUESTS_id_devolution_cityToZIC_REQ_CITIES?.name || 'No disponible',
      entryDateTime: (await this.formatDate(request?.entry_date.toString())) + ' ' + request?.entry_time,
      devolutionDateTime: (await this.formatDate(request?.devolution_date.toString())) + ' ' + request?.devolution_time,
      daysOfRent: this.getDaysOfRent(request?.entry_date.toString(), request?.devolution_date.toString()),
      createdAt: await this.formatDate(request?.created_at.toString()),
      vehicle: quote?.brand,
      transmission: quote?.ZIC_ADM_TRANSMISSION?.name,
      model: quote?.model,
      totalValue: await this.formatMoney(quote?.total_value),
      percentage_of_total_value: quote?.percentage_of_total_value,
      percentage_in_values: await this.formatMoney(quote?.percentage_in_values),
      outstandingBalance: await this.formatMoney((quote?.total_value - quote?.percentage_in_values)),
      providerName: quote?.ZIC_ADM_PROVIDERS?.name,
      providerEmail: quote?.ZIC_ADM_PROVIDERS?.email,
      providerPhone: quote?.ZIC_ADM_PROVIDERS?.phone,
      providerCity: quote?.ZIC_ADM_PROVIDERS?.ZIC_ADM_GLOBAL_CITIES?.name || 'No disponible',
      providerAddress: quote?.ZIC_ADM_PROVIDERS?.address,
      customerName: customer.credit_card_holder_name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      customerIdentification: customer.identification,
      customerCity: customer.city,
      customerAddress: customer.address || 'No disponible',
    }

    return allConditionOfReservation;
  }

  async customerWithPhoneExist(phone: string) {
    const customer = await this.prismaService.zIC_ADM_CUSTOMERS.findFirst({
      where: {
        phone: phone,
      },
      select: {
        id: true,
        gender: true,
        credit_card_holder_name: true,
        country: true,
        city: true,
        address: true
      }
    });

    if(!customer){
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  private async findOneById(id: string){
    const customer = await this.prismaService.zIC_ADM_CUSTOMERS.findUnique({
      where: {
        id: id
      }
    });

    if(!customer){
      throw new NotFoundException();
    }

    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {

    const customerExist = await this.findOneById(id);

    try{
      const customer = await this.prismaService.zIC_ADM_CUSTOMERS.update({
        where: {
          id: id,
        },
        data: {
          ...updateCustomerDto,
        },
      });
  
      return customer;
    }catch(error){
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException('Error al intentar actualizar el cliente');
      }
      throw new BadRequestException('Ocurrió un error inesperado');
    }
  }

  async remove(user: UserActiveInterface, id: string) {
    await this.findOneById(id);

    await this.validateOwnerShip(user, Role.ADMIN);

    try{
      const customerRemoved = await this.prismaService.zIC_ADM_CUSTOMERS.update({
        where: {
          id: id 
        },
        data: {
          deleted_at: new Date()
        }
      });

      return customerRemoved;
    }catch(error){
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException('Error al intentar eliminar el cliente');
      }
      throw new BadRequestException('Ocurrió un error inesperado');
    }
  }

  private async validateOwnerShip(user: UserActiveInterface, role: string){
    if(user.role != role){
      throw new UnauthorizedException();
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
