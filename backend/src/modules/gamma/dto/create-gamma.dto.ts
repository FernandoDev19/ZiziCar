import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGammaDto {

    @ApiProperty({
        description: 'Imagen a subir',
        type: 'string',
        format: 'binary',
    })
    image: any; // Tipo 'any' porque es un archivo, y Swagger lo reconoce como un binario

    @ApiProperty({
        description: 'Nombre de la Gamma',
        example: 'SUV',
    })
    @IsString()
    name: string;
    @IsString()
    precio_promedio: string;
}
