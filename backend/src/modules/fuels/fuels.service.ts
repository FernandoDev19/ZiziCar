import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFuelDto } from './dto/create-fuel.dto';
import { UpdateFuelDto } from './dto/update-fuel.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class FuelsService {
  constructor(private prismaService: PrismaService){}

  async create(createFuelDto: CreateFuelDto) {
    const fuelToCreate: Prisma.ZIC_ADM_FUELSCreateInput = {
      name: createFuelDto.name
    };

    const fuel = await this.prismaService.zIC_ADM_FUELS.create({
      data: fuelToCreate
    });

    return fuel;
  }

  async findAll() {
    const fuels = await this.prismaService.zIC_ADM_FUELS.findMany();

    if(!fuels){
      throw new NotFoundException('Fuels not found')
    }

    return fuels;
  }

  async findOne(id: number) {
    const fuel = await this.prismaService.zIC_ADM_FUELS.findUnique({
      where: {
        id
      }
    });

    if(!fuel){
      throw new NotFoundException('Fuel not found');
    }

    return fuel;
  }

  async update(id: number, updateFuelDto: UpdateFuelDto) {
    await this.findOne(id);

    const fuelToUpdate: Prisma.ZIC_ADM_FUELSUpdateInput = {
      name: updateFuelDto.name
    };

    const fuel = this.prismaService.zIC_ADM_FUELS.update({
      where: {
        id
      },
      data: fuelToUpdate
    })

    return fuel;
  }

  async remove(id: number) {
    await this.findOne(id);

    const fuelToDelete = this.prismaService.zIC_ADM_FUELS.delete({
      where: {
        id
      }
    });

    return fuelToDelete;
  }
}
