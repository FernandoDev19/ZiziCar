import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from 'src/core/enums/role.enum';
import { ActiveUser } from 'src/core/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/core/interfaces/active-user.interface';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }
 
  @Auth(Role.ADMIN)
  @Get()
  findAll(@ActiveUser() user: UserActiveInterface) {
    return this.customersService.findAll(user);
  }

  @Auth(Role.ADMIN)
  @Get('without-confirming-payment')
  findAllWithoutConfirmingPayment(@ActiveUser() user: UserActiveInterface){
    return this.customersService.findAllWithoutConfirmingPayment(user);
  }

  @Auth(Role.ADMIN)
  @Get(':phone')
  findOneByPhone(@Param('phone') phone: string) {
    return this.customersService.findOneByPhone( phone);
  }

  @Get('partial/:phone')
  findPartialByPhone(@Param('phone') phone: string){
    return this.customersService.findPartialByPhone(phone);
  }

  @Get('all-conditions/:id')
  findOneByIdWithAllConditionsOfReservation(@Param('id') id: string){
    return this.customersService.findOneByIdWithAllConditionsOfReservation(id);
  }

  @Get('exist/:phone')
  customerWithPhoneExist(@Param('phone') phone: string){
    return this.customersService.customerWithPhoneExist(phone);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Auth(Role.ADMIN)
  @Delete(':id')
  remove(@ActiveUser() user: UserActiveInterface, @Param('id') id: string) {
    return this.customersService.remove(user, id);
  }
}
