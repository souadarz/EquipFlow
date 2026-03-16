import { Module } from '@nestjs/common';
import { EquipementService } from './equipement.service';
import { EquipementController } from './equipement.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Equipement, EquipementSchema } from './schemas/equipement.schema';
import {
  Category,
  CategorySchema,
} from 'src/categories/schemas/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Equipement.name, schema: EquipementSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [EquipementController],
  providers: [EquipementService],
})
export class EquipementModule {}
