import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/common/interfaces/active-user.interface';
import { AuthGuard } from '@nestjs/passport';

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Post()
  @Auth(Role.ADMIN)
  createCity(@ActiveUser() user: UserActiveInterface, @Body() createCityDto: CreateCityDto) {
    return this.citiesService.create(user, {
      name: createCityDto.name,
    });
  }

  @Get()
  findAllCities() {
    return this.citiesService.findAll();
  }

  @Get(':id')
  async findOneCity(@Param('id') id: string){
    return this.citiesService.findOne(id);
  }
}
