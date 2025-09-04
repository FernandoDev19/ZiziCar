import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FuelsService } from './fuels.service';
import { CreateFuelDto } from './dto/create-fuel.dto';
import { UpdateFuelDto } from './dto/update-fuel.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from 'src/core/enums/role.enum';

@Controller('fuels')
export class FuelsController {
  constructor(private readonly fuelsService: FuelsService) {}

  @Auth(Role.ADMIN)
  @Post()
  create(@Body() createFuelDto: CreateFuelDto) {
    return this.fuelsService.create(createFuelDto);
  }

  @Auth(Role.ADMIN, Role.PROVIDER, Role.PROVIDER)
  @Get()
  findAll() {
    return this.fuelsService.findAll();
  }

  @Auth(Role.ADMIN, Role.PROVIDER, Role.PROVIDER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fuelsService.findOne(+id);
  }

  @Auth(Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFuelDto: UpdateFuelDto) {
    return this.fuelsService.update(+id, updateFuelDto);
  }

  @Auth(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fuelsService.remove(+id);
  }
}
