import { Module } from '@nestjs/common';
import { GeolocationsService } from './geolocations.service';
import { GeolocationsController } from './geolocations.controller';

@Module({
  controllers: [GeolocationsController],
  providers: [GeolocationsService],
})
export class GeolocationsModule {}
