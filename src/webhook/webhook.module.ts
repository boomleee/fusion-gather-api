/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TicketService } from 'src/ticket/ticket.service';
import { TicketController } from 'src/ticket/ticket.controller';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Event } from 'src/event/entities/event.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { PaymentService } from 'src/payment/payment.service';
import { Booth } from 'src/booth/entities/booth.entity';
import { Category } from 'src/category/entities/category.entity';
import { Image } from 'src/image/entities/image.entity';
import { Qrcode } from 'src/qrcode/entities/qrcode.entity';
import { Registerbooth } from 'src/registerbooth/entities/registerbooth.entity';
import { Followevent } from 'src/followevent/entities/followevent.entity';
import { EventService } from 'src/event/event.service';
import { UserService } from 'src/user/user.service';
import { ImageService } from 'src/image/image.service';
import { QrCodeService } from 'src/qrcode/qrcode.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    TypeOrmModule.forFeature([Booth]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Category]),
    TypeOrmModule.forFeature([Image]),
    TypeOrmModule.forFeature([Qrcode]),
    TypeOrmModule.forFeature([Registerbooth]),
    TypeOrmModule.forFeature([Followevent]),
    TypeOrmModule.forFeature([Ticket]),
    TypeOrmModule.forFeature([Category]),
    TypeOrmModule.forFeature([Payment]),
  ],

  controllers: [TicketController],
  providers: [EventService, UserService, ImageService, QrCodeService, PaymentService,TicketService],
})
export class WebhookModule {}
