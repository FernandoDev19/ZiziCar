import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { ProvidersService } from '../providers/providers.service';
import { AuthModule } from '../auth/auth.module';
import { ProvidersModule } from '../providers/providers.module';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [RequestsController],
  providers: [RequestsService, ProvidersService],
  imports: [AuthModule, ProvidersModule, UsersModule],
})
export class RequestsModule {}
