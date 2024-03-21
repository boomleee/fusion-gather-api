
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto'; 
import { UpdateEventDto } from './dto/update-event.dto'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity'; 
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { MoreThanOrEqual } from 'typeorm';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) { }

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

    const event = this.eventRepository.create(createEventDto);
    event.author = user;

    return await this.eventRepository.save(event);
  }

  async findAll({ userId, searchString, category, pageNumber, pageSize }): Promise<Event[]> {
    const query = this.eventRepository.createQueryBuilder('event')
    .innerJoinAndSelect('event.author', 'user')
    // filter by user
    if (userId) {
      query.andWhere('event.author = :userId', { userId: userId });
      return query.getMany();
    }

    // filter by searchString
    if (searchString) {
      query.andWhere('(event.title LIKE :searchString OR event.description LIKE :searchString)', { searchString: `%${searchString}%` });
      query.andWhere('event.isPublished = :isPublished', { isPublished: true });
    }

    // filter by category
    if (category) {
      query.andWhere('event.categoryId = :categoryId', { categoryId: category });
      query.andWhere('event.isPublished = :isPublished', { isPublished: true });
    }

    // pagination
    query.andWhere('event.isPublished = :isPublished', { isPublished: true });
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

  async findPublishedEvent(): Promise<Event[]> {
    const query = this.eventRepository.createQueryBuilder('event');
    query.andWhere('event.isPublished = :isPublished', { isPublished: true });
    return query.getMany();
  }

  async findLatestEvent(): Promise<Event[]> {
    const currentDate = new Date().toISOString();
    const events = await this.eventRepository.find({
      relations: ['author'], 
      where: {
        isPublished: true,
        startDateTime: MoreThanOrEqual(currentDate), //only data that is greater than or equal to current date
      },
      order: {
        startDateTime: 'ASC', 
      },
      take: 3,
    });
    return events;
  }

  async update(id: number, updateEventDto: UpdateEventDto): Promise<Event> {
    const existingEvent = await this.eventRepository.findOne({ where: { id } });

    if (!existingEvent) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    Object.assign(existingEvent, updateEventDto);

    return await this.eventRepository.save(existingEvent);
  }

  async remove(id: number): Promise<void> {
    const eventToRemove = await this.eventRepository.findOne({ where: { id } });

    if (!eventToRemove) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    await this.eventRepository.remove(eventToRemove);
  }
}
function innerJoinAndSelect(arg0: string, arg1: string) {
  throw new Error('Function not implemented.');
}

