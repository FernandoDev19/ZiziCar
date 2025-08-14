import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class StatesService {
  constructor(private prismaService: PrismaService){}

  async create(createStateDto: CreateStateDto) {
    const stateExist = await this.prismaService.zIC_ADM_STATES.findFirst({
      where: {
        name: createStateDto.name,
        country_id: createStateDto.country_id
      }
    });

    if(stateExist){
      throw new BadRequestException('State already exist');
    }

    const stateToCreate = await this.prismaService.zIC_ADM_STATES.create({
      data: createStateDto
    })

    return stateToCreate;
  }

  async findAll() {
    const states = await this.prismaService.zIC_ADM_STATES.findMany();

    if(!states){
      throw new NotFoundException('States not found');
    }

    return states;
  }

  async findStatesByCountry(countryId: number){
    const statesByCountry = await this.prismaService.zIC_ADM_STATES.findMany({
      where: {
        country_id: countryId
      }
    });

    if(!statesByCountry){
      throw new NotFoundException('States not found')
    }

    return statesByCountry;
  }

  async findOne(id: number) {
    const state = await this.prismaService.zIC_ADM_STATES.findUnique({
      where: {
        id
      }
    });


    if(!state){
      throw new NotFoundException('State not found');
    }

    return state;
  }

  async update(id: number, updateStateDto: UpdateStateDto) {
    const stateExist = await this.findOne(id);

    const stateToUpdate = await this.prismaService.zIC_ADM_STATES.update({
      where: {
        id
      },
      data: updateStateDto
    });

    return stateToUpdate;
  }

  async remove(id: number) {
    const stateExist = await this.findOne(id);

    const stateToDelete = await this.prismaService.zIC_ADM_STATES.delete({
      where: {
        id
      }
    });

    return stateToDelete;
  }
}
