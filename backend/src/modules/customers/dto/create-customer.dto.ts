import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCustomerDto {
    @IsOptional()
    @IsString()
    id?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    request_id: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    quote_id: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    identification: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    credit_card_holder_name: string;

    @ApiProperty({ required: false })
    @IsOptional() 
    @IsString()
    gender?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    birthdate?: Date;
    
    @ApiProperty({ required: false })
    @IsOptional() 
    @IsString()
    email?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    phone: string;
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    country: string;
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    city: string;
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    address: string;
}
