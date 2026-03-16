import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const exists = await this.categoryModel.findOne({
      name: createCategoryDto.name,
    });

    if (exists) {
      throw new ConflictException('catégorie existe deja');
    }

    const category = new this.categoryModel(createCategoryDto);
    return category.save();
  }

  async findAll() {
    return this.categoryModel.find();
  }

  async findOne(id: string) {
    const category = await this.categoryModel.findById(id);

    if (!category) {
      throw new NotFoundException('categorie non trouvée');
    }

    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.categoryModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!category) {
      throw new NotFoundException('categorie non trouvée');
    }

    return category;
  }

  async remove(id: string) {
    const category = await this.categoryModel.findByIdAndDelete(id);

    if (!category) {
      throw new NotFoundException('categorie non trouvée');
    }

    return { message: 'categorie supprimée' };
  }
}
