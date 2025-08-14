import { Transform } from "class-transformer";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { Role } from "src/common/enums/role.enum";

export class RegisterDto{
    @Transform(({value}) => value.trim())
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @MaxLength(199)
    email: string;

    @Transform(({value}) => value.trim())
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;

    @IsOptional()
    @Transform(({value}) => value.trim())
    @IsString()
    provider_id?: string;

    @IsOptional()
    @IsEnum(Role)
    role?: Role;
}