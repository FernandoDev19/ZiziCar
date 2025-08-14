import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGlobalCityDto } from './dto/create-global-city.dto';
import { UpdateGlobalCityDto } from './dto/update-global-city.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class GlobalCitiesService {
  constructor(private prismaService: PrismaService){}

  async create(createGlobalCityDto: CreateGlobalCityDto) {
    const cityExist = await this.prismaService.zIC_ADM_GLOBAL_CITIES.findFirst({
      where: {
        name: createGlobalCityDto.name,
        state_id: createGlobalCityDto.state_id
      }
    });

    if(cityExist){
      throw new BadRequestException('City already exist');
    };

    const cityToCreate = await this.prismaService.zIC_ADM_GLOBAL_CITIES.create({
      data: createGlobalCityDto
    });

    return cityToCreate;
  }

  async findAll() {
    const cities = await this.prismaService.zIC_ADM_GLOBAL_CITIES.findMany();

    if(!cities){
      throw new NotFoundException('Cities not found');
    }

    return cities;
  }

  async findAllByState(stateId: number){
    const citiesByState = await this.prismaService.zIC_ADM_GLOBAL_CITIES.findMany({
      where: {
        state_id: stateId
      }
    });

    if(!citiesByState){
      throw new NotFoundException('Cities by state not found');
    }

    return citiesByState;
  }

  async findOne(id: number) {
    const city = await this.prismaService.zIC_ADM_GLOBAL_CITIES.findUnique({
      where: {
        id
      }
    });

    return city;
  }

  async update(id: number, updateGlobalCityDto: UpdateGlobalCityDto) {
    const cityExist = await this.findOne(id);

    const cityToUpdate = await this.prismaService.zIC_ADM_GLOBAL_CITIES.update({
      where: {
        id
      },
      data: updateGlobalCityDto
    });

    return cityToUpdate;
  }

  async remove(id: number) {
    const cityExist = await this.findOne(id);
    
    const cityToDelete = await this.prismaService.zIC_ADM_GLOBAL_CITIES.delete({
      where: {
        id
      }
    });

    return cityToDelete;
  }
}
