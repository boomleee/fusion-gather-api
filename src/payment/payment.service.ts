/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import Stripe from 'stripe';

import { Payment } from "./entities/payment.entity";
import { TicketService } from "src/ticket/ticket.service";

@Injectable()
export class PaymentService {
    private stripe: Stripe;

    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
        private readonly ticketService: TicketService,
    ) {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: "2024-04-10"
        });
    }

    async checkout(eventId: number, userId: number) {
        try {
            // Get tickets by eventId and userId
            const tickets = await this.ticketService.findTicketByEventId(eventId, userId);
            
            // Calculate total price based on ticket prices
            let totalPrice = 0;
            for (const ticket of tickets) {
                totalPrice += parseFloat(ticket.eventId.price);
            }

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
                success_url: 'https://your-website.com/payment/success',
                cancel_url: 'https://your-website.com/payment/cancel',
            });

            // Redirect user to checkout URL
            const paymentLink = session.url;

            return { paymentLink, session };
        } catch (error) {
            console.error('Error processing payment:', error);
            throw new Error('Internal Server Error');
        }
    }
}
