import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateAnswerDto {

    @IsString()
    @IsNotEmpty()
    request_id: string;

    @IsString()
    @IsNotEmpty()
    renter_id: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    answer_type: string;

    @IsOptional()
    @IsString()
    category?: string;
}
