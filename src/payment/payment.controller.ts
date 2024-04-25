/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Param,
  BadRequestException,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(AuthGuard)
  @Post(':eventId/:userId')
  async checkout(
    @Param('eventId') eventId: number,
    @Param('userId') userId: number,
  ) {
    try {
      // Kiểm tra xem eventId có hợp lệ không
      if (!eventId) {
        throw new BadRequestException('Event id is missing');
      }
      if (!userId) {
        throw new BadRequestException('User id is missing');
      }

      const isOwner = await this.paymentService.checkIsOwner(eventId, userId);
      if (isOwner) {
        throw new ForbiddenException('Owner cannot buy ticket of their event');
      }

      const isVendor = await this.paymentService.checkIsVendor(eventId, userId);
      if (isVendor) {
        throw new ForbiddenException('Vendor cannot buy ticket for event they are participating');
      }

     const isBuyTicket = await this.paymentService.checkIsBuyTicket(eventId, userId);
      if (isBuyTicket) {
        throw new ForbiddenException('You have already bought this ticket');
      }
      // Call method checkout from PaymentService and pass eventId
      const paymentIntent = await this.paymentService.checkout(eventId, userId);
      // Return to client
      return { success: true, paymentLink: paymentIntent.paymentLink };
    } catch (error) {
      // Handle error and return to client
      return { success: false, error: error.message, statusCode: error.status };
    }
  }
}
