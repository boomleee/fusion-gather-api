import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { Event } from 'src/event/entities/event.entity';
import { In } from 'typeorm';
import { Booth } from 'src/booth/entities/booth.entity';

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

  create(createImageDto: CreateImageDto) {
    return 'This action adds a new image';
  }

  findAll() {
    return `This action returns all image`;
  }

  findOne(id: number) {
    return `This action returns a #${id} image`;
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
  
      const boothImages = this.imageRepository.createQueryBuilder('image')
      .innerJoinAndSelect('image.boothId', 'booth')
      .andWhere('image.boothId = :boothId', { boothId })
      .getMany();
      
      return boothImages;
    }

  update(id: number, updateImageDto: UpdateImageDto) {
    return `This action updates a #${id} image`;
  }

  remove(id: number) {
    return `This action removes a #${id} image`;
  }
}
