import { Test, TestingModule } from '@nestjs/testing';
import { SubcategoryController } from './subcategory.controller';

describe('SubcategoryController', () => {
  let controller: SubcategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubcategoryController],
    }).compile();

    controller = module.get<SubcategoryController>(SubcategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
