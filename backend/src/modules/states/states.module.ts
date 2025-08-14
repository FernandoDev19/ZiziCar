import { Module } from '@nestjs/common';
import { StatesService } from './states.service';
import { StatesController } from './states.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [StatesController],
  providers: [StatesService],
  imports: [AuthModule]
})
export class StatesModule {}
