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
        const createTicketDto: CreateTicketDto = {
          eventId: EventIdforTicket.id,
          userId: UserIdforTicket.id,
          isScanned: false,
        };

        const newTicket =
          await this.ticketService.createTicketAfterSuccessfulPayment(
            createTicketDto,
          );
        const qrCode = await this.qrCodeService.generateAndSaveQRCodeForTicket(
          newTicket.id,
        );
        try {
          const mailConfirm = await this.userRepository
            .createQueryBuilder('user')
            .where('user.id = :userId', { userId })
            .getOne();
          await this.mailerService.sendMail({
            to: mailConfirm.email,
            subject: 'Payment Success Notification',
            attachDataUrls: true,
            html: `
              <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.6;">Your payment was successful. Thank you for your purchase!</p>
              <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.6;">Below is your QR Code for the event:</p>
              <div style="text-align: center;">
                  <img src="${qrCode}" alt="QR Code" style="max-width: 100%; height: auto;">
              </div>
            `,
          });
        } catch (error) {
          console.error('Error sending payment success email:', error);
          throw new Error('Failed to send payment success email');
        }
      }
    }
  }
}
