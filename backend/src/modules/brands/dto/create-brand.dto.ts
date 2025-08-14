import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsString, Max, MaxLength } from "class-validator";

export class CreateBrandDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @ApiProperty()
    @IsNumber()
    @Max(11)
    doors: number;

    @ApiProperty()
    @IsNumber()
    @Max(20)
    positions: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    gamma_id: string;

    @ApiProperty()
    @IsNumber()
    @Max(20)
    large_suitcases: number;

    @ApiProperty()
    @IsNumber()
    @Max(20)
    small_suitcases: number;

    @ApiProperty()
    @IsNumber()
    @Max(999999)
    cylinder_capacity: string;

    @ApiProperty({
        description: 'Imagen a subir',
        type: 'string',
        format: 'binary',
    })
    generic_image: any;
}
