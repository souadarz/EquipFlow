import { Test, TestingModule } from '@nestjs/testing';
import { EquipementController } from './equipement.controller';
import { EquipementService } from './equipement.service';

describe('EquipementController', () => {
  let controller: EquipementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EquipementController],
      providers: [EquipementService],
    }).compile();

    controller = module.get<EquipementController>(EquipementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
