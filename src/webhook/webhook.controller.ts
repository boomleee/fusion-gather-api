/* eslint-disable prettier/prettier */

import {
  Controller,
  Post,
  Headers,
  Req,
  BadRequestException,
} from '@nestjs/common';
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
    @Req() request: RequestWithRawBody,
  ) {
    console.log("da vao duoc r nha")
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }
    const event = await this.stripeService.constructEventFromPayload(
      signature,
      request.rawBody,
    );
    if (event.data.object.object === 'checkout.session') {
      // Sự kiện liên quan đến session thanh toán
      const session = event.data.object;
      console.log("session", session)
      if (session.payment_status === 'paid') {
        const createTicketDto: CreateTicketDto = {
          eventId: 1,
          userId: 1,
          isScanned: false,
          paidStatus: 'false',
        };
        const ticketStatus = session.status.toString();
        console.log("ticket status",ticketStatus)
        await this.ticketService.paidStatus(createTicketDto, ticketStatus);
      }
    }
  }
}