import { Module } from '@nestjs/common';
import { EquipementService } from './equipement.service';
import { EquipementController } from './equipement.controller';

@Module({
  controllers: [EquipementController],
  providers: [EquipementService],
})
export class EquipementModule {}
