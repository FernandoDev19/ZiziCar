import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/common/interfaces/active-user.interface';

@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Post()
  create(@Body() createProviderDto: CreateProviderDto) {
    return this.providersService.create(createProviderDto);
  }

  @Get()
  @Auth(Role.ADMIN)
  findAll(@ActiveUser() user: UserActiveInterface) {
    return this.providersService.findAll(user);
  }

  @Get(':nit')
  @Auth(Role.ADMIN)
  findOneWithNit(@Param('nit') nit: string) {
    return this.providersService.findOneWithNit(nit);
  }

  @Get('id/:id')
  @Auth(Role.ADMIN)
  findOneWithId(@Param('id') id: string){
    return this.providersService.findOneWithId(id);
  } 

  @Get('partial/id/:id')
  findOnePartialProvider(@Param('id') id: string){
    return this.providersService.findOnePartialProvider(id);
  }

  @Auth(Role.ADMIN)
  @Delete(':id')
  removeUser(@Param('id') id: string){
      return this.providersService.remove(id);
  }
}
