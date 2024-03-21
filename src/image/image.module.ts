/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { Event } from 'src/event/entities/event.entity';
import { Booth } from 'src/booth/entities/booth.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Image]), 
    TypeOrmModule.forFeature([Event]),
    TypeOrmModule.forFeature([Booth]),// Ensure ImageRepository is registered in the module
  ],
  providers: [ImageService],
  controllers: [ImageController],
})
export class ImageModule {}