/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { Event } from 'src/event/entities/event.entity';

import { Booth } from 'src/booth/entities/booth.entity';
import { UpdateImageUrlsDto } from './dto/update-image.dto';
@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
    @InjectRepository(Image) private readonly imageRepository: Repository<Image>,
    @InjectRepository(Booth) private readonly boothRepository: Repository<Booth>,
  ) {}

  async checkEventExist(eventId: number) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });
    if (event) return true;
    else return false;
  }

  async checkBoothExist(boothId: number){
    const booth = await this.boothRepository.findOne({
      where: { id: boothId },
    });
    if (booth) return true;
    else return false;
  }

  // create image for event 
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

  // create image for booth
  async createBoothImages(imageUrls: string, boothId: number): Promise<Image> {
    const booth = await this.boothRepository.findOne({
      where: { id: boothId },
    });

    const image = new Image();
    image.url = imageUrls;
    image.boothId = booth;

    return await this.imageRepository.save(image);
  }
  
  // find images by event id
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

  // find images by booth id
  async findImagesByBoothId(boothId: number) {
      
      const isBoothExist = await this.checkBoothExist(boothId);
  
      if (!isBoothExist) {
        throw new NotFoundException(`Booth ${boothId} not exist`);
      }
  
      const boothImages = this.imageRepository.createQueryBuilder('image')
      .innerJoinAndSelect('image.boothId', 'booth')
      .andWhere('image.boothId = :boothId', { boothId })
      .getMany();
      
      return boothImages;
    }

  // update image by event id
  async updateImagebyEventId(
    eventId,
    updateImageUrlsDto: UpdateImageUrlsDto,
  ): Promise<Image[]> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException(`Event ${eventId} not found`);
    }

    // get image by event id
    const images = await this.imageRepository.find({
      where: { eventId: eventId },
    });

    if (!images || images.length === 0) {
      throw new NotFoundException(`No images found for event ${eventId}`);
    }

    if (updateImageUrlsDto.imageUrls.length !== images.length) {
      throw new Error(
        'Number of URLs provided does not match the number of images',
      );
    }

    // Update each image with corresponding URL
    const updatedImages = await Promise.all(
      images.map(async (image, index) => {
        image.url = updateImageUrlsDto.imageUrls[index];
        return await this.imageRepository.save(image);
      }),
    );

    return updatedImages;
  }
}
