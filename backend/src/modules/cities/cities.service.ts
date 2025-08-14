import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
import { UserActiveInterface } from 'src/common/interfaces/active-user.interface';

@Injectable()
export class CitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: UserActiveInterface, createCityDto: Prisma.CityCreateInput) {
    if(user.role != user.role){
      throw new UnauthorizedException();
    }

    const cityExist = await this.findOneByName(createCityDto.name);

    if(cityExist){
      throw new BadRequestException('City already exist');
    }

    return await this.prisma.city.create({
      data: createCityDto,
    });
  }

  async findAll() {
    return await this.prisma.city.findMany();
  }

  private async findOneByName(name: string){
    const city = this.prisma.city.findFirst({
      where: {
        name: name
      }
    })

    if(!city){
      throw new NotFoundException('City not found');
    }

    return city;
  }

  async findOne(id: string) {
    const city = await this.prisma.city.findUnique({
      where: {
        id: id,
      },
    });

    if (!city) {
      return `City with ${id} not found.`;
    }

    return city;
  }

}
