import { Module } from '@nestjs/common';
import { BoothvisitorService } from './boothvisitor.service';
import { BoothvisitorController } from './boothvisitor.controller';

@Module({
  controllers: [BoothvisitorController],
  providers: [BoothvisitorService],
})
export class BoothvisitorModule {}
