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

  @IsString()
  @IsNotEmpty()
  serialNumber!: string;

  @IsMongoId()
  category!: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
