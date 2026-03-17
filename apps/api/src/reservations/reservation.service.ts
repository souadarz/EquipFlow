import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation, ReservationDocument } from './schemas/reservation.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Equipement,
  EquipementDocument,
} from 'src/equipements/schemas/equipement.schema';
import { EquipementStatus, ReservationStatus } from '@repo/shared';

@Injectable()
export class ReservationService {
  constructor(
    @InjectModel(Reservation.name)
    private readonly reservationModel: Model<ReservationDocument>,

    @InjectModel(Equipement.name)
    private readonly equipementModel: Model<EquipementDocument>,
  ) {}
  async create(
    createReservationDto: CreateReservationDto,
    userId: Types.ObjectId,
  ): Promise<Reservation> {
    const startDate = new Date(createReservationDto.startDate);
    const endDate = new Date(createReservationDto.endDate);

    if (endDate <= startDate) {
      throw new BadRequestException(
        'la date de fin doit être postérieure à la date de début.',
      );
    }

    const equipement = await this.equipementModel
      .findById(createReservationDto.equipement)
      .lean();

    if (!equipement) {
      throw new NotFoundException(`Équipement introuvable`);
    }

    const NON_RESERVABLE = [
      EquipementStatus.EN_MAINTENANCE,
      EquipementStatus.HORS_SERVICE,
    ];
    if (NON_RESERVABLE.includes(equipement.status)) {
      throw new ConflictException(
        `Cet équipement est "${equipement.status}" et ne peut pas être réservé.`,
      );
    }

    const reservation = await this.reservationModel.create({
      equipement: new Types.ObjectId(createReservationDto.equipement),
      user: userId,
      startDate,
      endDate,
      status: ReservationStatus.ACTIVE,
    });

    await this.equipementModel.findByIdAndUpdate(createReservationDto.equipement, {
      status: EquipementStatus.RESERVE,
    });

    return reservation;
  }
  }

  findAll() {
    return `This action returns all reservation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reservation`;
  }

  update(id: number, updateReservationDto: UpdateReservationDto) {
    return `This action updates a #${id} reservation`;
  }

  remove(id: number) {
    return `This action removes a #${id} reservation`;
  }
}
