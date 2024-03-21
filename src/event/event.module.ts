/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { Event } from './entities/event.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { Category } from 'src/category/entities/category.entity';
import { ImageService } from 'src/image/image.service';
import { Image } from 'src/image/entities/image.entity';
import { Booth } from 'src/booth/entities/booth.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Category]),
    TypeOrmModule.forFeature([Image]),
    TypeOrmModule.forFeature([Booth]),
  ],
  controllers: [EventController],
  providers: [EventService, UserService, ImageService],

})
export class EventModule {}
