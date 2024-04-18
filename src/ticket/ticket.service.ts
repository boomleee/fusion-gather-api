/* eslint-disable prettier/prettier */
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Ticket } from './entities/ticket.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QrCodeService } from 'src/qrcode/qrcode.service';
import { DeepPartial, Repository } from 'typeorm';
import { QrCodeService } from 'src/qrcode/qrcode.service';
import { User } from 'src/user/entities/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { create } from 'domain';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly qrCodeService: QrCodeService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private MailerService: MailerService,
  ) {}

  findAll() {
    return `This action returns all ticket`;
  }

  async findTicketByEventId(
    eventId: number,
    userId: number,
  ): Promise<Ticket[]> {
    if (isNaN(eventId)) {
      throw new BadRequestException('Invalid event id');
    }
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user id');
    }
    const eventExist = await this.checkEventExistByUserId(eventId, userId);
    if (!eventExist) {
      throw new UnauthorizedException('You cannot access this event');
    }
    const tickets = await this.ticketRepository
      .createQueryBuilder('ticket')
      .innerJoinAndSelect('ticket.eventId', 'event')
      .innerJoinAndSelect('ticket.userId', 'user')
      .where('ticket.eventId = :eventId', { eventId })
      .getMany();
    if (tickets.length === 0) {
      throw new NotFoundException(`No ticket found for event ${eventId}`);
    }
    return tickets;
  }

  async remove(id: number): Promise<void> {
    const ticketToRemove = await this.ticketRepository.findOne({
      where: { id },
    });
    if (!ticketToRemove) {
      throw new NotFoundException('Ticket not found');
    }
    if (ticketToRemove.isScanned) {
      throw new ForbiddenException('Ticket has been scanned, cannot delete');
    }
    await this.ticketRepository.delete({ id });
  }

  async checkEventExistByUserId(
    eventId: number,
    userId: number,
  ): Promise<boolean> {
    const event = await this.eventRepository
      .createQueryBuilder('event')
      .andWhere('event.id = :eventId', { eventId })
      .andWhere('event.userId = :userId', { userId })
      .getOne();
    if (event) {
      return true;
    }
    return false;
  }

  async createTicketAfterSuccessfulPayment(
    createTicketDto: CreateTicketDto,
  ): Promise<Ticket> {
    try {
      const ticketPartial: DeepPartial<Ticket> = {
        eventId: { id: createTicketDto.eventId },
        userId: { id: createTicketDto.userId },
        isScanned: createTicketDto.isScanned,
      };
      
      if (ticketPartial === null) {
        throw new Error('Invalid ticket data');
      } else {
        await this.qrCodeService.generateAndSaveQRCodeForTicket(createTicketDto.eventId);
      }
      return await this.ticketRepository.save(ticketPartial);

    } catch (error) {
      throw new Error('Failed to create ticket');
    }
  }
}
