import { Module } from '@nestjs/common';
import { BoothvisitorService } from './boothvisitor.service';
import { BoothvisitorController } from './boothvisitor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Boothvisitor } from './entities/boothvisitor.entity';
import { Booth } from 'src/booth/entities/booth.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';

@Module({
  controllers: [BoothvisitorController],
  providers: [BoothvisitorService],
  imports: [
    TypeOrmModule.forFeature([Boothvisitor]),
    TypeOrmModule.forFeature([Booth]),
    TypeOrmModule.forFeature([Ticket]),

  ],
})
export class BoothvisitorModule {}
