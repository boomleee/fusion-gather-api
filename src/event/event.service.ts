import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
@Injectable()
export class EventService {
    constructor(
        @InjectRepository(Event)
        private readonly eventRepository: Repository<Event>,
    ) { }

    create(createEventDto: CreateEventDto) {
        return 'This action adds a new event';
    }

    getEvent() {
        return
    }

    getAllEvents() {
        return
    }

    update(id: number, updateEventDto: UpdateEventDto) {
        return
    }

    // delete(id: number) {
    //     return
    // }

}
