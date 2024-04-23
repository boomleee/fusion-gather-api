/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Ticket } from './entities/ticket.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Equal, FindOptionsWhere, In, Repository } from 'typeorm';
import { QrCodeService } from 'src/qrcode/qrcode.service';
import { User } from 'src/user/entities/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import * as QRCode from 'qrcode';
import { equal } from 'assert';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private mailerService: MailerService,
  ) {}

  findAll() {
    return `This action returns all ticket`;
  }

  // get all ticket by event id
  async findTicketByEventId(eventId: number, user: User): Promise<Ticket[]> {
    if (isNaN(eventId)) {
      throw new BadRequestException('Invalid event id');
    }
    const isEventExist = await this.eventRepository.findOne({
      where: { id: eventId } as FindOptionsWhere<Event>,
    });
    if (!isEventExist) {
      throw new NotFoundException('Event not found');
    }
    const isOwner = await this.checkEventExistByUserId(eventId, user.id);
    if (!isOwner) {
      throw new UnauthorizedException('You cannot access this event');
    }
    const tickets = await this.ticketRepository
      .createQueryBuilder('ticket')
      .innerJoinAndSelect('ticket.eventId', 'event')
      .innerJoinAndSelect('ticket.userId', 'user')
      .where('ticket.eventId = :eventId', { eventId })
      .getMany();
    if (tickets.length === 0) {
      const ticketBlank = [];
      return ticketBlank;
    }
    return tickets;
  }

  // delete ticket by id
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

  async formatDateTime(rawdateTime: string) {
    const dateTime = new Date(rawdateTime);

    // Convert UTC time to ICT time
    const offset = 7; // ICT is UTC+7
    const utcTime = dateTime.getTime();
    const ictTime = new Date(utcTime + offset * 60 * 60 * 1000);

    // Extract components
    const day = String(ictTime.getDate()).padStart(2, '0');
    const month = String(ictTime.getMonth() + 1).padStart(2, '0');
    const year = ictTime.getFullYear();
    const hour = String(ictTime.getHours()).padStart(2, '0');
    const minute = String(ictTime.getMinutes()).padStart(2, '0');

    // Format the datetime string
    const formattedDateTime = `${day}/${month}/${year} ${hour}:${minute}`;
    return formattedDateTime;
  }

  // create ticket after successful payment and send ticket QR Code email to user
  async createTicketAfterSuccessfulPayment(
    createTicketDto: CreateTicketDto,
  ): Promise<Ticket> {
    const isBuyTicket = await this.ticketRepository.findOne({
      where: { eventId: { id: createTicketDto.eventId }, userId: { id: createTicketDto.userId } },
    });

    if (isBuyTicket) {
      throw new ForbiddenException('You have already registered for this event');
    }
    const ticketPartial: DeepPartial<Ticket> = {
      eventId: { id: createTicketDto.eventId },
      userId: { id: createTicketDto.userId },
      isScanned: createTicketDto.isScanned,
    };

    const ticket = await this.ticketRepository.save(ticketPartial);

    const ticketData = await this.ticketRepository
      .createQueryBuilder('ticket')
      .innerJoinAndSelect('ticket.eventId', 'event')
      .where('ticket.id = :ticketId', { ticketId: ticket.id })
      .getOne();

    const qrData = { ticketId: ticket.id };
    const qrDataString = JSON.stringify(qrData);
    const qrCodeImage = await QRCode.toDataURL(qrDataString);
    const mailConfirm = await this.userRepository.findOne({
      where: { id: createTicketDto.userId },
    });
    const formattedDateTime = await this.formatDateTime(
      ticketData.eventId.startDateTime,
    );

    await this.mailerService.sendMail({
      to: mailConfirm.email,
      subject: 'Payment Success Notification',
      attachDataUrls: true,
      html: `
              <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.6;">Your payment was successful. Thank you for your purchase!</p>
              <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.6;">Below is your QR Code for the event <strong>${ticketData.eventId.title}</strong>:</p>
              <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.6;">Event start: <strong>${formattedDateTime}</strong></p>
              <div style="text-align: center;">
                  <img src="${qrCodeImage}" alt="QR Code" style="max-width: 100%; height: auto;">
              </div>
            `,
    });
    return ticket;
  }

  // create free ticket and send ticket QR Code email to user
  async createFreeTicket(createTicketDto: CreateTicketDto): Promise<Ticket> {
    const isBuyTicket = await this.ticketRepository.findOne({
      where: { eventId: { id: createTicketDto.eventId }, userId: { id: createTicketDto.userId } },
    });

    if (isBuyTicket) {
      throw new ForbiddenException('You have already registered for this event');
    }
    const ticketPartial: DeepPartial<Ticket> = {
      eventId: { id: createTicketDto.eventId },
      userId: { id: createTicketDto.userId },
      isScanned: createTicketDto.isScanned,
    };

    const ticket = await this.ticketRepository.save(ticketPartial);

    const ticketData = await this.ticketRepository
      .createQueryBuilder('ticket')
      .innerJoinAndSelect('ticket.eventId', 'event')
      .where('ticket.id = :ticketId', { ticketId: ticket.id })
      .getOne();

    const qrData = { ticketId: ticket.id };
    const qrDataString = JSON.stringify(qrData);
    const qrCodeImage = await QRCode.toDataURL(qrDataString);
    const mailConfirm = await this.userRepository.findOne({
      where: { id: createTicketDto.userId },
    });
    const formattedDateTime = await this.formatDateTime(
      ticketData.eventId.startDateTime,
    );

    await this.mailerService.sendMail({
      to: mailConfirm.email,
      subject: 'Free Ticket Notification',
      attachDataUrls: true,
      html: `
              <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.6;">You have successfully register an event!</p>
              <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.6;">Below is your QR Code for the event <strong>${ticketData.eventId.title}</strong>:</p>
              <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.6;">Event start: <strong>${formattedDateTime}</strong></p>
              <div style="text-align: center;">
                  <img src="${qrCodeImage}" alt="QR Code" style="max-width: 100%; height: auto;">
              </div>
            `,
    });
    return ticket;
  }
}
