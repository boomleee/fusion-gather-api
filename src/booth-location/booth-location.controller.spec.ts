import { Test, TestingModule } from '@nestjs/testing';
import { BoothLocationController } from './booth-location.controller';
import { BoothLocationService } from './booth-location.service';

describe('BoothLocationController', () => {
  let controller: BoothLocationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoothLocationController],
      providers: [BoothLocationService],
    }).compile();

    controller = module.get<BoothLocationController>(BoothLocationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
