/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import Stripe from 'stripe';

import { Payment } from "./entities/payment.entity";
import { TicketService } from "src/ticket/ticket.service";
import { Event } from "src/event/entities/event.entity";
import { CreateTicketDto } from "src/ticket/dto/create-ticket.dto";

@Injectable()
export class PaymentService {
    private stripe: Stripe;

    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
        private readonly ticketService: TicketService,
        @InjectRepository(Event)
        private readonly eventRepository: Repository<Event>,
    ) {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: "2024-04-10"
        });
    }


    async checkout(eventId: number, userId:number) {
        try {
            const ticket = await this.eventRepository.createQueryBuilder('event')
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
                success_url: 'https://www.fusiongather.me/payment/success',
                cancel_url: 'https://www.fusiongather.me/payment/cancel',
            });
    
            // Tạo một CreateTicketDto từ dữ liệu nhận được
            const createTicketDto: CreateTicketDto = {
              eventId: eventId,
              userId: userId,
              isScanned: false // Set isScanned to false by default
            };
    
            // Tạo một vé sau khi thanh toán thành công
            const newTicket = await this.ticketService.createTicketAfterSuccessfulPayment(createTicketDto);

    
            const paymentLink = session.url;
    
            return { paymentLink, session, newTicket };
        } catch (error) {
            console.error('Error processing payment:', error);
            throw new Error('Internal Server Error');
        }
    }
    
}
