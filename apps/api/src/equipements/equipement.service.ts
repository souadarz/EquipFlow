import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEquipementDto } from './dto/create-equipement.dto';
import { UpdateEquipementDto } from './dto/update-equipement.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Equipement, EquipementDocument } from './schemas/equipement.schema';
import { Model, Types } from 'mongoose';
import {
  Category,
  CategoryDocument,
} from 'src/categories/schemas/category.schema';
import { EquipementStatus } from '@repo/shared';
import { QueryEquipementDto } from './dto/QueryEquipementDto';

@Injectable()
export class EquipementService {
  constructor(
    @InjectModel(Equipement.name)
    private readonly equipementModel: Model<EquipementDocument>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) { }
  async create(createEquipementDto: CreateEquipementDto): Promise<Equipement> {
    const existingCategory = await this.categoryModel.exists({
      _id: createEquipementDto.category,
    });
    if (!existingCategory) {
      throw new NotFoundException('Catégorie introuvable');
    }

    const existingEquip = await this.equipementModel.exists({ serialNumber: createEquipementDto.serialNumber });
    if (existingEquip) {
      throw new ConflictException('Un équipement avec ce numéro de série existe déjà');
    }

    const equipement = new this.equipementModel({
      ...createEquipementDto,
      category: new Types.ObjectId(createEquipementDto.category),
      status: createEquipementDto.status ?? EquipementStatus.DISPONIBLE,
    });

    return equipement.save();
  }

  async findAll(query: QueryEquipementDto) {
    const { status, category, search, page = 1, limit = 20 } = query;
    const filter: Record<string, any> = {};

    if (status) filter.status = status;
    if (category) filter.category = new Types.ObjectId(category);
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { serialNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const total = await this.equipementModel.countDocuments(filter);

    const data = await this.equipementModel
      .find(filter)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

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

  async findOne(id: string): Promise<Equipement> {
    const equipement = await this.equipementModel
      .findById(id)
      .populate('category', 'name')
      .lean()
      .exec();

    if (!equipement) {
      throw new NotFoundException(`Équipement #${id} introuvable`);
    }

    return equipement;
  }

  async update(id: string, updateEquipementDto: UpdateEquipementDto) {
    const equipment = await this.equipementModel.findByIdAndUpdate(
      id,
      updateEquipementDto,
      { new: true },
    );

    if (!equipment) {
      throw new NotFoundException('Equipment not found');
    }

    return equipment;
  }

  async remove(id: string): Promise<{ message: string }> {
    const equipement = await this.equipementModel.findById(id).lean();
    if (!equipement)
      throw new NotFoundException(`Équipement #${id} introuvable`);

    // Empêche la suppression d'un équipement actuellement réservé ou en maintenance
    const UNDELETABLE = [
      EquipementStatus.RESERVE,
      EquipementStatus.EN_MAINTENANCE,
    ];
    if (UNDELETABLE.includes(equipement.status)) {
      throw new ConflictException(
        `Impossible de supprimer un équipement avec le statut "${equipement.status}".`,
      );
    }

    await this.equipementModel.findByIdAndDelete(id);
    return { message: 'equipemant supprimé' };
  }
}
