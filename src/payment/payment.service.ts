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
      const createTicketDto: CreateTicketDto = {
        eventId: eventId,
        userId: userId,
        isScanned: false,
        paidStatus: ''
      };
      console.log('session cua payment', session);
      const paymentLink = session.url;
      if (session.success_url && session.payment_status === 'paid') {
        await this.ticketService.createTicketAfterSuccessfulPayment(
          createTicketDto,
        );
        console.log('check data', session.success_url);
        console.log('check data2 ', session.payment_status);
      }
      const qrCodeData = await this.qrCodeService.getQRCodeData(eventId);
      const mailConfirm = await this.userRepository
        .createQueryBuilder('user')
        .where('user.id = :userId', { userId })
        .getOne();
      try {
        await this.MailerService.sendMail({
          to: mailConfirm.email,
          subject: 'Payment Success Notification',
          attachDataUrls: true,//to accept base64 content in messsage
          html: `
          <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.6;">Your payment was successful. Thank you for your purchase!</p>
          <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.6;">Below is your QR Code for the event:</p>
          <div style="text-align: center;">
              <img src="${qrCodeData}" alt="QR Code" style="max-width: 100%; height: auto;">
          </div>
      `,
        });

        console.log("gui ne", qrCodeData);
      } catch (error) {
        console.error('Error sending payment success email:', error);
        throw new Error('Failed to send payment success email');
      }

      return { paymentLink, session };
    } catch (error) {
      console.error('Error processing payment:', error);
      throw new Error('Internal Server Error');
    }
  }

  async SuccessSession(Session) {
    console.log(Session);
  }

  // async handleWebhook(payload: any) {
  //   try {
  //     if (!payload.headers || !payload.headers['stripe-signature']) {
  //       throw new Error('Stripe signature not found in headers');
  //     }

  //     const sig = payload.headers['stripe-signature'];
  //     const event = this.stripe.webhooks.constructEvent(
  //       payload.body,
  //       sig,
  //       `${process.env.endpointSecret}`,
  //     );
  //     console.log('webhook', payload);
  //     switch (event.type) {
  //       case 'payment_intent.succeeded':
  //         const eventId = parseInt(event.data.object.metadata.eventId, 10); // Chuyển đổi từ chuỗi sang số
  //         if (!isNaN(eventId)) {
  //           await this.handlePaymentSucceeded(eventId, event.data.object);
  //         } else {
  //           console.error(
  //             'Invalid eventId:',
  //             event.data.object.metadata.eventId,
  //           );
  //         }
  //         break;
  //       case 'payment_intent.payment_failed':
  //         // Xử lý sự kiện thanh toán thất bại
  //         break;
  //       default:
  //         console.log(`Unhandled webhook event type: ${event.type}`);
  //     }
  //   } catch (err) {
  //     console.error('Error handling webhook:', err);
  //     throw new Error('Failed to handle webhook');
  //   }
  // }

  // private async handlePaymentSucceeded(eventId: number, paymentIntent: any) {
  //   // Lấy thông tin người dùng từ paymentIntent
  //   const userId = paymentIntent.metadata.userId;
  //   try {
  //     // Tạo vé cho người dùng
  //     await this.createTicketForUser(eventId, userId);
  //   } catch (error) {
  //     console.error('Error creating ticket:', error);
  //     throw new Error('Failed to create ticket');
  //   }

  //   // try {
  //   //   // Gửi email thông báo cho người dùng
  //   //   await this.sendPaymentSuccessEmail(userId);
  //   // } catch (error) {
  //   //   console.error('Error sending payment success email:', error);
  //   //   throw new Error('Failed to send payment success email');
  //   // }
  // }

  // private async createTicketForUser(eventId: number, userId: number) {
  //   try {
  //     const createTicketDto: CreateTicketDto = {
  //       eventId: eventId,
  //       userId: userId,
  //       isScanned: false,
  //     };
  //     await this.ticketService.createTicketAfterSuccessfulPayment(
  //       createTicketDto,
  //     );
  //     console.log(createTicketDto);
  //   } catch (error) {
  //     console.error('Error creating ticket for user:', error);
  //     throw new Error('Failed to create ticket for user');
  //   }
  // }

  // private async sendPaymentSuccessEmail(eventId: number, userId: number) {
  //   const tickets = await this.userRepository
  //     .createQueryBuilder('user')
  //     .where('user.id = :userId', { userId })
  //     .getOne();
  //   try {
  //     await this.MailerService.sendMail({
  //       to: tickets.email,
  //       subject: 'Payment Success Notification',
  //       html: `<p>Your payment was successful. Thank you for your purchase!</p>`,
  //     });
  //   } catch (error) {
  //     console.error('Error sending payment success email:', error);
  //     throw new Error('Failed to send payment success email');
  //   }
  // }
}
