import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { jwtConstants } from './constants/jwt.constants';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
   UsersModule,
   JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (ConfigService: ConfigService) => ({
      secret: ConfigService.get<string>('JWT_SECRET_CONSTANT'),
    }),
    inject: [ConfigService]
   })
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule]
})
export class AuthModule {}
