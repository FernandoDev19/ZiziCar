import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserActiveInterface } from 'src/core/interfaces/active-user.interface';
import { Role } from 'src/core/enums/role.enum';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UsersService {

  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) { 
    const userExists = await this.prisma.user.findFirst({
      where: {
        email: createUserDto.email
      }
    });

    if (userExists) {
      throw new BadRequestException(
        'Este correo ya esta asociado a un usuario.',
      );
    } 

    try {
      return await this.prisma.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          password: await bcryptjs.hash(createUserDto.password, 10),
          provider_id: createUserDto.provider_id || null,
          role: createUserDto.role || Role.USER
        }
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOneById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id
      }
    });

    if(!user){
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findOneByEmail(email: string){
    const user = await this.prisma.user.findFirst({
      where: {
        email: email
      }
    });

    if(!user){
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findOneByEmailAndProviderData(email: string){
    const user = await this.prisma.user.findFirst({
      where: {
        email: email
      },
      include: {
        provider: true
      }
    });

    if(!user){
      throw new NotFoundException('User not found');
    }

    return user.provider;
  }

  async findAll(user: UserActiveInterface){

    if(user.role != Role.ADMIN){
      throw new UnauthorizedException();
    }

    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        provider_id: true,
        role: true,
        created_at: true,
        updated_at: true,
        provider: true,
      },
    });

    if (!users || users.length === 0){
      throw new NotFoundException('Users not found');
    }

    return users;
  }

  async findAllAdmins(user: UserActiveInterface){

    if(user.role != Role.ADMIN){
      throw new UnauthorizedException();
    }

    const admins = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        provider_id: true,
        role: true,
        created_at: true,
        updated_at: true,
        provider: true,
      },
      where: {
        role: Role.ADMIN
      }
    });

    if (!admins || admins.length === 0){
      throw new NotFoundException('Admins not found');
    }

    return admins;
  }

  async findAllProviders(user: UserActiveInterface){

    if(user.role != Role.ADMIN){
      throw new UnauthorizedException();
    }

    const providers = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        provider_id: true,
        role: true,
        created_at: true,
        updated_at: true,
        provider: true,
      },
      where: {
        role: Role.PROVIDER
      }
    });

    if (!providers || providers.length === 0){
      throw new NotFoundException('Providers not found');
    }

    return providers;
  }


  async removeUser(id: string){
    const userToDelete = await this.findOneById(id);

    await this.prisma.user.delete({
      where: {
        id: id
      }
    });

    return userToDelete;
  }
}
