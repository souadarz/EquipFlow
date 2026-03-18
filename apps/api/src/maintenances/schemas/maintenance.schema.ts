import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types }             from 'mongoose';
import { Equipement }                  from '../../equipements/schemas/equipement.schema';

export type MaintenanceDocument = Maintenance & Document;

@Schema({ timestamps: true })
export class Maintenance {
  @Prop({ type: Types.ObjectId, ref: Equipement.name, required: true })
  equipement!: Types.ObjectId;

  startDate!: Date;

  @Prop()
  endDate?: Date;

  @Prop({ trim: true, default: '' })
  description!: string;
}

export const MaintenanceSchema = SchemaFactory.createForClass(Maintenance);

MaintenanceSchema.index({ equipement: 1 });
MaintenanceSchema.index({ equipement: 1, endDate: 1 });