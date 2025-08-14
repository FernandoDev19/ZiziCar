import { Module } from '@nestjs/common';
import { QuotesController } from './quotes.controller';
import { QuotesService } from './quotes.service';
import { AuthModule } from '../auth/auth.module';

@Module({
    controllers: [QuotesController],
    providers: [QuotesService],
    imports: [AuthModule]
  })
export class QuotesModule {}
