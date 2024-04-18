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
    this.stripe = new Stripe(configService.get(`${process.env.STRIPE_SECRET_KEY}`), {
      apiVersion: '2024-04-10',
    });
  }
 
  public async constructEventFromPayload(signature: string, payload: Buffer) {
    const webhookSecret = this.configService.get(`${process.env.STRIPE_WEBHOOK_SECRET}`);
 
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );
  }
 
}