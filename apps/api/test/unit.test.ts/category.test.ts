import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from '../../src/categories/category.controller';
import { CategoryService } from '../../src/categories/category.service';
import { CreateCategoryDto } from '../../src/categories/dto/create-category.dto';
import { UpdateCategoryDto } from '../../src/categories/dto/update-category.dto';

const mockCategoryService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('CategoryController', () => {
  let controller: CategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: mockCategoryService,
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    jest.clearAllMocks();
  });

  
  describe('create()', () => {
    const createDto: CreateCategoryDto = {
      name: 'Outillage',
    };

    it('devrait créer une catégorie et retourner le résultat', async () => {
      const mockResult = { _id: 'cat-id-1', ...createDto };
      mockCategoryService.create.mockResolvedValue(mockResult);

      const result = await controller.create(createDto);

      expect(mockCategoryService.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockResult);
    });

    it('devrait propager l\'erreur si create échoue', async () => {
      mockCategoryService.create.mockRejectedValue(new Error('Erreur création'));

      await expect(controller.create(createDto)).rejects.toThrow('Erreur création');
    });
  });

  // GET /categories
  describe('findAll()', () => {
    it('devrait retourner la liste de toutes les catégories', async () => {
      const mockResult = [
        { _id: 'cat-id-1', name: 'Outillage' },
        { _id: 'cat-id-2', name: 'Informatique' },
      ];
      mockCategoryService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll();

      expect(mockCategoryService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });

    it('devrait retourner un tableau vide si aucune catégorie', async () => {
      mockCategoryService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });


  // GET /categories/:id
  describe('findOne()', () => {
    it('devrait retourner une catégorie par son id', async () => {
      const mockCategory = { _id: 'cat-id-1', name: 'Outillage' };
      mockCategoryService.findOne.mockResolvedValue(mockCategory);

      const result = await controller.findOne('cat-id-1');

      expect(mockCategoryService.findOne).toHaveBeenCalledWith('cat-id-1');
      expect(result).toEqual(mockCategory);
    });

    it('devrait propager l\'erreur si la catégorie n\'existe pas', async () => {
      mockCategoryService.findOne.mockRejectedValue(new Error('Catégorie non trouvée'));

      await expect(controller.findOne('invalid-id')).rejects.toThrow('Catégorie non trouvée');
    });
  });

  // PATCH /categories/:id
  describe('update()', () => {
    const updateDto: UpdateCategoryDto = { name: 'Outillage Pro' };

    it('devrait mettre à jour une catégorie et retourner le résultat', async () => {
      const mockUpdated = { _id: 'cat-id-1', name: 'Outillage Pro' };
      mockCategoryService.update.mockResolvedValue(mockUpdated);

      const result = await controller.update('cat-id-1', updateDto);

      expect(mockCategoryService.update).toHaveBeenCalledWith('cat-id-1', updateDto);
      expect(result).toEqual(mockUpdated);
    });

    it('devrait propager l\'erreur si update échoue', async () => {
      mockCategoryService.update.mockRejectedValue(new Error('Catégorie non trouvée'));

      await expect(controller.update('invalid-id', updateDto)).rejects.toThrow('Catégorie non trouvée');
    });
  });


  // DELETE /categories/:id
  describe('remove()', () => {
    it('devrait supprimer une catégorie et retourner le résultat', async () => {
      const mockResult = { deleted: true };
      mockCategoryService.remove.mockResolvedValue(mockResult);

      const result = await controller.remove('cat-id-1');

      expect(mockCategoryService.remove).toHaveBeenCalledWith('cat-id-1');
      expect(result).toEqual(mockResult);
    });

    it('devrait propager l\'erreur si remove échoue', async () => {
      mockCategoryService.remove.mockRejectedValue(new Error('Catégorie non trouvée'));

      await expect(controller.remove('invalid-id')).rejects.toThrow('Catégorie non trouvée');
    });
  });
});