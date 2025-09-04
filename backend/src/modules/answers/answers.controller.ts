import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from 'src/core/enums/role.enum';

@Controller('answers')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @Post()
  @Auth(Role.ADMIN, Role.PROVIDER, Role.EMPLOYE)
  create(@Body() createAnswerDto: CreateAnswerDto) {
    return this.answersService.create(createAnswerDto);
  }

  @Get()
  @Auth(Role.ADMIN)
  findAll() {
    return this.answersService.findAll();
  }

  @Get('by-request/:requestId')
  @Auth(Role.ADMIN)
  findAllByRequest(@Param('requestId') requestId: string){
    return this.answersService.findAllByRequest(requestId);
  }

  @Get(':request_id/:provider_id')
  @Auth(Role.ADMIN, Role.PROVIDER, Role.EMPLOYE)
  findOne(@Param('request_id') request_id: string, @Param('provider_id') provider_id: string) {
    return this.answersService.findOne(request_id, provider_id);
  }
}
