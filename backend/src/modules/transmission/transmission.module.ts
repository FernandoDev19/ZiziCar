import { Module } from '@nestjs/common';
import { TransmissionService } from './transmission.service';
import { TransmissionController } from './transmission.controller';
import { S3Service } from 'src/core/services/s3.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [TransmissionController],
  providers: [TransmissionService, S3Service],
  imports: [AuthModule]
})
export class TransmissionModule {}
