import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/common/interfaces/active-user.interface';
import { CreateUserDto } from './dto/create-user.dto';

@Auth(Role.ADMIN)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService){}

    @Get()
    findAll(@ActiveUser() user: UserActiveInterface){
        return this.usersService.findAll(user);
    }

    @Post()
    createUser(@Body() userData: CreateUserDto)
    {
        return this.usersService.create(userData);
    }

    @Delete(':id')
    removeUser(@Param('id') id: string){
        return this.usersService.removeUser(id);
    }
}
