import { Test, TestingModule } from '@nestjs/testing';
import { RegisterboothController } from './registerbooth.controller';
import { RegisterboothService } from './registerbooth.service';

describe('RegisterboothController', () => {
  let controller: RegisterboothController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegisterboothController],
      providers: [RegisterboothService],
    }).compile();

    controller = module.get<RegisterboothController>(RegisterboothController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
