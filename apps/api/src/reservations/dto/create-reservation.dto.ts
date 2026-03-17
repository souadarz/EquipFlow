import { IsDateString, IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateReservationDto {
  @IsMongoId()
  equipement!: string;

  @IsNotEmpty()
  @IsDateString()
  startDate!: string;

  @IsNotEmpty()
  @IsDateString()
  endDate!: string;
}
