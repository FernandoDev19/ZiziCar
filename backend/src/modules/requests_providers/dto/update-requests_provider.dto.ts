import { PartialType } from '@nestjs/swagger';
import { CreateRequestsProviderDto } from './create-requests_provider.dto';

export class UpdateRequestsProviderDto extends PartialType(CreateRequestsProviderDto) {}
