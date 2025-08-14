import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [BrandsController],
  providers: [BrandsService],
  imports: [AuthModule]
})
export class BrandsModule {}
