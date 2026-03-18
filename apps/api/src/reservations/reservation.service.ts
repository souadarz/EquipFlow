import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation, ReservationDocument } from './schemas/reservation.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Equipement,
  EquipementDocument,
} from 'src/equipements/schemas/equipement.schema';
import { EquipementStatus, ReservationStatus, Role } from '@repo/shared';
import { QueryReservationDto } from './dto/query-reservetion.dto';

@Injectable()
export class ReservationService {
  constructor(
    @InjectModel(Reservation.name)
    private readonly reservationModel: Model<ReservationDocument>,

    @InjectModel(Equipement.name)
    private readonly equipementModel: Model<EquipementDocument>,
  ) { }
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

    // verifier que l'equip peut etre reserver
    const NON_RESERVABLE = [
      EquipementStatus.EN_MAINTENANCE,
      EquipementStatus.HORS_SERVICE,
    ];
    if (NON_RESERVABLE.includes(equipement.status)) {
      throw new ConflictException(
        `Cet équipement est "${equipement.status}" et ne peut pas être réservé.`,
      );
    }

    //verification du conflicts 
    const conflict = await this.reservationModel.findOne({
      equipement: new Types.ObjectId(createReservationDto.equipement),
      status: {
        $in: [ReservationStatus.ACTIVE, ReservationStatus.CONFIRME],
      },
      $or: [
        { startDate: { $lt: endDate }, endDate: { $gt: startDate } },
      ],
    });

    if (conflict) {
      throw new ConflictException(
        `Cet équipement est déjà réservé du ${conflict.startDate.toLocaleDateString()} au ${conflict.endDate.toLocaleDateString()}.`,
      );
    }

    // creation
    const reservation = await this.reservationModel.create({
      equipement: new Types.ObjectId(createReservationDto.equipement),
      user: userId,
      startDate,
      endDate,
      status: ReservationStatus.ACTIVE,
    });

    await this.equipementModel.findByIdAndUpdate(
      createReservationDto.equipement,
      {
        status: EquipementStatus.RESERVE,
      },
    );

    return reservation;
  }

  async findAll(
    query: QueryReservationDto,
    currentUser: { id: Types.ObjectId; role: Role },
  ) {
    const { status, equipement, user, from, to, page = 1, limit = 20 } = query;

    const filter: any = {};

    // rôle
    if (currentUser.role === Role.USER) {
      filter.user = currentUser.id;
    } else if (user) {
      filter.user = new Types.ObjectId(user);
    }

    // filtres simples
    if (status) filter.status = status;
    if (equipement) filter.equipement = new Types.ObjectId(equipement);

    // dates
    if (from || to) {
      filter.startDate = {};
      if (from) filter.startDate.$gte = new Date(from);
      if (to) filter.startDate.$lte = new Date(to);
    }

    const skip = (page - 1) * limit;

    const data = await this.reservationModel
      .find(filter)
      .populate('equipement', 'code name status')
      .populate('user', 'fullname email')
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await this.reservationModel.countDocuments(filter);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(
    id: Types.ObjectId,
    currentUser: { id: Types.ObjectId; role: Role },
  ): Promise<Reservation> {
    const reservation = await this.reservationModel
      .findById(id)
      .populate('equipement', 'name status')
      .populate('user', 'fullname email')
      .lean()
      .exec();

    if (!reservation) {
      throw new NotFoundException(`Réservation introuvable`);
    }

    // Un user ne peut voir que ses propres réservations
    this.assertOwnerOrAdmin(reservation.user._id, currentUser);

    return reservation;
  }

  update(id: number, updateReservationDto: UpdateReservationDto) {
    return `This action updates a #${id} reservation`;
  }

  async remove(id: Types.ObjectId): Promise<void> {
    const reservation = await this.reservationModel.findById(id).lean();

    if (!reservation) {
      throw new NotFoundException('Réservation introuvable');
    }

    // verification du status du reservation (annulée ou complétée) avant supprimer
    const DELETABLE = [ReservationStatus.ANNULE, ReservationStatus.COMPLETE];
    if (!DELETABLE.includes(reservation.status)) {
      throw new ConflictException(
        `Impossible de supprimer une réservation "${reservation.status}". Annulez-la d'abord.`,
      );
    }

    await this.reservationModel.findByIdAndDelete(id);
  }

  private assertOwnerOrAdmin(
    ownerId: Types.ObjectId,
    currentUser: { id: Types.ObjectId; role: Role },
  ): void {
    const isOwner = ownerId.toString() === currentUser.id.toString();
    const isAdmin = currentUser.role === Role.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        "Vous n'avez pas accès à cette réservation.",
      );
    }
  }
}
