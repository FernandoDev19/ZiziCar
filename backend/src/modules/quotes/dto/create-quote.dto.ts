import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength } from "class-validator";

export class CreateQuoteDto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    request_id: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    renter_id: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    phone_client: string;

    @ApiProperty()
    @IsNumber()
    @Max(999999999)
    rent: number;

    @ApiProperty()
    @IsNumber()
    @Max(999999999)
    overtime: number;

    @ApiProperty()
    @IsNumber()
    @Max(999999999)
    home_delivery: number;

    @ApiProperty()
    @IsNumber()
    @Max(999999999)
    home_collection: number;

    @ApiProperty()
    @IsNumber()
    @Max(999999999)
    return_or_collection_different_city: number;

    @ApiProperty()
    @IsNumber()
    total_value: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    brand: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    transmission: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    model: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    color: string;

    @IsOptional()
    fuel?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    plate_end_in: string;

    @ApiProperty()
    @IsNumber()
    @Max(999999999)
    value_to_block_on_credit_card: number;

    @IsOptional()
    paymentMethodForWarranty: string[];

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    allowed_payment_method: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    available_kilometers: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(4)
    percentage_of_total_value: string;

    @ApiProperty()
    @IsNumber()
    percentage_in_values: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    comments?: string;
}