import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RequestsProvidersService } from './requests_providers.service';
import { CreateRequestsProviderDto } from './dto/create-requests_provider.dto';
import { UpdateRequestsProviderDto } from './dto/update-requests_provider.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';

@Controller('requests-providers')
export class RequestsProvidersController {
  constructor(private readonly requestsProvidersService: RequestsProvidersService) {}

  @Get(':requestId/:renterId')
  @Auth(Role.ADMIN)
  findOne(@Param('requestId') requestId: string, @Param('renterId') renterId: string) {
    return this.requestsProvidersService.findAllByProviderRequest(requestId, renterId);
  }

  @Get(':requestId')
  @Auth(Role.ADMIN)
  findOneByRequest(@Param('requestId') requestId: string,) {
    return this.requestsProvidersService.findAllByRequest(requestId);
  }

}
