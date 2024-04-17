/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Headers } from '@nestjs/common';
import { Stripe } from 'stripe';
import { PaymentService } from 'src/payment/payment.service'; // Import service để gọi hàm handleWebhook

@Controller('webhook')
export class WebhookController {
  private stripe: Stripe;

  constructor(private paymentService: PaymentService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-04-10',
    });
  }

  // @Post()
  // async handleStripeEvent(@Body() body: any, @Headers('stripe-signature') signature: string) {
  //   await this.paymentService.handleWebhook({ body, headers: { 'whsec_7bffa39471f462f62855961e68d433ea0096f35ed0fbd80f77dff86dc0850df9': signature } });
  // }
}

