import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { EquipementController } from '../../src/equipements/equipement.controller';
import { EquipementService } from '../../src/equipements/equipement.service';
import { CreateEquipementDto } from '../../src/equipements/dto/create-equipement.dto';
import { UpdateEquipementDto } from '../../src/equipements/dto/update-equipement.dto';
import { QueryEquipementDto } from '../../src/equipements/dto/QueryEquipementDto';

const mockEquipementService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('EquipementController', () => {
  let controller: EquipementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EquipementController],
      providers: [
        {
          provide: EquipementService,
          useValue: mockEquipementService,
        },
      ],
    }).compile();

    controller = module.get<EquipementController>(EquipementController);
    jest.clearAllMocks();
  });

  
  // POST /equipements
  describe('create()', () => {
    const createDto: CreateEquipementDto = {
      name: 'Perceuse',
      description: 'Perceuse électrique',
      category: 'Outillage',
      serialNumber: 'SN0111'
    };

    it('devrait créer un équipement et retourner le résultat', async () => {
      const mockResult = { _id: 'equip-id-1', ...createDto };
      mockEquipementService.create.mockResolvedValue(mockResult);

      const result = await controller.create(createDto);

      expect(mockEquipementService.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockResult);
    });

    it('devrait propager l\'erreur si create échoue', async () => {
      mockEquipementService.create.mockRejectedValue(new Error('Erreur création'));

      await expect(controller.create(createDto)).rejects.toThrow('Erreur création');
    });
  });

  // POST /equipements/upload-image
  describe('uploadImage()', () => {
    it('devrait retourner l\'url du fichier uploadé', () => {
      const mockFile = {
        filename: '123456789-image.jpg',
        mimetype: 'image/jpeg',
        originalname: 'image.jpg',
      } as Express.Multer.File;

      const result = controller.uploadImage(mockFile);

      expect(result).toEqual({ url: '/uploads/123456789-image.jpg' });
    });

    it('devrait lancer BadRequestException si aucun fichier fourni', () => {
      expect(() => controller.uploadImage(undefined as any)).toThrow(BadRequestException);
      expect(() => controller.uploadImage(undefined as any)).toThrow('Aucun fichier fourni');
    });
  });

 
  // GET /equipements
  describe('findAll()', () => {
    it('devrait retourner la liste des équipements', async () => {
      const query: QueryEquipementDto = { page: 1, limit: 10 };
      const mockResult = {
        data: [{ _id: 'equip-1', name: 'Perceuse' }],
        total: 1,
      };
      mockEquipementService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(query);

      expect(mockEquipementService.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockResult);
    });

    it('devrait retourner une liste vide si aucun équipement', async () => {
      mockEquipementService.findAll.mockResolvedValue({ data: [], total: 0 });

      const result = await controller.findAll({});

      expect(result).toEqual({ data: [], total: 0 });
    });
  });


  // GET /equipements/:id
  describe('findOne()', () => {
    it('devrait retourner un équipement par son id', async () => {
      const mockEquip = { _id: 'equip-id-1', name: 'Perceuse' };
      mockEquipementService.findOne.mockResolvedValue(mockEquip);

      const result = await controller.findOne('equip-id-1');

      expect(mockEquipementService.findOne).toHaveBeenCalledWith('equip-id-1');
      expect(result).toEqual(mockEquip);
    });

    it('devrait propager l\'erreur si l\'équipement n\'existe pas', async () => {
      mockEquipementService.findOne.mockRejectedValue(new Error('Équipement non trouvé'));

      await expect(controller.findOne('invalid-id')).rejects.toThrow('Équipement non trouvé');
    });
  });


  // PATCH /equipements/:id
  describe('update()', () => {
    const updateDto: UpdateEquipementDto = { name: 'Perceuse Pro' };

    it('devrait mettre à jour un équipement et retourner le résultat', async () => {
      const mockUpdated = { _id: 'equip-id-1', name: 'Perceuse Pro' };
      mockEquipementService.update.mockResolvedValue(mockUpdated);

      const result = await controller.update('equip-id-1', updateDto);

      expect(mockEquipementService.update).toHaveBeenCalledWith('equip-id-1', updateDto);
      expect(result).toEqual(mockUpdated);
    });

    it('devrait propager l\'erreur si update échoue', async () => {
      mockEquipementService.update.mockRejectedValue(new Error('Équipement non trouvé'));

      await expect(controller.update('invalid-id', updateDto)).rejects.toThrow('Équipement non trouvé');
    });
  });


  // DELETE /equipements/:id
  describe('remove()', () => {
    it('devrait supprimer un équipement et retourner le résultat', async () => {
      const mockResult = { deleted: true };
      mockEquipementService.remove.mockResolvedValue(mockResult);

      const result = await controller.remove('equip-id-1');

      expect(mockEquipementService.remove).toHaveBeenCalledWith('equip-id-1');
      expect(result).toEqual(mockResult);
    });

    it('devrait propager l\'erreur si remove échoue', async () => {
      mockEquipementService.remove.mockRejectedValue(new Error('Équipement non trouvé'));

      await expect(controller.remove('invalid-id')).rejects.toThrow('Équipement non trouvé');
    });
  });
});