import { Test, TestingModule } from '@nestjs/testing';
import { AdController } from './ad.controller';

describe('AdController', () => {
  let controller: AdController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdController],
    }).compile();

    controller = module.get<AdController>(AdController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
