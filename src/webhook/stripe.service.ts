/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
 
@Injectable()
export default class StripeService {
  private stripe: Stripe;
 
  constructor(
    private configService: ConfigService
  ) {
    const stripeSecretKey = this.configService.get('STRIPE_SECRET_KEY'); 
    const stripeWebhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET'); 
    console.log("Stripe Service Secret Key:", stripeSecretKey); 
    console.log("Stripe Service Webhook Secret:", stripeWebhookSecret); 

    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-04-10',
    });
  }
 
  public async constructEventFromPayload(signature: string, payload: Buffer) {
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
    console.log("strip.service_webhookSecret",webhookSecret);
    console.log("strip.service_payload",payload);
    return this.stripe.webhooks.constructEvent(payload,signature,webhookSecret);
  }
 
}