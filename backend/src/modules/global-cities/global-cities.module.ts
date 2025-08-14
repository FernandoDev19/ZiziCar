import { Module } from '@nestjs/common';
import { GlobalCitiesService } from './global-cities.service';
import { GlobalCitiesController } from './global-cities.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [GlobalCitiesController],
  providers: [GlobalCitiesService],
  imports: [AuthModule]
})
export class GlobalCitiesModule {}
