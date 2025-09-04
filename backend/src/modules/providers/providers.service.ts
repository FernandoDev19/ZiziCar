import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
import { UserActiveInterface } from 'src/core/interfaces/active-user.interface';
import { Role } from 'src/core/enums/role.enum';
import { QuotesService } from '../quotes/quotes.service';
import { AnswersService } from '../answers/answers.service';

@Injectable()
export class ProvidersService {

  constructor(private prismaService: PrismaService){}

  async create(createProviderDto: CreateProviderDto) {

    await this.findOneWithNit(createProviderDto.nit);

 
      const providerCreate = await this.prismaService.provider.create({
        data: {
          name: createProviderDto.name,
          nit: createProviderDto.nit,
          phone: createProviderDto.phone,
          email: createProviderDto.email,
          ZIC_ADM_COUNTRIES: {
            connect: { id: createProviderDto.country_id }
          },
          ZIC_ADM_STATES: {
            connect: { id: createProviderDto.state_id }
          },
          ZIC_ADM_GLOBAL_CITIES: {
            connect: { id: createProviderDto.city_id }
          },
          address: createProviderDto.address,
          cities_preferences: JSON.stringify(createProviderDto.cities_preferences),
          allowed_payment_method: createProviderDto.allowed_payment_method,
          percentage_of_rent: createProviderDto.percentage_of_rent
        }
      });

      return providerCreate;
  }

  async findAll(user: UserActiveInterface) {
    await this.validateOwnerShip(user, Role.ADMIN);

    const providers = this.prismaService.provider.findMany();

    if(!providers){
      throw new NotFoundException('Providers not found');
    }

    return providers;
  }

  async findOneWithNit(nit: string) {
    const provider = this.prismaService.provider.findUnique({
      where: {
        nit: nit
      }
    });

    if(!provider){
      throw new NotFoundException('Provider not found');
    }

    return provider;
  }

  async findOneWithId(id: string){
    const provider = this.prismaService.provider.findUnique({
      where: {
        id: id
      }
    });

    if(!provider){
      throw new NotFoundException('Provider not found');
    }

    return provider;
  }

  async findOnePartialProvider(id: string){
    const provider = this.prismaService.provider.findUnique({
      where: {
        id: id
      },
      select: {
        name: true,
        phone: true,
        email: true
      }
    });

    if(!provider){
      throw new NotFoundException('Provider not found');
    }

    return provider;
  }

  async findOneWithEmail(email: string){
    const provider = this.prismaService.provider.findFirst({
      where: {
        email: email
      }
    });

    if(!provider){
      throw new NotFoundException('Provider not found');
    }

    return provider;
  }

  async changeStatusForProvider(user: UserActiveInterface, id: string = null, nit: string = null, status: boolean){

    await this.validateOwnerShip(user, Role.ADMIN);

    if(id){
      // const provider = await this.findOneWithId(id);
      // const providerUpdate = await this.prismaService.provider.update({
      //   where: {
      //     id: id
      //   },
      //   data: {
      //     status: status
      //   }
      // });

    }else if(nit){
      const provider = await this.findOneWithNit(nit);
    }else{
      throw new BadRequestException('ID or NIT have not been provided');
    }
  }

  private async validateOwnerShip(user: UserActiveInterface, role: string){
    if(user.role != role){
      throw new UnauthorizedException();
    }
  }

  async remove(id: string){
    const providerExist = await this.findOneWithId(id);

    const quotesToDelete = await this.prismaService.zIC_ADM_QUOTES.deleteMany({
      where: {
        renter_id: id
      }
    });
    const answersToDelete = await this.prismaService.zIC_REQ_ANSWERS.deleteMany({
      where: {
        renter_id: id
      }
    });
    const requests_providersToDelete = await this.prismaService.zIC_ADM_REQUEST_PROVIDER.deleteMany({
      where: {
        provider_id: id
      }
    })

    const providerToDelete = await this.prismaService.provider.delete({
      where: {
        id: id 
      }
    });

    return {details: {
      exist: providerExist,
      quotes: quotesToDelete,
      answers: answersToDelete,
      requestsReceive: requests_providersToDelete,
      provider: providerToDelete
    }};
  }

}
