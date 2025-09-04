import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ActiveUser } from 'src/core/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/core/interfaces/active-user.interface';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {};
  
  @Post('login')
  login(@Body() login: LoginDto){
    return this.authService.login(login);
  }

  @Post('register')
  register(@Body() register: RegisterDto){
    return this.authService.register(register);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  profile(@ActiveUser() user: UserActiveInterface){
    return this.authService.profile(user);
  }

  @Get('profile/provider')
  @UseGuards(AuthGuard)
  profileWithProviderData(@ActiveUser() user: UserActiveInterface){
    return this.authService.profileWithProviderData(user);
  }

}
