import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { EquipementStatus } from '@equipflow/types';

export class CreateEquipementDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(EquipementStatus)
  status?: EquipementStatus;

  @IsMongoId()
  category!: string;
}
