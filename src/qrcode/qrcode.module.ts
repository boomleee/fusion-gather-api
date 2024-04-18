/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { QrCodeService } from './qrcode.service';
import { QrCodeController } from './qrcode.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from 'src/event/entities/event.entity';
import { Qrcode } from './entities/qrcode.entity';
import { EventService } from 'src/event/event.service';
import { Image } from 'src/image/entities/image.entity';
import { ImageService } from 'src/image/image.service';
import { Registerbooth } from 'src/registerbooth/entities/registerbooth.entity';
import { Booth } from 'src/booth/entities/booth.entity';
import { User } from 'src/user/entities/user.entity';
import { Followevent } from 'src/followevent/entities/followevent.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { UserService } from 'src/user/user.service';
import { FolloweventService } from 'src/followevent/followevent.service';
import { Category } from 'src/category/entities/category.entity';
import { TicketService } from 'src/ticket/ticket.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Followevent]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Event]),
    TypeOrmModule.forFeature([Booth]),
    TypeOrmModule.forFeature([Registerbooth]),
    TypeOrmModule.forFeature([Image]),
    TypeOrmModule.forFeature([Qrcode]),
    TypeOrmModule.forFeature([Ticket]),
    TypeOrmModule.forFeature([Category]),
  ],
  controllers: [QrCodeController],
  providers: [QrCodeService, FolloweventService, UserService, EventService, ImageService, TicketService],
})
export class QrcodeModule {}
