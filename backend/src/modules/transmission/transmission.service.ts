import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
import { UserActiveInterface } from 'src/common/interfaces/active-user.interface';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class TransmissionService {

  constructor(private readonly prisma: PrismaService) {}

  async create(user: UserActiveInterface, createTransmissionDto: Prisma.ZIC_ADM_TRANSMISSIONCreateInput) {
    
    await this.validateOwnerShip(user, Role.ADMIN);
    
    return this.prisma.zIC_ADM_TRANSMISSION.create({
      data: createTransmissionDto,
    });
  }

  findAll() {
    return this.prisma.zIC_ADM_TRANSMISSION.findMany();
  }

  findOne(id: string){
    const transmission = this.prisma.zIC_ADM_TRANSMISSION.findUnique({
      where: {
        id: id
      }
    });

    if(!transmission){
      throw new NotFoundException('Transmission not found');
    }

    return transmission;
  }

  private async validateOwnerShip(user: UserActiveInterface, role: string){
    if(user.role != role){
      throw new UnauthorizedException();
    }
  }
}
