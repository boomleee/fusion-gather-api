import { Test, TestingModule } from '@nestjs/testing';
import { FolloweventService } from './followevent.service';

describe('FolloweventService', () => {
  let service: FolloweventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FolloweventService],
    }).compile();

    service = module.get<FolloweventService>(FolloweventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
