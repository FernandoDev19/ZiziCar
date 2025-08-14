import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class BrandsService {
  constructor(private prismaService: PrismaService){}

  async create(createBrandDto: CreateBrandDto) {
    const brandToCreate: Prisma.ZIC_ADM_BRANDSCreateInput = {
      name: createBrandDto.name,
      doors: createBrandDto.doors,
      positions: createBrandDto.positions,
      generic_image: createBrandDto.generic_image,
      large_suitcases: createBrandDto.large_suitcases,
      small_suitcases: createBrandDto.small_suitcases,
      cylinder_capacity: createBrandDto.cylinder_capacity
    }

    const brand = await this.prismaService.zIC_ADM_BRANDS.create({
      data: brandToCreate
    });

    return brand;
  }

  async findAll() {
    const brands = await this.prismaService.zIC_ADM_BRANDS.findMany();

    if(!brands){
      throw new NotFoundException('Brands not found');
    }

    return brands;
  }

  async findOne(id: string) {
    const brand = await this.prismaService.zIC_ADM_BRANDS.findUnique({
      where: {
        id
      }
    });

    if(!brand){
      throw new NotFoundException('Brand not found');
    }

    return brand;
  }

  update(id: string, updateBrandDto: UpdateBrandDto) {
    return `This action updates a #${id} brand`;
  }

  async remove(id: string) {
    await this.findOne(id);

    const brandToDelete = await this.prismaService.zIC_ADM_BRANDS.delete({
      where: {
        id
      }
    })

    return brandToDelete;
  }
}
