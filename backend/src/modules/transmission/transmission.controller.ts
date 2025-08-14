import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { TransmissionService } from './transmission.service';
import { CreateTransmissionDto } from './dto/create-transmission.dto';
import { S3Service } from 'src/core/services/s3.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/common/interfaces/active-user.interface';

@Controller('transmission')
export class TransmissionController {
  constructor(
    private readonly transmissionService: TransmissionService,
    private readonly s3: S3Service
  ) { }

  @Post()
  @Auth(Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateTransmissionDto })
  async createTransmission(
    @ActiveUser() user: UserActiveInterface,
    @UploadedFile() file: Express.Multer.File,
    @Body() createTransmissionDto: CreateTransmissionDto
  ) {
    const imageUrl = await this.s3.uploadFile(file.buffer, file.filename, file.mimetype);

    return this.transmissionService.create(user, {...createTransmissionDto, image_url: imageUrl});
  }

  @Get()
  async findAll() {
    return this.transmissionService.findAll();
  }

  @Get(':id')
  async findOneTransmission(@Param('id') id: string){
    return this.transmissionService.findOne(id);
  }
}
