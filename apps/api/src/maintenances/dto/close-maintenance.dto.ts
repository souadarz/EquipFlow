import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class CloseMaintenanceDto {
  @IsDateString()
  endDate!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}