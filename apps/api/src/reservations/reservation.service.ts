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
import { AuthUser, EquipementStatus, ReservationStatus, Role } from '@repo/shared';
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
    userId: string,
  ): Promise<Reservation> {
    const userObjectId = new Types.ObjectId(userId);
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

    // verification du conflicts et calcul de la quantité déjà réservée
    const overlappingReservations = await this.reservationModel.find({
      equipement: new Types.ObjectId(createReservationDto.equipement),
      status: {
        $in: [ReservationStatus.ACTIVE, ReservationStatus.CONFIRME],
      },
      $or: [
        { startDate: { $lt: endDate }, endDate: { $gt: startDate } },
      ],
    }).lean();

    const usedQuantity = overlappingReservations.reduce((acc, res) => acc + (res.quantity || 1), 0);
    const requestedQuantity = createReservationDto.quantity || 1;
    const totalQuantity = equipement.quantity || 1;

    if (usedQuantity + requestedQuantity > totalQuantity) {
      const available = totalQuantity - usedQuantity;
      throw new ConflictException(
        `Cet équipement n'a pas assez de stock pour ces dates. Restant: ${available > 0 ? available : 0}.`,
      );
    }

    // creation
    const reservation = await this.reservationModel.create({
      equipement: new Types.ObjectId(createReservationDto.equipement),
      user: userObjectId,
      startDate,
      endDate,
      quantity: requestedQuantity,
      status: ReservationStatus.ACTIVE,
    });

    // Optionnel : Mettre à jour le statut seulement si tout est réservé
    if (usedQuantity + requestedQuantity === totalQuantity) {
      await this.equipementModel.findByIdAndUpdate(
        createReservationDto.equipement,
        { status: EquipementStatus.RESERVE },
      );
    }

    return reservation;
  }

  async findAll(
    query: QueryReservationDto,
    currentUser: AuthUser,
  ) {
    const { status, equipement, user, from, to, page = 1, limit = 20 } = query;

    const filter: any = {};

    // role
    if (currentUser.role === Role.USER) {
      filter.user = new Types.ObjectId(currentUser.id);
    } else if (user) {
      filter.user = new Types.ObjectId(user);
    }

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
      .populate('equipement', 'name status')
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
    currentUser: AuthUser,
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

  // update reservation
  async update(
    id: Types.ObjectId,
    updateReservationDto: UpdateReservationDto,
    currentUser: AuthUser,
  ): Promise<Reservation> {
    const reservation = await this.reservationModel.findById(id).lean();

    if (!reservation) {
      throw new NotFoundException(`Réservation introuvable`);
    }

    // Seul le propriétaire ou un admin peut modifier
    this.assertOwnerOrAdmin(reservation.user, currentUser);

    // Un user ne peut qu'annuler sa réservation
    if (
      currentUser.role === Role.USER &&
      updateReservationDto.status !== ReservationStatus.ANNULE
    ) {
      throw new ForbiddenException(
        'Vous pouvez uniquement annuler votre réservation.',
      );
    }

    const CLOSED_STATUSES = [
      ReservationStatus.ANNULE,
      ReservationStatus.COMPLETE,
    ];
    if (CLOSED_STATUSES.includes(reservation.status)) {
      throw new ConflictException(
        `Impossible de modifier une réservation "${reservation.status}".`,

      );
    }

    const updated = await this.reservationModel
      .findByIdAndUpdate(id, { status: updateReservationDto.status }, { new: true })
      .populate('equipement', 'name status')
      .populate('user', 'fullname email')
      .lean()
      .exec();

    if (!updated) {
      throw new NotFoundException("reservation non trouvée")
    }

    if (updateReservationDto.status && CLOSED_STATUSES.includes(updateReservationDto.status)) {
      await this.equipementModel.findByIdAndUpdate(
        reservation.equipement,
        { status: EquipementStatus.DISPONIBLE },
      );
    }

    return updated;
  }

  // delete reservation
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
    currentUser: AuthUser,
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
