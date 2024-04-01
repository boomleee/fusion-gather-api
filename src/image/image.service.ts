/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { Event } from 'src/event/entities/event.entity';

import { Booth } from 'src/booth/entities/booth.entity';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    @InjectRepository(Booth)
    private readonly boothRepository: Repository<Booth>,
  ) {}

  async createImage(imageUrls, eventId, boothId): Promise<Image> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    const booth = await this.boothRepository.findOne({
      where: { id: boothId },
    });
    const image = new Image();
    image.url = imageUrls;
    image.eventId = event;
    image.boothId = booth;

    return await this.imageRepository.save(image);
  }

  async checkEventExist(eventId: number) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });
    if (event) return true;
    else return false;
  }

  async checkBoothExist(boothId: number) {
    const booth = await this.boothRepository.findOne({
      where: { id: boothId },
    });
    if (booth) return true;
    else return false;
  }
  

  async findImagesByEventId(eventId: number) {

    const isEventExist = await this.checkEventExist(eventId);

    if (!isEventExist) {
      throw new NotFoundException(`Event ${eventId} not exist`);
    }

    const eventImages = this.imageRepository.createQueryBuilder('image')
    .innerJoinAndSelect('image.eventId', 'event')
    .andWhere('image.eventId = :eventId', { eventId })
    .getMany();
    return eventImages;
  }

  async findImagesByBoothId(boothId: number) {
    const isBoothExist = await this.checkBoothExist(boothId);

    if (!isBoothExist) {
      throw new NotFoundException(`Booth ${boothId} not exist`);
    }

    const boothImages = this.imageRepository
      .createQueryBuilder('image')
      .andWhere('image.boothId = :boothId', { boothId })
      .getMany();

    return boothImages;
  }

}
