/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto'; // Đảm bảo sửa tên DTO nếu có
import { UpdateEventDto } from './dto/update-event.dto'; // Đảm bảo sửa tên DTO nếu có
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity'; // Đảm bảo sửa tên Entity nếu có
import { Repository } from 'typeorm';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  //check event exist
  async checkEventTitleExist(title: string) {
    const event = await this.eventRepository.findOne({
      where: { title },
    });
    if (event) return true;
    else return false;
  }

  async create(createEventDto: CreateEventDto) {
    const isEventTitleExist = await this.checkEventTitleExist(
      createEventDto.title,
    );

    if (isEventTitleExist) {
      throw new NotFoundException(`Event ${createEventDto.title} exist`);
    }

    const event = this.eventRepository.create(createEventDto);

    return await this.eventRepository.save(event);
  }

  async findAll(): Promise<Event[]> {
    return await this.eventRepository.find();
  }

  async findOne(id: number): Promise<Event> {
    const existingEvent = await this.eventRepository.findOne({ where: { id } });

    if (!existingEvent) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return existingEvent;
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
