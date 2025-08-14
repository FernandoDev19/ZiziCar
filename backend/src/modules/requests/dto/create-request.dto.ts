import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateRequestDto {

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    sent_to?: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    quotes?: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    answers?: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    transmission_id: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    gamma_id: string;

    @ApiProperty()
    @Transform(({value}) => value.trim())
    @IsString()
    @IsNotEmpty()
    phone: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty({required: false})
    @IsOptional()
    @IsString()
    comments?: string;

    @ApiProperty()
    @IsNumber()
    id_entry_city: number;

    @ApiProperty()
    @IsBoolean()
    receive_at_airport: boolean;

    @ApiProperty()
    @IsNumber()
    id_devolution_city: number;

    @ApiProperty()
    @IsBoolean()
    returns_at_airport: boolean;

    @ApiProperty()
    @IsNotEmpty()
    entry_date: Date;

    @ApiProperty()
    @IsNotEmpty()
    devolution_date: Date;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    entry_time: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    devolution_time: string;
}
