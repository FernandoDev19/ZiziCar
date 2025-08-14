import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CountriesService {
  constructor(private prismaService: PrismaService){}

  async create(createCountryDto: CreateCountryDto) {
    const countryExist = await this.prismaService.zIC_ADM_COUNTRIES.findFirst({
      where: {
        name: createCountryDto.name
      }
    });

    if(countryExist){
      throw new BadRequestException('Country already exist')
    }

    const countryToCreate = await this.prismaService.zIC_ADM_COUNTRIES.create({
      data: {
        name: createCountryDto.name,
        prefix: createCountryDto.prefix,
        ZIC_ADM_CONTINENTS: {
          connect: {
            id: createCountryDto.continent_id
          }
        }
      }
    });

    return countryToCreate;
  }

  async findAll() {
   const countries = await this.prismaService.zIC_ADM_COUNTRIES.findMany();

   if(countries.length === 0){
    throw new NotFoundException('Countries not found');
   }

   return countries;
  }

  async findOne(id: number) {
    const country = await this.prismaService.zIC_ADM_COUNTRIES.findUnique({
      where: {
        id
      }
    });

    if(!country){
      throw new NotFoundException('City not found');
    }

    return country;
  }

  async update(id: number, updateCountryDto: UpdateCountryDto) {
    const countryExist = await this.findOne(id);

    const countryToUpdate = await this.prismaService.zIC_ADM_COUNTRIES.update({
      where: {
        id
      },
      data: updateCountryDto
    });

    return countryToUpdate;
  }

  async remove(id: number) {
    const countryExist = await this.findOne(id);

    const countryToDelete = await this.prismaService.zIC_ADM_COUNTRIES.delete({
      where: { id }
    })

    return countryToDelete;
  }
}
