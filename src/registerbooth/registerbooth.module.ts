import { Module } from '@nestjs/common';
import { RegisterboothService } from './registerbooth.service';
import { RegisterboothController } from './registerbooth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Registerbooth } from './entities/registerbooth.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Booth } from 'src/booth/entities/booth.entity';
import { Event } from 'src/event/entities/event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Registerbooth]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Booth]),
    TypeOrmModule.forFeature([Event]),
  ],
  controllers: [RegisterboothController],
  providers: [RegisterboothService, UserService],
})
export class RegisterboothModule {}
