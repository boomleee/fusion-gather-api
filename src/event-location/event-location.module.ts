import { Module } from '@nestjs/common';
import { EventLocationService } from './event-location.service';
import { EventLocationController } from './event-location.controller';

@Module({
  controllers: [EventLocationController],
  providers: [EventLocationService],
})
export class EventLocationModule {}
