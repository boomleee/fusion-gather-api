/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Param,
  BadRequestException,
  UseGuards,
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

      // Gọi phương thức checkout từ PaymentService và truyền eventId
      const paymentIntent = await this.paymentService.checkout(eventId, userId);
      // Trả về kết quả cho client
      return { success: true, paymentLink: paymentIntent.paymentLink };
    } catch (error) {
      // Xử lý lỗi và trả về cho client
      return { success: false, error: error.message };
    }
  }
}
