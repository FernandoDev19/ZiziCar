import { Module } from '@nestjs/common';
import { GammaService } from './gamma.service';
import { GammaController } from './gamma.controller';
import { S3Service } from 'src/core/services/s3.service';
import { PrismaService } from 'src/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [GammaController],
  providers: [GammaService, S3Service, PrismaService],
  imports: [AuthModule]
})
export class GammaModule {}
