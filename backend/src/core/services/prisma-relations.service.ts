import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PrismaRelationsService {

    constructor(private readonly prisma: PrismaService){}

    async getGammaName(gammaId: string): Promise<string> {
        const gamma = await this.prisma.gamma.findUnique({
            where: { id: gammaId },
            select: { name: true },
        });
        return gamma?.name || 'Desconocido';
    }
      
    async getTransmissionName(transmissionId: string): Promise<string>{
        const transmission = await this.prisma.zIC_ADM_TRANSMISSION.findUnique({
            where: { id: transmissionId },
            select: { name: true }
        });
        return transmission?.name || 'Desconocido';
    }

    async getCity(cityId: number): Promise<string>{
        const city = await this.prisma.zIC_ADM_GLOBAL_CITIES.findUnique({
            where: { id: cityId },
            select: { name: true }
        });
        return city?.name || 'Desconocida';
    }
}
