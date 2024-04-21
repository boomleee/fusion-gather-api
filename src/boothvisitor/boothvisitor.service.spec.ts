import { Test, TestingModule } from '@nestjs/testing';
import { BoothvisitorService } from './boothvisitor.service';

describe('BoothvisitorService', () => {
  let service: BoothvisitorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BoothvisitorService],
    }).compile();

    service = module.get<BoothvisitorService>(BoothvisitorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
