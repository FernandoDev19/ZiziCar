import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RequestsProvidersService {
  constructor(private prismaService: PrismaService){}

  async findAllByProviderRequest(requestId: string, renterId: string){
    const result = await this.prismaService.zIC_ADM_REQUEST_PROVIDER.findMany({
      where: {
        request_id: requestId,
        provider_id: renterId
      }
    });

    if(result.length === 0){
      throw new NotFoundException('Data not found');
    }

    return result;
  }

  async findAllByRequest(requestId: string,){
    const result = await this.prismaService.zIC_ADM_REQUEST_PROVIDER.findMany({
      where: {
        request_id: requestId,
      },
      include: {
        ZIC_ADM_PROVIDERS: true
      }
    });

    if(result.length === 0){
      throw new NotFoundException('Data not found');
    }

    const providers = result.map(item => item.ZIC_ADM_PROVIDERS);

    return providers;
  }

}
