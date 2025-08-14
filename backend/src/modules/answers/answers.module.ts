import { Module } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { AnswersController } from './answers.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [AnswersController],
  providers: [AnswersService],
  imports: [AuthModule]
})
export class AnswersModule {}
