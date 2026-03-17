import { IsEnum, IsOptional } from 'class-validator';
import { ReservationStatus } from '@repo/shared';

export class UpdateReservationDto {
  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus;
}
