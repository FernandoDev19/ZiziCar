import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { Role } from 'src/core/enums/role.enum';
import { Auth } from '../auth/decorators/auth.decorator';
import { ActiveUser } from 'src/core/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/core/interfaces/active-user.interface';

@Controller('quotes')
export class QuotesController {
  constructor(private quoteService: QuotesService) {}
  @Post()
  @Auth(Role.ADMIN, Role.PROVIDER, Role.EMPLOYE)
  async createQuote(@ActiveUser() user: UserActiveInterface, @Body() quote: CreateQuoteDto) {
    return this.quoteService.create(user, quote);
  }

  @Get()
  @Auth(Role.ADMIN)
  async findAll(@ActiveUser() user: UserActiveInterface) {
    return this.quoteService.findAll(user);
  }

  @Auth(Role.ADMIN)
  @Get('by-request/:requestId')
  findAllWhereRequestId(@Param('requestId') requestId: string){
    return this.quoteService.findAllWhereRequestId(requestId);
  }

  @Get(':id')
  async findOneWithId(@Param('id') id: string) {
    return this.quoteService.findOneWithId(id);
  }

  @Get('for-additional-information/:quoteId')
  async findQuoteWithIdForAdditionalInformation(@Param('quoteId') quoteId: string){
    return this.quoteService.findQuoteWithIdForAdditionalIformation(quoteId);
  }

  @Get('requests-with-quote/:requestId/:renterId')
  @Auth(Role.ADMIN, Role.PROVIDER, Role.EMPLOYE)
  quoteExist(@Param('requestId') requestId: string, @Param('renterId') renterId: string){
    return this.quoteService.quoteExist(requestId, renterId);
  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  delete(@Param('id') id: string){
    return this,this.quoteService.remove(id);
  }
}
