import { Test, TestingModule } from '@nestjs/testing';
import { DummyController } from './dummy.controller';
import { DummyService } from './dummy.service';

describe('DummyController', () => {
  let controller: DummyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DummyController],
      providers: [DummyService],
    }).compile();

    controller = module.get<DummyController>(DummyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
