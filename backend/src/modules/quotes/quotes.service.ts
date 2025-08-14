import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { MetaService } from 'src/core/services/meta.service';
import { QuoteData } from './interfaces/quote-data.interface';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { PrismaService } from 'src/prisma.service';
import { UserActiveInterface } from 'src/common/interfaces/active-user.interface';
import { Role } from 'src/common/enums/role.enum';
import { Prisma } from '@prisma/client';

@Injectable()
export class QuotesService {
  constructor(
    private metaService: MetaService,
    private prismaService: PrismaService,
  ) {}

  async create(user: UserActiveInterface, quote: CreateQuoteDto) {

    if (user.role === Role.USER) {
      throw new UnauthorizedException();
    } 

    const quoteExist = await this.prismaService.zIC_ADM_QUOTES.findFirst({
      where: {
        request_id: quote.request_id,
        renter_id: quote.renter_id
      }
    });

    if(quoteExist){
      throw new BadRequestException('Quote exist');
    }

    const findTransmission = await this.prismaService.zIC_ADM_TRANSMISSION.findFirst({
      where: {
        name: quote.transmission
      }
    })

    try{
      const quoteCreate = await this.prismaService.zIC_ADM_QUOTES.create({
        data: {
          ZIC_REQ_REQUESTS: {
            connect: { id: quote.request_id }
          },
          ZIC_ADM_PROVIDERS: {
            connect: { id: quote.renter_id }
          },
          phone_client: quote.phone_client,
          rent: quote.rent,
          overtime: quote.overtime,
          home_delivery: quote.home_delivery,
          home_collection: quote.home_collection,
          return_or_collection_different_city:
          quote.return_or_collection_different_city,
          total_value: quote.total_value,
          brand: quote.brand,
          ZIC_ADM_TRANSMISSION: {
            connect: { id: findTransmission?.id || '' },
          },
          model: quote.model,
          color: quote.color,
          plate_end_in: quote.plate_end_in,
          value_to_block_on_credit_card: quote.value_to_block_on_credit_card,
          allowed_payment_method: quote.allowed_payment_method,
          available_kilometers: quote.available_kilometers,
          percentage_of_total_value: quote.percentage_of_total_value,
          percentage_in_values: quote.percentage_in_values,
          comments: quote.comments || '',
        },
      });

      if(quoteCreate){
        const updatedQuotesCount = await this.prismaService.request.update({
          where: { id: quote.request_id },
          data: { quotes: { increment: 1 } }
        });

        const provider = await this.prismaService.provider.findUnique({
          where: {
            id: quote.renter_id
          },
          include: {
            ZIC_ADM_QUOTES: true
          }
        });

        const request = await this.prismaService.request.findUnique({
          where: {
            id: quote.request_id
          }
        })

        this.metaService.sendWhatsappMessageTemplateThanksForQuoting(provider.phone, provider.ZIC_ADM_QUOTES.length);
  
        const data: QuoteData = {
          quote_id: quoteCreate.id,
          phone_client: quote.phone_client,
          quote_number: request.quotes,
          rent: quote.rent,
          overtime: quote.overtime,
          home_delivery: quote.home_delivery,
          home_collection: quote.home_collection,
          return_or_collection_different_city:  quote.return_or_collection_different_city,
          total_value: quote.total_value,
          brand: quote.brand,
          transmission: quote.transmission,
          model: quote.model,
          color: quote.color,
          plate_end_in: quote.plate_end_in,
          value_to_block_on_credit_card: quote.value_to_block_on_credit_card,
          paymentMethodForWarranty: quote.paymentMethodForWarranty,
          allowed_payment_method: quote.allowed_payment_method,
          available_kilometers: quote.available_kilometers,
          percentage_of_total_value: quote.percentage_of_total_value,
          percentage_in_values: quote.percentage_in_values,
          comments: quote.comments || '',
        };
        this.metaService.sendWhatssapMessageTemplateQuoteRequest(data);
      }
  
      return quoteCreate;
    }catch(error){
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException('Error al intentar crear la cotizacion');
      }
      throw new BadRequestException('Ocurrió un error inesperado');
    }
  }

  private async getTransmission(id: string) {
    const transmission = await this.prismaService.zIC_ADM_TRANSMISSION.findUnique({
      where: {
        id: id,
      },
      select: {
        name: true,
      },
    });

    return transmission?.name;
  }

  async findOneWithId(id: string) {

    const request = await this.prismaService.zIC_ADM_QUOTES.findUnique({
      where: {
        id: id,
      },
    });

    if (!request) {
      throw new NotFoundException('Quote not found');
    }

    return request;
  }

  async findQuoteWithIdForAdditionalIformation(id: string){
    const quote = await this.prismaService.zIC_ADM_QUOTES.findUnique({
      where: {
        id
      },
      include: {
        ZIC_ADM_PROVIDERS: true,
        ZIC_REQ_REQUESTS: true,
        ZIC_ADM_TRANSMISSION: {
          select: {
            name: true
          }
        }
      }
    });

    if(!quote){
      throw new NotFoundException('Quote not found');
    }

    if(!quote.ZIC_REQ_REQUESTS){
      throw new NotFoundException('Related request not found');
    }

    const additionalInformation = {
      requestId: quote.ZIC_REQ_REQUESTS?.id || '',
      email: quote.ZIC_REQ_REQUESTS?.email || '',
      phone: quote.ZIC_REQ_REQUESTS?.phone || '',
      percentageInValues: quote.percentage_in_values
    }

    return additionalInformation;
  }

  async findAll(user: UserActiveInterface) {

    await this.validateOwnerShip(user, Role.ADMIN);

    const quotes = await this.prismaService.zIC_ADM_QUOTES.findMany();

    if (!quotes) {
      throw new NotFoundException('Quotes not found');
    }

    return quotes;
  }

  async findAllWhereRequestId(requestId: string){
    const requestExist = await this.prismaService.request.findUnique({
      where: {
        id: requestId
      }
    });

    if(!requestExist){
      throw new NotFoundException('Request not found');
    }

    const quotes = await this.prismaService.zIC_ADM_QUOTES.findMany({
      where: {
        request_id: requestId
      }
    });

    if(!quotes){
      throw new NotFoundException('Quotes not found');
    }

    return quotes;
  }

  private async validateOwnerShip(user: UserActiveInterface, role: string){
    if(user.role != role){
      throw new UnauthorizedException();
    }
  }

  async quoteExist(requestId: string, renterId: string){
    const quote = await this.prismaService.zIC_ADM_QUOTES.findFirst({
      where: {
        request_id: requestId,
        renter_id: renterId
      }
    });

    return quote;
  }

  async remove(id: string){
    const quoteExist = await this.findOneWithId(id);

    const quoteToDelete = await this.prismaService.zIC_ADM_QUOTES.delete({
      where: {
        id
      }
    })

    return quoteToDelete;
  }
}

