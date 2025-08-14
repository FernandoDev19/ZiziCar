import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { PrismaService } from 'src/prisma.service';
import { MetaService } from 'src/core/services/meta.service';

@Injectable()
export class AnswersService {
  constructor(private prismaService: PrismaService, private metaService: MetaService){}

  async create(createAnswerDto: CreateAnswerDto) {
    const { request_id, renter_id } = createAnswerDto;
  
    const requestExist = await this.prismaService.request.findUnique({
      where: {
        id: request_id
      }
    })

    if(!requestExist){
      throw new NotFoundException('Request not found');
    }

    const quoteOrAnswerExist = await this.prismaService.request.findFirst({
      where: {
        id: request_id,
        OR: [
          {
            ZIC_ADM_QUOTES: {
              some: {
                renter_id: renter_id,
              },
            },
          },
          {
            ZIC_REQ_ANSWERS: {
              some: { 
                renter_id: renter_id
              },
            },
          },
        ],
      },
    });
    
  
    if (quoteOrAnswerExist) {
      throw new BadRequestException('Quote or Answer already exists');
    }
  
    try {
      const result = await this.prismaService.$transaction(async (prisma) => {
        const answerCreated = await prisma.zIC_REQ_ANSWERS.create({
          data: createAnswerDto,
        });

        if(answerCreated.answer_type === 'Agotado'){
          this.sendExhaustedAnswer(request_id, renter_id);
        }
  
        await prisma.request.update({
          where: { id: request_id },
          data: { answers: { increment: 1 } },
        });
  
        return answerCreated;
      });
  
      return result;
    } catch (error) {
      throw new BadRequestException('Error al crear la respuesta.', error);
    }
  }
  

  async findAll() {
    const answers = await this.prismaService.zIC_REQ_ANSWERS.findMany();

    if(answers.length === 0){
      throw new NotFoundException('Requests not found');
    }

    return answers;
  }

  async findAllByRequest(requestId: string){
    const answers = await this.prismaService.zIC_REQ_ANSWERS.findMany({
      where: {
        request_id: requestId
      }
    });

    if(answers.length === 0){
      throw new NotFoundException('Answers by request ' + requestId + ' not found');
    }

    return answers;
  }

  async findOne(request_id: string, provider_id: string) {
    const answer = await this.prismaService.zIC_REQ_ANSWERS.findFirst({
      where: {
        request_id: request_id,
        renter_id: provider_id
      }
    });

    return answer;
  }

  async answerExist(requestId: string, renterId: string){
    const quote = await this.prismaService.zIC_ADM_QUOTES.findFirst({
      where: {
        request_id: requestId,
        renter_id: renterId
      }
    });

    const answer = await this.prismaService.zIC_REQ_ANSWERS.findFirst({
      where: {
        request_id: requestId,
        renter_id: renterId
      }
    })

    if(quote || answer){
      return true;
    }

    return false;
  }

  private async sendExhaustedAnswer(request_id: string, renter_id: string){
    const data = await this.prismaService.$transaction([
      this.prismaService.request.findFirst({
        where: {
          id: request_id
        },
        select: {
          phone: true
        }
      }),
      this.prismaService.provider.findFirst({
        where: {
          id: renter_id
        },
        include: {
          ZIC_ADM_COUNTRIES: {
            select: {
              name: true
            }
          },
          ZIC_ADM_GLOBAL_CITIES: {
            select: {
              name: true
            }
          }
        }
      })
    ]);

    await this.metaService.sendExhaustedAnswer({
      phone_client: data[0]?.phone,
      provider_name: data[1]?.name,
      country: data[1]?.ZIC_ADM_COUNTRIES?.name || 'Country not found',
      city: data[1]?.ZIC_ADM_GLOBAL_CITIES?.name || 'City not found'
    });
  }
}
