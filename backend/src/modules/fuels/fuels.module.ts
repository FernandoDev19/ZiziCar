import { Module } from '@nestjs/common';
import { FuelsService } from './fuels.service';
import { FuelsController } from './fuels.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [FuelsController],
  providers: [FuelsService],
  imports: [AuthModule]
})
export class FuelsModule {}
