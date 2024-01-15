import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EventService {
    constructor(
        @InjectRepository(Event)
        private readonly eventRepository: Repository<Event>,
    ) { }

    create() {
        return
    }

    getEvent() {
        return
    }

    getAllEvents() {
        return
    }

    update() {
        return
    }

    delete() {
        return
    }
}
