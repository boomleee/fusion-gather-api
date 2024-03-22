import { Module } from '@nestjs/common';
import { FolloweventService } from './followevent.service';
import { UserService } from 'src/user/user.service';
import { EventService } from 'src/event/event.service';
import { FolloweventController } from './followevent.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Followevent } from './entities/followevent.entity';
import { User } from 'src/user/entities/user.entity';
import { Event } from 'src/event/entities/event.entity';
import { Booth } from 'src/booth/entities/booth.entity';
import { Registerbooth } from 'src/registerbooth/entities/registerbooth.entity';
import { Image } from 'src/image/entities/image.entity';
import { Qrcode } from 'src/qrcode/entities/qrcode.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';

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
  ],
  controllers: [FolloweventController],
  providers: [FolloweventService, UserService, EventService],
})
export class FolloweventModule {}
