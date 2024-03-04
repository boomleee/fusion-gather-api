import { Module } from '@nestjs/common';
import { BoothService } from './booth.service';
import { BoothController } from './booth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booth } from './entities/booth.entity';
import { Qrcode } from 'src/qrcode/entities/qrcode.entity';
import { User } from 'src/user/entities/user.entity';
import { Event } from 'src/event/entities/event.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Booth]),
    TypeOrmModule.forFeature([Event]),
    // TypeOrmModule.forFeature([Qrcode]),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [BoothController],
  providers: [BoothService],
})
export class BoothModule {}
