import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { EquipementStatus } from '@repo/shared';

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
