import { Test, TestingModule } from '@nestjs/testing';
import { AdService } from './ad.service';

describe('AdService', () => {
  let service: AdService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdService],
    }).compile();

    service = module.get<AdService>(AdService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
