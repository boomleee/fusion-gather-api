import { Module } from '@nestjs/common';
import { BoothService } from './booth.service';
import { BoothController } from './booth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booth } from './entities/booth.entity';
import { Qrcode } from 'src/qrcode/entities/qrcode.entity';
import { User } from 'src/user/entities/user.entity';
import { Event } from 'src/event/entities/event.entity';
import { Registerbooth } from 'src/registerbooth/entities/registerbooth.entity';
import { Image } from 'src/image/entities/image.entity';
import { Type } from 'class-transformer';
import { ImageService } from 'src/image/image.service';
import { QrCodeService } from 'src/qrcode/qrcode.service';
import { Ticket } from 'src/ticket/entities/ticket.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Booth]),
    TypeOrmModule.forFeature([Event]),
    TypeOrmModule.forFeature([Qrcode]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Registerbooth]),
    TypeOrmModule.forFeature([Image]),
    TypeOrmModule.forFeature([Ticket]),
  ],
  controllers: [BoothController],
  providers: [BoothService, ImageService, QrCodeService],
})
export class BoothModule {}
