/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto'; 
import { UpdateEventDto } from './dto/update-event.dto'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity'; 
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Image } from 'src/image/entities/image.entity'; 
import { ImageService } from 'src/image/image.service';
@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Image) 
    private readonly imageRepository: Repository<Image>,
    private imageService: ImageService,
  ) {}
  //check event exist
  async checkEventTitleExist(title: string) {
    const event = await this.eventRepository.findOne({
      where: { title },
    });
    if (event) return true;
    else return false;
  }
  async create(createEventDto: CreateEventDto, user: User) { 
    const isEventTitleExist = await this.checkEventTitleExist(
      createEventDto.title,
    );

    if (isEventTitleExist) {
      throw new NotFoundException(`Title is exist!`);
    }
    const {imageUrl, ...dtoWithoutImage } = createEventDto;
    const event = this.eventRepository.create({...dtoWithoutImage});
    event.author = user;
    const newEvent = await this.eventRepository.save(event);
    for (const image of imageUrl) {
      console.log("image", image);
      this.imageService.createImage(image, newEvent.id, null)
    }

    return newEvent
  }

  async findAll({ userId, searchString, category, pageNumber, pageSize }): Promise<Event[]> {
    const query = this.eventRepository.createQueryBuilder('event');

    // filter by user
    if (userId) {
      query.andWhere('event.author = :userId', { userId: userId });
    }

    // filter by searchString
    if (searchString) {
      query.andWhere('(event.title LIKE :searchString OR event.description LIKE :searchString)', { searchString: `%${searchString}%` });
    }

    // filter by category
    if (category) {
      query.andWhere('event.categoryId = :category', { categoryId: category });
    }

    // pagination
    query.skip((pageNumber - 1) * pageSize).take(pageSize);

    return query.getMany();
  }

  async findOne(id: number): Promise<Event> {
    const existingEvent = await this.eventRepository.findOne(
      { 
        relations: {
          author: true,
        },
        where: { id } }
      );
    if (!existingEvent) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return existingEvent;
  }


  async findPendingEvent(): Promise<Event[]> { 
    const query = this.eventRepository.createQueryBuilder('event');
    query.andWhere('event.isPublished = :isPublished', { isPublished: false });
    return query.getMany();
  }

  async findLatestEvent(): Promise<Event[]> {
    const query = this.eventRepository.createQueryBuilder('event')
    .innerJoinAndSelect('event.author', 'user')
    .andWhere('event.isPublished = :isPublished', { isPublished: true })
    .andWhere('event.startDateTime > :currentDate', { currentDate: new Date() })
    .addOrderBy('event.startDateTime', 'ASC')
    .take(3);
    return query.getMany();
  }

  async update(id: number, updateEventDto: UpdateEventDto): Promise<Event> {
    const existingEvent = await this.eventRepository.findOne({ where: { id } });
  
    if (!existingEvent) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    const {imageUrl, ...dtoWithoutImage } = updateEventDto;
    if (imageUrl) {
      await this.removeImagesByEventId(id);
    for (const image of imageUrl) {
      this.imageService.createImage(image, id, null)
    }
    }
    Object.assign(existingEvent, dtoWithoutImage);
    return await this.eventRepository.save(existingEvent);
  }
  
  async remove(id: number): Promise<void> {
    const eventToRemove = await this.eventRepository.findOne({ where: { id } });

    if (!eventToRemove) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    await this.eventRepository.remove(eventToRemove);
  }

  async removeImagesByEventId(eventId): Promise<void> {
    const imagesToRemove = await this.imageRepository.createQueryBuilder('image')
    .where('image.eventId = :eventId', { eventId })
    .getMany();
    if (!imagesToRemove) {
      throw new NotFoundException(`No images found for event ${eventId}`);
    }
    try {
      await this.imageRepository.remove(imagesToRemove);
    } catch (error) {
      // Handle error if needed
      console.error('Error removing images:', error);
      throw new Error('Failed to remove images');
    }

  }

  async findPublishedEvent(): Promise<Event[]> {
    const query = this.eventRepository.createQueryBuilder('event');
    query.andWhere('event.isPublished = :isPublished', { isPublished: true });
    return query.getMany();
  }
  }
