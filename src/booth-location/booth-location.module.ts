import { Module } from '@nestjs/common';
import { BoothLocationService } from './booth-location.service';
import { BoothLocationController } from './booth-location.controller';

@Module({
  controllers: [BoothLocationController],
  providers: [BoothLocationService],
})
export class BoothLocationModule {}
