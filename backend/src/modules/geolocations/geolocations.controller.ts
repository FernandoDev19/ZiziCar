import { Controller, Get } from '@nestjs/common';
import { GeolocationsService } from './geolocations.service';

@Controller('geolocations')
export class GeolocationsController {
  constructor(private readonly geolocationsService: GeolocationsService) {}

  @Get()
  findAllCities(){
    return this.geolocationsService.findAllCities();
  }
}
