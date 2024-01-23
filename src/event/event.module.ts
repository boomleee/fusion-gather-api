/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { Event } from './entities/event.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    TypeOrmModule.forFeature([User])
  ],
  controllers: [EventController],
  providers: [EventService, UserService],
})
export class EventModule { }
