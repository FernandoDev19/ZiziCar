import { Module } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [CountriesController],
  providers: [CountriesService],
  imports: [AuthModule]
})
export class CountriesModule {}
