import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { Ticket } from './entities/ticket.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Event } from 'src/event/entities/event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Event])
  ],

  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}
