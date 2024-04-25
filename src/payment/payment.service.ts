/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable } from '@nestjs/common';
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
import * as CryptoJS from 'crypto-js';
import { Ticket } from 'src/ticket/entities/ticket.entity';

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
    @InjectRepository(Ticket) private readonly ticketRepository: Repository<Ticket>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-04-10',
    });
  }

  async checkIsBuyTicket (eventId: number, userId: number) :Promise<boolean> {
    const isBuyTicket = await this.ticketRepository.findOne({
      where: { eventId: { id: eventId }, userId: { id: userId } },
    });

    if (isBuyTicket) {
      return true;
    } 
    return false;
  }

  async checkout(eventId: number, userId: number) {
    const isEventExist = await this.eventRepository.findOne({where: {id: eventId}});
    if (!isEventExist) {
      throw new ForbiddenException('Event not found');
    }

    const isUserExist = await this.userRepository.findOne({ where: { id: userId } });
    if (!isUserExist) {
      throw new ForbiddenException('User not found');
    }
    try {
      // Encrypt eventId and userId
      const combinedString = `${eventId}:${userId}`
      const encryptedString = CryptoJS.AES.encrypt(combinedString, process.env.STRIPE_ENCRYPT_KEY).toString()
      const urlParam = encodeURIComponent(encryptedString);
      // get ticket price
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
        success_url: `https://www.fusiongather.me/event/success/${urlParam}`,
        cancel_url: `https://www.fusiongather.me/event/${eventId}`,
      });
      const paymentLink = session.url;
      return { paymentLink, session };
    } catch (error) {
      console.error('Error creating Stripe session:', error);
      throw new Error('Internal Server Error');
    }
  }
}
