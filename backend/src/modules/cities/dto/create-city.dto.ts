import { ApiProperty } from "@nestjs/swagger";

export class CreateCityDto {

    @ApiProperty()
    name: string;

    @ApiProperty()
    state_id: number;

}
