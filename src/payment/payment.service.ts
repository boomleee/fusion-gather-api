/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import QRCode from 'qrcode';
import { Payment } from './entities/payment.entity';
import { TicketService } from 'src/ticket/ticket.service';
import { Event } from 'src/event/entities/event.entity';
import { CreateTicketDto } from 'src/ticket/dto/create-ticket.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from 'src/user/entities/user.entity';
import { QrCodeService } from 'src/qrcode/qrcode.service';
@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly ticketService: TicketService,
    private readonly qrCodeService: QrCodeService,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private MailerService: MailerService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-04-10',
    });
  }

  async checkout(eventId: number, userId: number) {
    try {
      const ticket = await this.eventRepository
        .createQueryBuilder('event')
        .where('event.id = :eventId', { eventId })
        .getOne();
      let totalPrice = 0;
      totalPrice += parseFloat(ticket.price);

      // Create session using Stripe Checkout
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Ticket',
              },
              unit_amount: Math.round(totalPrice * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `https://www.fusiongather.me/event/${eventId}`,
        cancel_url: `https://www.fusiongather.me/event/${eventId}`,
      });
      const paymentLink = session.url;
      return { paymentLink,session};
    } catch (error) {
      console.error('Error processing payment:', error);
      throw new Error('Internal Server Error');
    }
  }
}
