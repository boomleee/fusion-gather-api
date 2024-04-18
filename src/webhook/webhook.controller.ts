/* eslint-disable prettier/prettier */

import { Controller, Post, Headers, Req, BadRequestException } from '@nestjs/common';
import StripeService from './stripe.service';
import RequestWithRawBody from './requestWithRawBody.interface';
import { TicketService } from 'src/ticket/ticket.service';
import { CreateTicketDto } from 'src/ticket/dto/create-ticket.dto';
 
@Controller('webhook')
export default class WebhookController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly ticketService: TicketService,
  ) {}
 
  @Post()
  async handleIncomingEvents(
    @Headers('stripe-signature') signature: string,
    @Req() request: RequestWithRawBody
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }
 
    const event = await this.stripeService.constructEventFromPayload(signature, request.rawBody);
 
    if (event.type === 'charge.captured') {
      const data = event.data.object ;
      const createTicketDto: CreateTicketDto = {
        eventId: 1,
        userId: 1,
        isScanned: false,
        paidStatus: 'false',
      };
      const ticketStatus = data.status;
 
      await this.ticketService.paidStatus(createTicketDto, ticketStatus)
    }
  }
}
