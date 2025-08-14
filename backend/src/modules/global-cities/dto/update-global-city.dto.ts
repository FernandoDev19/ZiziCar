import { PartialType } from '@nestjs/swagger';
import { CreateGlobalCityDto } from './create-global-city.dto';

export class UpdateGlobalCityDto extends PartialType(CreateGlobalCityDto) {}
