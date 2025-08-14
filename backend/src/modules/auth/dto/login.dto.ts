import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { Transform } from "class-transformer";

export class LoginDto{
    @IsEmail()
    @MaxLength(199)
    email: string;

    @Transform(({value}) => value.trim())
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;
}