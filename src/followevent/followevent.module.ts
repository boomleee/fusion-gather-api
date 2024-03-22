/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { FolloweventService } from './followevent.service';
import { UserService } from 'src/user/user.service';
import { EventService } from 'src/event/event.service';
import { FolloweventController } from './followevent.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Followevent } from './entities/followevent.entity';
import { User } from 'src/user/entities/user.entity';
import { Event } from 'src/event/entities/event.entity';
import { Image } from 'src/image/entities/image.entity';
import { ImageService } from 'src/image/image.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Followevent]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Event]),
    TypeOrmModule.forFeature([Image]),
  ],
  controllers: [FolloweventController],
  providers: [FolloweventService, UserService, EventService, ImageService],
})
export class FolloweventModule {}
