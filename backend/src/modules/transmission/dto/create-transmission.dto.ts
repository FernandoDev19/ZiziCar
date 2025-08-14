import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransmissionDto {

    @ApiProperty({
        description: 'Imagen a subir',
        type: 'string',
        format: 'binary',
    })
    image: any; // Tipo 'any' porque es un archivo, y Swagger lo reconoce como un binario

    @ApiProperty({
        description: 'Nombre de la transmision',
        example: 'Automatica',
    })
    @IsString()
    name: string;
}
