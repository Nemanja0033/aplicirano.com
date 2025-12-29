import { IsDateString, IsNotEmpty, IsString } from "class-validator";

export class StatsQueryDto {
    @IsNotEmpty()
    @IsDateString()
    start: string

    @IsNotEmpty()
    @IsDateString()
    end: string
}