import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './entities/ticket.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket) private readonly ticketRepository: Repository<Ticket>,
  ) { }

  create(createTicketDto: CreateTicketDto) {
    return 'This action adds a new ticket';
  }

  findAll() {
    return `This action returns all ticket`;
  }

  async findTicketByEventId(eventId: number): Promise<Ticket[]> {
    console.log(eventId);
    const tickets = await this.ticketRepository.createQueryBuilder('ticket')
      .innerJoinAndSelect('ticket.eventId', 'event')
      .innerJoinAndSelect('ticket.userId', 'user')
      .where('ticket.eventId = :eventId', { eventId })
      .getMany();

    if (tickets.length === 0) {
      throw new Error('Tickets not found for this event');
    }
    console.log(tickets);
    return tickets;
  }

  update(id: number, updateTicketDto: UpdateTicketDto) {
    return `This action updates a #${id} ticket`;
  }

  async remove(id: number) : Promise<void> {
    const ticketToRemove = await this.ticketRepository.findOne({ where: { id } });
    if (!ticketToRemove) {
      throw new Error('Ticket not found');
    }
    await this.ticketRepository.delete({ id });
  }
}
