import { ReservationStatus } from "@repo/shared";
import { Type } from "class-transformer";
import { IsDateString, IsEnum, IsInt, IsMongoId, IsOptional, Max, Min } from "class-validator";

export class QueryReservationDto {
    @IsOptional()
    @IsEnum(ReservationStatus)
    status?: ReservationStatus;

    @IsOptional()
    @IsMongoId()
    equipement?: string;

    @IsOptional()
    @IsMongoId()
    user?: string;

    @IsOptional()
    @IsDateString()
    from?: string;

    @IsOptional()
    @IsDateString()
    to?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(500)
    limit?: number = 60;
}