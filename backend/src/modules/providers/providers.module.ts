import { Module } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { ProvidersController } from './providers.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ProvidersController],
  providers: [ProvidersService],
  imports: [AuthModule],
  exports: [ProvidersService]
})
export class ProvidersModule {}
