import { Test, TestingModule } from '@nestjs/testing';
import { BoothvisitorController } from './boothvisitor.controller';
import { BoothvisitorService } from './boothvisitor.service';

describe('BoothvisitorController', () => {
  let controller: BoothvisitorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoothvisitorController],
      providers: [BoothvisitorService],
    }).compile();

    controller = module.get<BoothvisitorController>(BoothvisitorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
