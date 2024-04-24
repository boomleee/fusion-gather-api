/* eslint-disable prettier/prettier */

import {
  Controller,
  Post,
  Headers,
  Req,
  BadRequestException,
  Param,
} from '@nestjs/common';
import StripeService from './stripe.service';
import RequestWithRawBody from './requestWithRawBody.interface';
import { TicketService } from 'src/ticket/ticket.service';
import { CreateTicketDto } from 'src/ticket/dto/create-ticket.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QrCodeService } from 'src/qrcode/qrcode.service';

import { UserService } from 'src/user/user.service';

import { Event } from 'src/event/entities/event.entity';
import { EventService } from 'src/event/event.service';

@Controller('webhook')
export default class WebhookController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly ticketService: TicketService,
    private readonly eventService: EventService,
    private readonly qrCodeService: QrCodeService,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly userService: UserService,
    private mailerService: MailerService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  @Post()
  async handleIncomingEvents(
    @Headers('stripe-signature') signature: string,
    @Req() request: RequestWithRawBody,
    @Param('eventId') eventId: number,
    @Param('userId') userId: number,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }
    const event = await this.stripeService.constructEventFromPayload(
      signature,
      request.rawBody,
    );

    const EventIdforTicket = await this.eventService.findOne(eventId);
    // .createQueryBuilder('event')
    // .where('event.id = :eventId', { eventId })
    // .getOne();

    const UserIdforTicket = await this.userService.findOne(userId);
    // .createQueryBuilder('user')
    // .where('user.id = :userId', { userId })
    // .getOne();

    if (event.data.object.object === 'payment_intent') {
      const session = event.data.object;
      console.log('session', session);
      if (session.status === 'succeeded') {
      }
    }
  }
}
