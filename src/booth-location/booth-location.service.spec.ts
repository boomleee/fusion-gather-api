import { Test, TestingModule } from '@nestjs/testing';
import { BoothLocationService } from './booth-location.service';

describe('BoothLocationService', () => {
  let service: BoothLocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BoothLocationService],
    }).compile();

    service = module.get<BoothLocationService>(BoothLocationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
