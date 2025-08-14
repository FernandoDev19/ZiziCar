import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserActiveInterface } from 'src/common/interfaces/active-user.interface';
import { PrismaService } from 'src/prisma.service';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private prismaService: PrismaService
  ) {}

  async login({ email, password }: LoginDto) {
    const userExist = await this.prismaService.user.findFirst({
      where: {
        email: email
      }
    })
    if (!userExist) {
      throw new UnauthorizedException('Email or Password is wrong');
    }

    const isPasswordValid = await bcryptjs.compare(
      password,
      userExist.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email or Password is wrong');
    }

    const payload = { email: userExist.email, role: userExist.role };
    const token = await this.jwtService.signAsync(payload);

    return {
      accessToken: token,
    };
  }

  async register(register: RegisterDto) {
    const userExist = await this.prismaService.user.findFirst({
      where: {
        email: register.email
      }
    })
    if (userExist) {
      throw new BadRequestException(
        'Este correo ya esta asociado a un usuario.',
      );
    }

    try {
      await this.userService.create({...register});
      return true;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async profile({ email }: UserActiveInterface) {
    return await this.userService.findOneByEmail(email);
  }

  async profileWithProviderData({ email }: UserActiveInterface) {
    return await this.userService.findOneByEmailAndProviderData(email);
  }
}
