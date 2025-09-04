import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { GammaService } from './gamma.service';
import { CreateGammaDto } from './dto/create-gamma.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { S3Service } from 'src/core/services/s3.service';
import { Role } from 'src/core/enums/role.enum';
import { Auth } from '../auth/decorators/auth.decorator';

@ApiTags('gamma')
@Controller('gamma')
export class GammaController {
  constructor(
    private readonly gammaService: GammaService,
    private readonly s3: S3Service
  ) { }

  @Auth(Role.ADMIN)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateGammaDto })
  async createGamma(
    @UploadedFile() file: Express.Multer.File,
    @Body() createGammaDto: CreateGammaDto
  ) {
    const imageUrl = await this.s3.uploadFile(file.buffer, file.filename, file.mimetype);

    return this.gammaService.create({
      ...createGammaDto,
      image_url: imageUrl,
    });
  }

  @Get()
  findAllGammas() {
    return this.gammaService.findAll();
  }

  @Get('get-average-prices')
  getAveragePrices(){
    return this.gammaService.getAveragePrices();
  }

  @Get('find/:id')
  findOneGamma(@Param('id') id: string){
    return this.gammaService.findOne(id);
  }

  @Delete(':id')
  removeGamma(@Param('id') id: string) {
    return this.gammaService.remove(id);
  }
}
