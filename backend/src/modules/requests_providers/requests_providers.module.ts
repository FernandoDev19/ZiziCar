import { Module } from '@nestjs/common';
import { RequestsProvidersService } from './requests_providers.service';
import { RequestsProvidersController } from './requests_providers.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [RequestsProvidersController],
  providers: [RequestsProvidersService],
  imports: [AuthModule]
})
export class RequestsProvidersModule {}
