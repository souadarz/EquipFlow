import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Maintenance, MaintenanceDocument } from './schemas/maintenance.schema';
import { Model, Types } from 'mongoose';
import { Equipement, EquipementDocument } from 'src/equipements/schemas/equipement.schema';
import { EquipementStatus } from '@repo/shared';
import { CloseMaintenanceDto } from './dto/close-maintenance.dto';

@Injectable()
export class MaintenanceService {
  constructor(
    @InjectModel(Maintenance.name)
    private readonly maintenanceModel: Model<MaintenanceDocument>,

    @InjectModel(Equipement.name)
    private readonly equipementModel: Model<EquipementDocument>,
  ) { }

  async create(
    createMaintenanceDto: CreateMaintenanceDto,
  ): Promise<Maintenance> {
    //verifier l'existance de l'equipement
    const equipement = await this.equipementModel
      .findById(createMaintenanceDto.equipement)
      .lean();

    if (!equipement) {
      throw new NotFoundException(
        `Équipement #${createMaintenanceDto.equipement} introuvable`,
      );
    }

    //verifier si l'equip est deja en maintenance
    if (equipement.status === EquipementStatus.EN_MAINTENANCE) {
      throw new ConflictException(
        'Cet équipement est déjà en maintenance.',
      );
    }

    //verifier que l'equip n'est pas reservé
    if (equipement.status === EquipementStatus.RESERVE) {
      throw new ConflictException(
        'cet équipement est actuellement réservé. Annulez la réservation avant de lancer une maintenance.',
      );
    }

    const now = new Date();
    const startDate = new Date(createMaintenanceDto.startDate);

    if (startDate < now) {
      throw new BadRequestException(
        'La date de début doit être supérieure ou égale à maintenant.',
      );
    }

    const maintenance = await this.maintenanceModel.create({
      equipement: new Types.ObjectId(createMaintenanceDto.equipement),
      startDate: new Date(createMaintenanceDto.startDate),
      // endDate: createMaintenanceDto.endDate ? new Date(createMaintenanceDto.endDate) : null,
      description: createMaintenanceDto.description ?? '',
    });

    await this.equipementModel.findByIdAndUpdate(createMaintenanceDto.equipement, {
      status: EquipementStatus.EN_MAINTENANCE,
    });

    return maintenance;
  }

  async findAll(): Promise<Maintenance[]> {
    return this.maintenanceModel
      .find()
      .populate('equipement', 'name status')
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  async findOne(id: Types.ObjectId): Promise<Maintenance> {
    const maintenance = await this.maintenanceModel
      .findById(id)
      .populate('equipement', 'name status')
      .lean()
      .exec();

    if (!maintenance) {
      throw new NotFoundException(`Maintenance non trouvée`);
    }

    return maintenance;
  }

  update(id: Types.ObjectId, updateMaintenanceDto: UpdateMaintenanceDto) {
    return 'This action updates a maintenance';
  }

  // close maintenance
  async close(
    id: Types.ObjectId,
    closeMaintenanceDto: CloseMaintenanceDto,
  ): Promise<Maintenance> {
    const maintenance = await this.maintenanceModel.findById(id).lean();

    if (!maintenance) {
      throw new NotFoundException(`Maintenance introuvable`);
    }

    if (maintenance.endDate) {
      throw new ConflictException('Cette maintenance est déjà clôturée.');
    }

    if (new Date(closeMaintenanceDto.endDate) <= maintenance.startDate) {
      throw new BadRequestException(
        'La date de fin doit être postérieure à la date de début.',
      );
    }

    const updated = await this.maintenanceModel
      .findByIdAndUpdate(
        id,
        {
          endDate: new Date(closeMaintenanceDto.endDate),
          description: closeMaintenanceDto.description ?? maintenance.description,
        },
        { new: true },
      )
      .populate('equipement', 'name')
      .lean()
      .exec();

    if (!updated) {
      throw new NotFoundException("maintenance non trouvée")
    }

    // Remettre l'équipement disponible
    await this.equipementModel.findByIdAndUpdate(
      maintenance.equipement,
      { status: EquipementStatus.DISPONIBLE },
    );
    return updated;
  }

  async remove(id: Types.ObjectId): Promise<void> {
    const maintenance = await this.maintenanceModel.findById(id).lean();

    if (!maintenance) {
      throw new NotFoundException("Maintenance introuvable");
    }

    // On ne supprime que les maintenances clôturées
    if (!maintenance.endDate) {
      throw new ConflictException(
        'Impossible de supprimer une maintenance en cours. Clôturez-la d\'abord.',
      );
    }

    await this.maintenanceModel.findByIdAndDelete(id);
  }
}
