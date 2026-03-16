import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { EquipementStatus } from '@equipflow/types';
import { Category } from '../../categories/schemas/category.schema';

export type EquipementDocument = Equipement & Document;

@Schema({ timestamps: true })
export class Equipement {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true, default: '' })
  description: string;

  @Prop({
    type: String,
    enum: EquipementStatus,
    default: EquipementStatus.DISPONIBLE,
  })
  status: EquipementStatus;

  @Prop({ type: Types.ObjectId, ref: Category.name, required: true })
  category: Types.ObjectId;
}

export const EquipementSchema = SchemaFactory.createForClass(Equipement);

// Index pour filtrer rapidement par status et catégorie
EquipementSchema.index({ status: 1 });
EquipementSchema.index({ category: 1 });
EquipementSchema.index({ status: 1, category: 1 });
