import {
  IsDateString, IsMongoId,
  IsOptional, IsString, MaxLength,
} from 'class-validator';

export class CreateMaintenanceDto {
  @IsMongoId()
  equipement!: string;

  @IsDateString()
  startDate!: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}