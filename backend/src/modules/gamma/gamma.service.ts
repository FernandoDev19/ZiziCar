import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGammaDto } from './dto/create-gamma.dto';
import { UpdateGammaDto } from './dto/update-gamma.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class GammaService {

  constructor(
    private readonly prisma: PrismaService
  ) {}

  async create(createGammaDto: Prisma.GammaCreateInput) {
    return await this.prisma.gamma.create({
      data: createGammaDto
    })
  }

  async findAll() {
    return await this.prisma.gamma.findMany();
  }
  
  async getAveragePrices() {
    const quotes = await this.prisma.zIC_ADM_QUOTES.findMany({
      include: {
        ZIC_REQ_REQUESTS: {
          include: {
            gamma: {
              select: {
                precio_promedio: true,
              },
            },
          },
        },
      },
      orderBy: [
        { ZIC_REQ_REQUESTS: { gamma_id: 'asc' } },
        { ZIC_REQ_REQUESTS: { entry_date: 'desc' } },
      ],
      take: 100,
    });
  
    if (!quotes || quotes.length === 0) {
      throw new NotFoundException('Quotes not found');
    }
  
    const gammaMap = new Map<string, any[]>();
  
    // Agrupar las cotizaciones por `gamma_id`
    quotes.forEach((quote) => {
      const request = quote.ZIC_REQ_REQUESTS;
      if (request && request.gamma_id) {
        if (!gammaMap.has(request.gamma_id)) {
          gammaMap.set(request.gamma_id, []);
        }
        const gammaQuotes = gammaMap.get(request.gamma_id);
  
        if (gammaQuotes && gammaQuotes.length < 10) {
          gammaQuotes.push({
            rent: quote.rent,
            entry_date: request.entry_date,
            devolution_date: request.devolution_date,
            precio_promedio: request.gamma?.precio_promedio?.toNumber() ?? 0,
          });
        }
      }
    });
  
    // Calcular el promedio de los valores diarios para cada gama
    const preciosPromedio = Array.from(gammaMap.entries()).map(([gammaId, gammaQuotes]) => {
      // Calcular el valor por día de cada cotización
      const totalDailyValues = gammaQuotes.reduce((acc, quote) => {
        const diasDeRenta = this.getDaysOfRent(quote.entry_date, quote.devolution_date);
        if (diasDeRenta > 0) {
          const dailyPrice = quote.rent / diasDeRenta;
          acc.total += dailyPrice;
          acc.count += 1;
        }
        return acc;
      }, { total: 0, count: 0 });
  
      // Calcular el promedio de los valores diarios para esa gama
      const averageDailyPrice = totalDailyValues.count > 0 ? totalDailyValues.total / totalDailyValues.count : 0;
  
      return {
        gammaId,
        averagePrice: averageDailyPrice,
      };
    });
  
    return preciosPromedio;
  }
  
  private getDaysOfRent(entryDate: string, devolutionDate: string) {
    const startDate = new Date(entryDate);
    const endDate = new Date(devolutionDate);
    const differenceInTime = endDate.getTime() - startDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return Math.ceil(differenceInDays);
  }

  async findOne(id: string){
    const gamma = await this.prisma.gamma.findUnique({
      where: { id }
    });

    if(!gamma){
      throw new NotFoundException('Gamma not found');
    }

    return gamma;
  }

  async remove(id: string) {
    return await this.prisma.gamma.delete({
      where: { id }
    })
  }
}
