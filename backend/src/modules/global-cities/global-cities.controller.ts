import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { GlobalCitiesService } from './global-cities.service';
import { CreateGlobalCityDto } from './dto/create-global-city.dto';
import { UpdateGlobalCityDto } from './dto/update-global-city.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';

@Controller('global-cities')
export class GlobalCitiesController {
  constructor(private readonly globalCitiesService: GlobalCitiesService) {}

  @Auth(Role.ADMIN)
  @Post()
  create(@Body() createGlobalCityDto: CreateGlobalCityDto) {
    return this.globalCitiesService.create(createGlobalCityDto);
  }

  @Get()
  findAll() {
    return this.globalCitiesService.findAll();
  }

  @Get('by-state/:stateId')
  findAllByState(@Param('stateId') stateId: string){
    return this.globalCitiesService.findAllByState(+stateId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.globalCitiesService.findOne(+id);
  }

  @Auth(Role.ADMIN)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateGlobalCityDto: UpdateGlobalCityDto) {
    return this.globalCitiesService.update(+id, updateGlobalCityDto);
  }

  @Auth(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.globalCitiesService.remove(+id);
  }
}
