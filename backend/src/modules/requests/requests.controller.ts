import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
  BadRequestException,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { MailService } from 'src/core/services/mail.service';
import { MetaService } from 'src/core/services/meta.service';
import { ReservationConfirmationData } from 'src/core/interfaces/reservation-confirmation-data.interface';
import { ProvidersService } from '../providers/providers.service';
import { UserActiveInterface } from 'src/core/interfaces/active-user.interface';
import { Role } from 'src/core/enums/role.enum';
import { Auth } from '../auth/decorators/auth.decorator';
import { ActiveUser } from 'src/core/decorators/active-user.decorator';
import { UsersService } from '../users/users.service';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('requests')
export class RequestsController {
  constructor(
    private readonly requestsService: RequestsService,
  ) {}

  @Post()
  async createRequest(@Body() createRequestDto: CreateRequestDto) {
    const request = await this.requestsService.create({
      name: createRequestDto.name,
      email: createRequestDto.email,
      phone: createRequestDto.phone,
      devolution_date: createRequestDto.devolution_date,
      receive_at_airport: createRequestDto.receive_at_airport,
      returns_at_airport: createRequestDto.returns_at_airport,
      entry_date: createRequestDto.entry_date,
      devolution_time: createRequestDto.devolution_time,
      entry_time: createRequestDto.entry_time,
      gamma: { connect: { id: createRequestDto.gamma_id } },
      ZIC_ADM_TRANSMISSION: { connect: { id: createRequestDto.transmission_id } },
      ZIC_REQ_CITIES_ZIC_REQ_REQUESTS_id_devolution_cityToZIC_REQ_CITIES: {
        connect: { id: createRequestDto.id_devolution_city },
      },
      ZIC_REQ_CITIES_ZIC_REQ_REQUESTS_id_entry_cityToZIC_REQ_CITIES: {
        connect: { id: createRequestDto.id_entry_city },
      },
      comments: createRequestDto.comments
    });

    return request; 
  }

  @Get()
  @Auth(Role.ADMIN, Role.PROVIDER, Role.EMPLOYE)
  findAllRequest(@ActiveUser() user: UserActiveInterface) {
    return this.requestsService.findAll(user);
  }

  @Get('count/:condition')
  @Auth(Role.ADMIN, Role.PROVIDER, Role.EMPLOYE)
  countAll(@ActiveUser() user: UserActiveInterface, @Param('condition') condition: string){
    return this.requestsService.countAll(user, condition);
  }

  @Get(':id')
  findOneRequest(@Param('id') id: string) {
    return this.requestsService.findOne(id);
  }

  @Post('send-reservation-confirmation')
  sendReservationConfirmation(@Body() data: ReservationConfirmationData) {
      return this.requestsService.sendReservationConfirmation(data);
  }

  @Post('send-reservation-alert')
  sendReservationAlert(@Body() data: { customerId: string; requestId: string; quoteId: string}){
    return this.requestsService.sendReservationAlert(data);
  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  removeRequest(@ActiveUser() user: UserActiveInterface, @Param('id') id: string){
    return this.requestsService.remove(user, id);
  }

  @Post('send-messages')
  @Auth(Role.ADMIN)
  sendMessages(){
    return this.requestsService.sendMessages();
  }
}
