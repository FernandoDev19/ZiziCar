import { IsNotEmpty, IsNumber, IsString, Max, MaxLength } from "class-validator";

export class ReservationConfirmationData{
  @IsString()
  @IsNotEmpty()
    vehicle: string;
    
    @IsString()
    @IsNotEmpty()
    transmission: string;
    
    @IsNumber()
    model: number;

    @IsString()
    @IsNotEmpty()
    entryCity: string;

    @IsString()
    @IsNotEmpty()
    entryDateAndTime: string;

    @IsNumber()
    days: number;

    @IsNumber()
    totalOfRent: number;

    @IsString()
    @IsNotEmpty()
    percentageOfRent: string; 

    @IsNumber()
    percentageInValues: number;
    
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    agency: string;

    @IsNotEmpty()
    phones: string[];

    @IsNotEmpty()
    contact: string[];

    @IsNotEmpty()
    city: string[];

    @IsNotEmpty()
    address: string[];

    @IsNotEmpty()
    ids: string[];
  }
  