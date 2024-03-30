import { Test, TestingModule } from '@nestjs/testing';
import { FolloweventController } from './followevent.controller';
import { FolloweventService } from './followevent.service';

describe('FolloweventController', () => {
  let controller: FolloweventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FolloweventController],
      providers: [FolloweventService],
    }).compile();

    controller = module.get<FolloweventController>(FolloweventController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
