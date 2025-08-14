import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateProviderDto {
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    nit: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    phone: string;

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsNumber()
    country_id: number;

    @ApiProperty()
    @IsNumber()
    state_id: number;

    @ApiProperty()
    @IsNumber()
    city_id: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    address: string;

    @IsOptional()
    cities_preferences?: number[];

    @ApiProperty()
    @IsNumber()
    percentage_of_rent: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    allowed_payment_method: string;
}
