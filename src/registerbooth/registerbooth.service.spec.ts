import { Test, TestingModule } from '@nestjs/testing';
import { RegisterboothService } from './registerbooth.service';

describe('RegisterboothService', () => {
  let service: RegisterboothService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegisterboothService],
    }).compile();

    service = module.get<RegisterboothService>(RegisterboothService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
