import { Module } from '@nestjs/common';
import { FolloweventService } from './followevent.service';
import { UserService } from 'src/user/user.service';
import { EventService } from 'src/event/event.service';
import { FolloweventController } from './followevent.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Followevent } from './entities/followevent.entity';
import { User } from 'src/user/entities/user.entity';
import { Event } from 'src/event/entities/event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Followevent]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Event]),
  ],
  controllers: [FolloweventController],
  providers: [FolloweventService, UserService, EventService],
})
export class FolloweventModule {}
