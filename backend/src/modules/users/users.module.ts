import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma.service';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [UsersService, PrismaService],
  exports: [
    UsersService
  ],
  controllers: [UsersController],
  imports: [forwardRef(() => AuthModule )]
})
export class UsersModule {}
 