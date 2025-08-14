import { PartialType } from '@nestjs/swagger';
import { CreateGammaDto } from './create-gamma.dto';

export class UpdateGammaDto extends PartialType(CreateGammaDto) {}
