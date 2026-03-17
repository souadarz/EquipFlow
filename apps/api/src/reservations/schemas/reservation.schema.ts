import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ReservationStatus } from '@repo/shared';
import { User } from '../../users/schemas/user.schema';
import { Equipement } from '../../equipements/schemas/equipement.schema';

export type ReservationDocument = Reservation & Document;

@Schema({ timestamps: true })
export class Reservation {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Equipement.name, required: true })
  equipement!: Types.ObjectId;

  @Prop({ required: true })
  startDate!: Date;

  @Prop({ required: true })
  endDate!: Date;

  @Prop({
    type: String,
    enum: ReservationStatus,
    default: ReservationStatus.ACTIVE,
  })
  status!: ReservationStatus;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);

// Index composé pour détecter les chevauchements efficacement
ReservationSchema.index({ equipement: 1, startDate: 1, endDate: 1 });
ReservationSchema.index({ user: 1, status: 1 });
